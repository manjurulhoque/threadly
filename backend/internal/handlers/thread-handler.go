package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/db"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
	"net/http"
	"sync"
)

type ThreadHandler struct {
	threadService services.ThreadService
}

func NewThreadHandler(threadService services.ThreadService) *ThreadHandler {
	return &ThreadHandler{threadService: threadService}
}

func (h *ThreadHandler) GetThreadsForUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	threads, err := h.threadService.GetThreadsForUser(userId.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Format content for each thread
	for i := range threads {
		threads[i].Content = utils.FormatThreadContent(threads[i].Content)
	}

	c.JSON(http.StatusOK, gin.H{"threads": threads})
}

// CreateThread Create thread handler
func (h *ThreadHandler) CreateThread(c *gin.Context) {
	var input struct {
		Content string `json:"content" validate:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	errs := utils.TranslateError(input)
	if errs != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
		return
	}

	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	usernames := utils.ExtractMentions(input.Content)
	var users []models.User
	var userIDs []uint

	if len(usernames) > 0 {
		// Fetch user IDs from the database
		err := db.DB.Where("username IN ?", usernames).Find(&users).Error
		// If no error, extract user IDs
		if err == nil {
			// Extract user IDs
			for _, user := range users {
				userIDs = append(userIDs, user.ID)
			}
		}
	}

	thread := models.Thread{
		Content: input.Content,
		UserID:  userId.(uint),
	}
	if err := h.threadService.CreateThread(&thread); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Store mentions in the database
	if len(userIDs) > 0 {
		var wg sync.WaitGroup

		wg.Add(1) // Add to the wait group before starting the goroutine

		go func(threadID uint, mentionedUserIDs []uint) {
			defer wg.Done() // Ensure the wait group is marked as done when finished
			for _, userID := range mentionedUserIDs {
				mention := models.Mention{
					ThreadId: threadID,
					UserId:   userID,
				}
				if err := db.DB.Create(&mention).Error; err != nil {
					fmt.Println("Error creating mention:", err)
					continue
				}
			}
		}(thread.ID, userIDs)

		wg.Wait() // Wait for the goroutine to complete
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thread created successfully"})
}

func (h *ThreadHandler) GetThreadById(c *gin.Context) {
	threadId := c.Param("id")
	thread, err := h.threadService.GetThreadById(utils.StringToUint(threadId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"thread": thread})
}

func (h *ThreadHandler) TotalThreadsByUser(c *gin.Context) {
	userId := c.Param("id")
	count, err := h.threadService.TotalThreadsByUser(utils.StringToUint(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"total": count})
}

func (h *ThreadHandler) GetThreadsUserReplied(c *gin.Context) {
	userId := c.Param("id")
	threads, err := h.threadService.GetThreadsUserReplied(utils.StringToUint(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"threads": threads})
}
