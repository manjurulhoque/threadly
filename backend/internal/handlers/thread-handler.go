package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"net/http"
)

type ThreadHandler struct {
	threadService services.ThreadService
}

func NewThreadHandler(threadService services.ThreadService) *ThreadHandler {
	return &ThreadHandler{threadService: threadService}
}

// CreateThread Create thread handler
func (h *ThreadHandler) CreateThread(c *gin.Context) {
	var input struct {
		Content string `json:"content"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	thread := models.Thread{
		Content: input.Content,
		UserID:  1, // Hardcoded for now
	}

	if err := h.threadService.CreateThread(thread); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thread created successfully"})
}
