package repositories

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
)

type ThreadRepository interface {
	CreateThread(thread *models.Thread) error
	GetThreadsForUser(userId uint) ([]models.Thread, error)
}

type threadRepository struct {
	db *gorm.DB
}

func NewThreadRepository(db *gorm.DB) ThreadRepository {
	return &threadRepository{db}
}

func (r *threadRepository) CreateThread(thread *models.Thread) error {
	return r.db.Create(thread).Error
}

func (r *threadRepository) GetThreadsForUser(userId uint) ([]models.Thread, error) {
	var threads []models.Thread
	err := r.db.Where("user_id = ?", userId).Find(&threads).Error
	return threads, err
}
