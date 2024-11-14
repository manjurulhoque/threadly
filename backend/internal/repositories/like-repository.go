package repositories

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
)

type LikeRepository interface {
	LikeThread(like *models.Like) error
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
