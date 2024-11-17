package handlers

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
)

type CommentHandler struct {
	commentService      services.CommentService
	notificationService services.NotificationService
	threadService       services.ThreadService
}

func NewCommentHandler(commentService services.CommentService, notificationService services.NotificationService, threadService services.ThreadService) *CommentHandler {
	return &CommentHandler{
		commentService:      commentService,
		notificationService: notificationService,
		threadService:       threadService,
	}
}

func (h *CommentHandler) CommentsByThreadId(c *gin.Context) {
	threadId := c.Param("id")
	comments, err := h.commentService.CommentsByThreadId(threadId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "comments": []models.CommentResponse{}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

// CreateComment Create comment handler
func (h *CommentHandler) CreateComment(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	threadId := c.Param("id")

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

	comment := models.Comment{
		Content:  input.Content,
		ThreadId: utils.StringToUint(threadId),
		UserId:   userId.(uint),
	}

	err := h.commentService.CreateComment(&comment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	thread, err := h.threadService.GetThreadById(comment.ThreadId)
	if err != nil {
		slog.Error("Failed to get thread by id for notification creation in comment handler", "error", err.Error())
	}

	if thread != nil {
		// Create notification for the thread owner
		notification := &models.Notification{
			UserId:    thread.UserID, // Thread owner will receive the notification
			ActorId:   userId.(uint), // current user is the actor
			Type:      models.NotificationTypeComment,
			ThreadId:  &comment.ThreadId,
			CommentId: &comment.ID,
			Url:       fmt.Sprintf("/threads/%s", threadId),
		}

		if err := h.notificationService.CreateNotification(notification); err != nil {
			slog.Error("Failed to create notification for comment creation", "error", err.Error())
		}

		// Broadcast the comment to the thread's users
		broadcast <- Message{
			SenderId:   userId.(uint),
			ReceiverId: thread.UserID,
			Content:    comment.Content,
			Type:       "comment",
		}
	}

	c.JSON(http.StatusCreated, gin.H{"comment": comment})
}
