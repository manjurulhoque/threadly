package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"net/http"
	"strconv"
)

type LikeHandler struct {
	likeService services.LikeService
}

func NewLikeHandler(likeService services.LikeService) *LikeHandler {
	return &LikeHandler{likeService: likeService}
}

// LikeThread Like thread handler
func (h *LikeHandler) LikeThread(c *gin.Context) {
	userId, _ := c.Get("userId")
	threadId, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid thread id"})
		return
	}

	like := models.Like{
		UserId:   userId.(uint),
		ThreadId: uint(threadId),
	}

	err = h.likeService.LikeThread(&like)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Thread liked"})
}
