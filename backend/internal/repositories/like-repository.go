package repositories

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
)

type LikeRepository interface {
	LikeThread(like *models.Like) error
	GetLikeByUserAndThread(userId, threadId uint, like *models.Like) error
	UnlikeThread(like *models.Like) error
}

type likeRepository struct {
	db *gorm.DB
}

func NewLikeRepository(db *gorm.DB) LikeRepository {
	return &likeRepository{db}
}

func (r *likeRepository) LikeThread(like *models.Like) error {
	return r.db.Create(like).Error
}

func (r *likeRepository) GetLikeByUserAndThread(userId, threadId uint, like *models.Like) error {
	return r.db.Where("user_id = ? AND thread_id = ?", userId, threadId).First(like).Error
}

func (r *likeRepository) UnlikeThread(like *models.Like) error {
	return r.db.Delete(like).Error
}
