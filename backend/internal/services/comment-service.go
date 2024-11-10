package services

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
)

type CommentService interface {
	CreateComment(comment *models.Comment) error
	CommentsByThreadId(threadId string) ([]models.Comment, error)
}

type commentService struct {
	commentRepo repositories.CommentRepository
}

func NewCommentService(commentRepo repositories.CommentRepository) CommentService {
	return &commentService{commentRepo}
}

func (s *commentService) CreateComment(comment *models.Comment) error {
	return s.commentRepo.CreateComment(comment)
}

func (s *commentService) CommentsByThreadId(threadId string) ([]models.Comment, error) {
	return s.commentRepo.CommentsByThreadId(threadId)
}
