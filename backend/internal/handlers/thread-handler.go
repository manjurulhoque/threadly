package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
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

	thread := models.Thread{
		Content: input.Content,
		UserID:  userId.(uint),
	}
	if err := h.threadService.CreateThread(thread); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thread created successfully"})
}
