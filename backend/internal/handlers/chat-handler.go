package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/manjurulhoque/threadly/backend/internal/db"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
	"log/slog"
	"net/http"
	"strconv"
	"sync"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins, need to secure this in production
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var broadcast = make(chan Message) // Channel to broadcast messages

type Message struct {
	SenderId   uint   `json:"sender_id"`
	ReceiverId uint   `json:"receiver_id"`
	Content    string `json:"content"`
}

type ConnectionManager struct {
	userConnections map[uint][]*websocket.Conn // Map user ID to their connections (allowing multiple devices)
	mu              sync.RWMutex               // Mutex for thread-safe operations
}

var manager = ConnectionManager{
	userConnections: make(map[uint][]*websocket.Conn),
}

// GetChatUsers returns list of users the authenticated user has chatted with
func GetChatUsers(c *gin.Context) {
	userID := c.GetUint("userId")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var users []models.PublicUser
	result := db.DB.Raw(`
		SELECT DISTINCT u.* 
		FROM users u
		INNER JOIN messages m 
		ON (m.sender_id = u.id OR m.receiver_id = u.id)
		WHERE (m.sender_id = ? OR m.receiver_id = ?) 
		AND u.id != ?`,
		userID, userID, userID).
		Find(&users)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

// GetMessages returns paginated messages between two users
func GetMessages(c *gin.Context) {
	// Get current user ID from context
	userID := c.GetUint("userId")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get receiver ID from URL param
	receiverID, err := strconv.ParseUint(c.Param("receiverId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid receiver ID"})
		return
	}

	// Get pagination params from query
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset := (page - 1) * limit

	var messages []models.Message
	var total int64

	// Get total count
	result := db.DB.Model(&models.Message{}).
		Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
			userID, receiverID, receiverID, userID).
		Count(&total)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count messages"})
		return
	}

	// Get paginated messages
	result = db.DB.
		Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
			userID, receiverID, receiverID, userID).
		Order("created_at ASC").
		Offset(offset).
		Limit(limit).
		Find(&messages)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"messages": messages,
		"total":    total,
		"page":     page,
		"limit":    limit,
	})
}

// HandleConnections updated to use the new structure
func HandleConnections(c *gin.Context) {
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		slog.Error("WebSocket Upgrade Error", "error", err.Error())
		return
	}

	userID := c.GetUint("userId")
	slog.Info("New WebSocket connection", "user_id", userID)

	// Close existing connection if any
	manager.mu.Lock()
	if existingConn, exists := manager.userConnections[userID]; exists {
		for _, conn := range existingConn {
			conn.Close()
		}
	}
	manager.userConnections[userID] = []*websocket.Conn{ws}
	manager.mu.Unlock()

	defer func() {
		slog.Info("WebSocket connection closing", "user_id", userID)
		manager.mu.Lock()
		delete(manager.userConnections, userID)
		manager.mu.Unlock()
		ws.Close()
	}()

	// Handle incoming messages
	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			slog.Error("Error reading message", "error", err.Error())
			break
		}
		slog.Info("Received message from WebSocket", "message", msg)
		broadcast <- msg
	}
}

func SaveMessageToDB(db *gorm.DB, msg Message) error {
	message := models.Message{
		SenderId:   msg.SenderId,
		ReceiverId: msg.ReceiverId,
		Content:    msg.Content,
	}
	return db.Create(&message).Error
}

// HandleMessages updated for efficient message delivery
func HandleMessages(db *gorm.DB, wg *sync.WaitGroup) {
	slog.Info("Starting HandleMessages") // Add logging
	defer wg.Done()
	for {
		slog.Info("Waiting for message from broadcast channel")
		msg := <-broadcast
		slog.Info("Received message from broadcast channel", "message", msg)

		// Save message to the database
		err := SaveMessageToDB(db, msg)
		if err != nil {
			slog.Error("Failed to save message", "error", err.Error())
			continue
		}

		// Direct access to relevant connections
		manager.mu.RLock()
		// Send to sender's connections
		if senderConn, ok := manager.userConnections[msg.SenderId]; ok {
			slog.Info("Sending message to sender", "sender_id", msg.SenderId)
			for _, conn := range senderConn {
				if err := conn.WriteJSON(msg); err != nil {
					slog.Error("Failed to send to sender", "error", err.Error())
					conn.Close()
				}
			}
		}
		// Send to receiver's connections
		if receiverConn, ok := manager.userConnections[msg.ReceiverId]; ok {
			slog.Info("Sending message to receiver", "receiver_id", msg.ReceiverId)
			for _, conn := range receiverConn {
				if err := conn.WriteJSON(msg); err != nil {
					slog.Error("Failed to send to receiver", "error", err.Error())
					conn.Close()
				}
			}
		}
		manager.mu.RUnlock()
	}
}

func GetChatHistory(c *gin.Context) {
	var messages []models.Message
	userID := c.Query("user_id")
	partnerID := c.Query("partner_id")
	limit := c.Query("limit")
	offset := c.Query("offset")

	limitInt, _ := strconv.Atoi(limit)
	offsetInt, _ := strconv.Atoi(offset)

	err := db.DB.Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
		userID, partnerID, partnerID, userID).
		Order("created_at DESC").
		Limit(limitInt).
		Offset(offsetInt).
		Find(&messages).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chat history"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

func GetUnreadMessagesCount(c *gin.Context) {
	userID := c.GetUint("userId")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var count int64
	err := db.DB.Model(&models.Message{}).
		Where("receiver_id = ? AND is_read = ?", userID, false).
		Count(&count).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count unread messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"unread_messages_count": count})
}
