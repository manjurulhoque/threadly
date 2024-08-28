package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/db"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"net/http"
	"strconv"
)

func FollowUser(c *gin.Context) {
	userID := c.Param("id")
	followerID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Convert string to uint
	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Check if the user is already followed
	var existingFollow models.Follow
	if err := db.DB.Where("follower_id = ? AND followee_id = ?", followerID, uint(id)).First(&existingFollow).Error; err == nil {
		// Record exists, meaning the user is already followed
		c.JSON(http.StatusConflict, gin.H{"error": "You are already following this user"})
		return
	}

	// Create follow relationship
	follow := models.Follow{
		FollowerID: followerID.(uint),
		FolloweeID: uint(id),
	}

	if err := db.DB.Create(&follow).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to follow user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User followed successfully"})
}

func UnfollowUser(c *gin.Context) {
	userID := c.Param("id")
	followerID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	if err := db.DB.Where("follower_id = ? AND followee_id = ?", followerID, id).Delete(&models.Follow{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unfollow user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User unfollowed successfully"})
}
