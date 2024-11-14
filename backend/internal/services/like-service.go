package services

import "github.com/manjurulhoque/threadly/backend/internal/repositories"

type LikeService interface {
	LikeThread(threadId uint, userId uint) error
}

type likeService struct {
	likeRepo repositories.LikeRepository
}
