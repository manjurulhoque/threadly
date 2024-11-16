package services

import (
	"fmt"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
	"log/slog"
)

type ThreadService interface {
	CreateThread(thread *models.Thread) error
	GetThreadsForUser(userId uint) ([]models.ThreadWithLike, error)
	GetThreadById(threadId uint) (*models.Thread, error)
	TotalThreadsByUser(userId uint) (int64, error)
	GetThreadsUserReplied(userId uint) ([]models.ThreadWithLike, error)
	GetThreadsWhereUserWasMentioned(userId uint) ([]models.ThreadWithLike, error)
}

type threadService struct {
	threadRepo repositories.ThreadRepository
}

func NewThreadService(repo repositories.ThreadRepository) ThreadService {
	return &threadService{threadRepo: repo}
}

func (s *threadService) CreateThread(thread *models.Thread) error {
	err := s.threadRepo.CreateThread(thread)
	if err != nil {
		slog.Error("Failed to create thread", "error", err.Error())
	}
	return err
}

func (s *threadService) GetThreadsForUser(userId uint) ([]models.ThreadWithLike, error) {
	return s.threadRepo.GetThreadsForUser(userId)
}

func (s *threadService) GetThreadById(threadId uint) (*models.Thread, error) {
	thread, err := s.threadRepo.GetThreadById(threadId)
	if err != nil {
		return nil, fmt.Errorf("failed to get thread by id %d: %w", threadId, err)
	}
	return thread, nil
}

func (s *threadService) TotalThreadsByUser(userId uint) (int64, error) {
	return s.threadRepo.TotalThreadsByUser(userId)
}

func (s *threadService) GetThreadsUserReplied(userId uint) ([]models.ThreadWithLike, error) {
	return s.threadRepo.GetThreadsUserReplied(userId)
}

func (s *threadService) GetThreadsWhereUserWasMentioned(userId uint) ([]models.ThreadWithLike, error) {
	threads, err := s.threadRepo.GetThreadsWhereUserWasMentioned(userId)
	if err != nil {
		slog.Error("Failed to get threads where user was mentioned", "error", err.Error())
		return nil, fmt.Errorf("failed to get threads where user was mentioned: %w", err)
	}
	return threads, nil
}
