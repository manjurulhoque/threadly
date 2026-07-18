package repositories

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
)

type NotificationRepository interface {
	CreateNotification(notification *models.Notification) error
	GetNotificationsByUserId(userId uint) ([]models.Notification, error)
	MarkAsRead(notificationId uint) error
	MarkAllAsRead(userId uint) error
	MarkAllNotificationsAsRead(userId uint) error
}

type notificationRepository struct {
	db *gorm.DB
}

func NewNotificationRepository(db *gorm.DB) NotificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) CreateNotification(notification *models.Notification) error {
	return r.db.Create(notification).Error
}

func (r *notificationRepository) GetNotificationsByUserId(userId uint) ([]models.Notification, error) {
	var notifications []models.Notification
	err := r.db.Where("user_id = ?", userId).Order("created_at desc").Find(&notifications).Error
	return notifications, err
}

func (r *notificationRepository) MarkAsRead(notificationId uint) error {
	return r.db.Model(&models.Notification{}).Where("id = ?", notificationId).Update("is_read", true).Error
}

func (r *notificationRepository) MarkAllAsRead(userId uint) error {
	return r.db.Model(&models.Notification{}).Where("user_id = ?", userId).Update("is_read", true).Error
}

func (r *notificationRepository) MarkAllNotificationsAsRead(userId uint) error {
	return r.db.Model(&models.Notification{}).Where("user_id = ?", userId).Update("is_read", true).Error
}
