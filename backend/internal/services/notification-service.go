package services

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
)

type NotificationService interface {
	CreateNotification(notification *models.Notification) error
	GetNotificationsByUserId(userId uint) ([]models.Notification, error)
	MarkAsRead(notificationId uint) error
	MarkAllAsRead(userId uint) error
}

type notificationService struct {
	notificationRepository repositories.NotificationRepository
}

func NewNotificationService(notificationRepository repositories.NotificationRepository) NotificationService {
	return &notificationService{notificationRepository: notificationRepository}
}

func (s *notificationService) CreateNotification(notification *models.Notification) error {
	return s.notificationRepository.CreateNotification(notification)
}

func (s *notificationService) GetNotificationsByUserId(userId uint) ([]models.Notification, error) {
	return s.notificationRepository.GetNotificationsByUserId(userId)
}

func (s *notificationService) MarkAsRead(notificationId uint) error {
	return s.notificationRepository.MarkAsRead(notificationId)
}

func (s *notificationService) MarkAllAsRead(userId uint) error {
	return s.notificationRepository.MarkAllAsRead(userId)
}
