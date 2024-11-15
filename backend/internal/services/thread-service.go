package services

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
)

type ThreadService interface {
	CreateThread(thread models.Thread) error
	GetThreadsForUser(userId uint) ([]models.ThreadWithLike, error)
	GetThreadById(threadId uint) (*models.Thread, error)
	TotalThreadsByUser(userId uint) (int64, error)
	GetThreadsUserReplied(userId uint) ([]models.ThreadWithLike, error)
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

func (s *threadService) GetThreadsForUser(userId uint) ([]models.ThreadWithLike, error) {
	return s.threadRepo.GetThreadsForUser(userId)
}

func (s *threadService) GetThreadById(threadId uint) (*models.Thread, error) {
	return s.threadRepo.GetThreadById(threadId)
}

func (s *threadService) TotalThreadsByUser(userId uint) (int64, error) {
	return s.threadRepo.TotalThreadsByUser(userId)
}

func (s *threadService) GetThreadsUserReplied(userId uint) ([]models.ThreadWithLike, error) {
	return s.threadRepo.GetThreadsUserReplied(userId)
}
