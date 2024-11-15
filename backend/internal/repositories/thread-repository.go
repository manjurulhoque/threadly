package repositories

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
)

type ThreadRepository interface {
	CreateThread(thread *models.Thread) error
	GetThreadsForUser(userId uint) ([]models.ThreadWithLike, error)
	GetThreadById(threadId uint) (*models.Thread, error)
	TotalThreadsByUser(userId uint) (int64, error)
}

type threadRepository struct {
	db *gorm.DB
}

func NewThreadRepository(db *gorm.DB) ThreadRepository {
	return &threadRepository{db}
}

func (r *threadRepository) CreateThread(thread *models.Thread) error {
	return r.db.Create(thread).Error
}

func (r *threadRepository) GetThreadsForUser(userId uint) ([]models.ThreadWithLike, error) {
	var threads []models.ThreadWithLike

	err := r.db.
		Select(`
			threads.*,
			EXISTS (
				SELECT 1
				FROM likes
				WHERE likes.thread_id = threads.id
				  AND likes.user_id = ?
			) AS is_liked
		`, userId).
		Joins("LEFT JOIN follows f ON threads.user_id = f.followee_id").
		Where("threads.user_id = ? OR f.follower_id = ?", userId, userId).
		Preload("User").
		Order("threads.created_at DESC").
		Find(&threads).Error

	return threads, err
}

func (r *threadRepository) GetThreadById(threadId uint) (*models.Thread, error) {
	var thread models.Thread
	err := r.db.Where("id = ?", threadId).Preload("User").First(&thread).Error
	return &thread, err
}

func (r *threadRepository) TotalThreadsByUser(userId uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Thread{}).Where("user_id = ?", userId).Count(&count).Error
	return count, err
}
