package services

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
)

type ThreadService interface {
	CreateThread(content string, userId uint) error
}

type threadService struct {
	threadRepo repositories.ThreadRepository
}

func NewThreadService(repo repositories.ThreadRepository) ThreadService {
	return &threadService{threadRepo: repo}
}

func (s *threadService) CreateThread(content string, userId uint) error {
	thread := &models.Thread{
		Content: content,
		UserID:  userId,
	}
	return s.threadRepo.CreateThread(thread)
}
