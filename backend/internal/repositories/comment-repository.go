package repositories

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
)

type CommentRepository interface {
	CreateComment(comment *models.Comment) error
	CommentsByThreadId(threadId string) ([]models.CommentResponse, error)
}

type commentRepository struct {
	db *gorm.DB
}

func NewCommentRepository(db *gorm.DB) CommentRepository {
	return &commentRepository{db}
}

func (r *commentRepository) CreateComment(comment *models.Comment) error {
	return r.db.Create(comment).Error
}

func (r *commentRepository) CommentsByThreadId(threadId string) ([]models.CommentResponse, error) {
	var comments []models.CommentResponse
	err := r.db.Where("thread_id = ?", threadId).Preload("User").Find(&comments).Error
	return comments, err
}
