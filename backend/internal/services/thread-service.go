package services

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
)

type ThreadService interface {
	CreateThread(thread models.Thread) error
}

type threadService struct {
	threadRepo repositories.ThreadRepository
}

func NewThreadService(repo repositories.ThreadRepository) ThreadService {
	return &threadService{threadRepo: repo}
}

func (s *threadService) CreateThread(thread models.Thread) error {
	return s.threadRepo.CreateThread(&thread)
}
