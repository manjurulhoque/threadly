package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/db"
)

type HashtagHandler struct {}

func NewHashtagHandler() *HashtagHandler {
	return &HashtagHandler{}
}

func (h *HashtagHandler) GetTrendingHashtags(c *gin.Context) {
	var hashtags []struct {
		ID          uint      `json:"id"`
		Name        string    `json:"name"`
		CreatedAt   time.Time `json:"created_at"`
		UpdatedAt   time.Time `json:"updated_at"`
		ThreadCount int       `json:"thread_count"`
	}

	// Get trending hashtags with their usage count
	query := `
		SELECT h.id, h.name, h.created_at, h.updated_at, COUNT(th.thread_id) as thread_count
		FROM hash_tags h
		LEFT JOIN thread_hash_tags th ON h.id = th.hash_tag_id
		LEFT JOIN threads t ON th.thread_id = t.id
		WHERE t.created_at >= NOW() - INTERVAL '7 days'
		GROUP BY h.id, h.name, h.created_at, h.updated_at
		HAVING COUNT(th.thread_id) > 0
		ORDER BY thread_count DESC
		LIMIT 10
	`

	if err := db.DB.Raw(query).Scan(&hashtags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch trending hashtags"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"hashtags": hashtags})
}