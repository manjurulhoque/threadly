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

var clients = make(map[*websocket.Conn]bool) // Connected clients
var broadcast = make(chan Message)           // Channel to broadcast messages

type Message struct {
	SenderId   uint   `json:"sender_id"`
	ReceiverId uint   `json:"receiver_id"`
	Content    string `json:"content"`
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



// HandleConnections WebSocket handler
func HandleConnections(c *gin.Context) {
	//upgrades the HTTP connection to a WebSocket connection
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		slog.Error("WebSocket Upgrade Error", "error", err.Error())
		return
	}
	defer func(ws *websocket.Conn) {
		err := ws.Close()
		if err != nil {
			slog.Error("WebSocket Close Error", "error", err.Error())
		}
	}(ws)

	clients[ws] = true

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			// If an error occurs, remove the client and break the loop
			slog.Error("WebSocket Read Error", "error", err.Error())
			delete(clients, ws)
			break
		}

		// Process and broadcast the message
		slog.Info("Received message", "message", msg)
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

// HandleMessages Broadcast messages to all connected clients
func HandleMessages(db *gorm.DB, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		msg := <-broadcast

		// Save message to the database
		err := SaveMessageToDB(db, msg)
		if err != nil {
			slog.Error("Failed to save message", "error", err.Error())
		}

		// Send message to all clients
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				client.Close()
				delete(clients, client)
			}
		}
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
