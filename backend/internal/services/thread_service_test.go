package services

import (
	"testing"

	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/stretchr/testify/assert"
)

type mockThreadRepository struct {
	threads map[uint]*models.Thread
	nextID  uint
}

func newMockThreadRepo() *mockThreadRepository {
	return &mockThreadRepository{threads: make(map[uint]*models.Thread), nextID: 1}
}

func (m *mockThreadRepository) CreateThread(thread *models.Thread) error {
	thread.ID = m.nextID
	m.nextID++
	m.threads[thread.ID] = thread
	return nil
}

func (m *mockThreadRepository) GetThreadsForUser(userId uint) ([]models.ThreadWithLike, error) {
	var threads []models.ThreadWithLike
	for _, t := range m.threads {
		if t.UserID == userId {
			threads = append(threads, models.ThreadWithLike{Thread: *t})
		}
	}
	return threads, nil
}

func (m *mockThreadRepository) GetThreadById(threadId uint) (*models.Thread, error) {
	if thread, exists := m.threads[threadId]; exists {
		return thread, nil
	}
	return nil, assert.AnError
}

func (m *mockThreadRepository) TotalThreadsByUser(userId uint) (int64, error) {
	var count int64
	for _, t := range m.threads {
		if t.UserID == userId {
			count++
		}
	}
	return count, nil
}

func (m *mockThreadRepository) GetThreadsUserReplied(userId uint) ([]models.ThreadWithLike, error) {
	var threads []models.ThreadWithLike
	for _, t := range m.threads {
		if t.UserID == userId {
			threads = append(threads, models.ThreadWithLike{Thread: *t})
		}
	}
	return threads, nil
}

func (m *mockThreadRepository) GetThreadsWhereUserWasMentioned(userId, currentUserId uint) ([]models.ThreadWithLike, error) {
	var threads []models.ThreadWithLike
	for _, t := range m.threads {
		if t.UserID == userId && t.UserID != currentUserId {
			threads = append(threads, models.ThreadWithLike{Thread: *t})
		}
	}
	return threads, nil
}

func setupThreadServiceWithMockRepo() (ThreadService, *mockThreadRepository) {
	mockRepo := newMockThreadRepo()
	service := NewThreadService(mockRepo)
	return service, mockRepo
}

func TestCreateThread(t *testing.T) {
	service, _ := setupThreadServiceWithMockRepo()

	thread := &models.Thread{
		UserID:  1,
		Content: "This is a test thread",
	}

	err := service.CreateThread(thread)
	assert.NoError(t, err)
}
