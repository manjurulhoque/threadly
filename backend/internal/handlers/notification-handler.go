package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/services"
)

type NotificationHandler struct {
	notificationService services.NotificationService
}

func NewNotificationHandler(notificationService services.NotificationService) *NotificationHandler {
	return &NotificationHandler{notificationService}
}

func (h *NotificationHandler) GetNotifications(c *gin.Context) {
	userId := c.GetUint("userId")
	notifications, err := h.notificationService.GetNotificationsByUserId(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"notifications": notifications})
}

func (h *NotificationHandler) MarkAllNotificationsAsRead(c *gin.Context) {
	userId := c.GetUint("userId")
	err := h.notificationService.MarkAllNotificationsAsRead(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
