package services

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
)

type LikeService interface {
	LikeThread(like *models.Like) error
	GetLikeByUserAndThread(userId, threadId uint, like *models.Like) error
	UnlikeThread(like *models.Like) error
}

type likeService struct {
	likeRepo repositories.LikeRepository
}

func NewLikeService(repo repositories.LikeRepository) LikeService {
	return &likeService{likeRepo: repo}
}

func (s *likeService) LikeThread(like *models.Like) error {
	return s.likeRepo.LikeThread(like)
}

func (s *likeService) GetLikeByUserAndThread(userId, threadId uint, like *models.Like) error {
	return s.likeRepo.GetLikeByUserAndThread(userId, threadId, like)
}

func (s *likeService) UnlikeThread(like *models.Like) error {
	return s.likeRepo.UnlikeThread(like)
}
