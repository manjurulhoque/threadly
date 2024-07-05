package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
	"net/http"
)

type CommentHandler struct {
	commentService services.CommentService
}

func NewCommentHandler(commentService services.CommentService) *CommentHandler {
	return &CommentHandler{commentService: commentService}
}

// CreateComment Create comment handler
func (h *CommentHandler) CreateComment(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input struct {
		Content  string `json:"content" validate:"required"`
		ThreadId uint   `json:"thread_id" validate:"required"`
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

	comment := models.Comment{
		Content:  input.Content,
		ThreadId: input.ThreadId,
		UserId:   userId.(uint),
	}

	err := h.commentService.CreateComment(&comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"comment": comment})
}
