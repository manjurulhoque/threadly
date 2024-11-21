package handlers

import (
	"fmt"
	"log/slog"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/db"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
)

type ThreadHandler struct {
	threadService services.ThreadService
}

func NewThreadHandler(threadService services.ThreadService) *ThreadHandler {
	return &ThreadHandler{threadService: threadService}
}

func (h *ThreadHandler) GetThreadsForUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	threads, err := h.threadService.GetThreadsForUser(userId.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Format content for each thread
	for i := range threads {
		threads[i].Content = utils.FormatThreadContent(threads[i].Content)
	}

	c.JSON(http.StatusOK, gin.H{"threads": threads})
}

// CreateThread Create thread handler
func (h *ThreadHandler) CreateThread(c *gin.Context) {
	var input struct {
		Content string `json:"content" validate:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	errs := utils.TranslateError(input)
	if errs != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
		return
	}

	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	usernames := utils.ExtractMentions(input.Content)
	extractedHashtags := utils.ExtractHashtags(input.Content)
	var users []models.User
	var userIDs []uint
	var hashtags []models.HashTag

	if len(usernames) > 0 {
		// Fetch user IDs from the database
		err := db.DB.Where("username IN ?", usernames).Find(&users).Error
		if err == nil {
			for _, user := range users {
				userIDs = append(userIDs, user.ID)
			}
		}
	}

	if len(extractedHashtags) > 0 {
		// Fetch existing hashtags from the database
		err := db.DB.Where("name IN ?", extractedHashtags).Find(&hashtags).Error
		if err != nil {
			slog.Error("Error fetching hashtags", "error", err.Error())
		}

		// Create new hashtags that do not exist
		for _, hashtagName := range extractedHashtags {
			if !containsHashtag(hashtags, hashtagName) {
				newHashtag := models.HashTag{Name: hashtagName}
				if err := db.DB.Create(&newHashtag).Error; err == nil {
					hashtags = append(hashtags, newHashtag) // Add new hashtag to the slice
				}
			}
		}
	}

	thread := models.Thread{
		Content: input.Content,
		UserID:  userId.(uint),
	}
	if err := h.threadService.CreateThread(&thread); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Store mentions in the database
	if len(userIDs) > 0 {
		var wg sync.WaitGroup
		wg.Add(1)

		go func(threadID uint, mentionedUserIDs []uint) {
			defer wg.Done()
			for _, userID := range mentionedUserIDs {
				mention := models.Mention{
					ThreadId: threadID,
					UserId:   userID,
				}
				if err := db.DB.Create(&mention).Error; err != nil {
					fmt.Println("Error creating mention:", err)
					continue
				}
			}
		}(thread.ID, userIDs)

		wg.Wait()
	}

	// Attach hashtags to the thread using GORM M2M relation
	if len(hashtags) > 0 {
		for _, hashtag := range hashtags {
			if err := db.DB.Model(&thread).Association("Threads").Append(&hashtag); err != nil {
				fmt.Println("Error attaching hashtag to thread:", err)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"thread": thread})
}

func containsHashtag(hashtags []models.HashTag, name string) bool {
	for _, hashtag := range hashtags {
		if hashtag.Name == name {
			return true
		}
	}
	return false
}

func (h *ThreadHandler) GetThreadById(c *gin.Context) {
	threadId := c.Param("id")
	thread, err := h.threadService.GetThreadById(utils.StringToUint(threadId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Format content for each thread
	thread.Content = utils.FormatThreadContent(thread.Content)

	c.JSON(http.StatusOK, gin.H{"thread": thread})
}

func (h *ThreadHandler) TotalThreadsByUser(c *gin.Context) {
	userId := c.Param("id")
	count, err := h.threadService.TotalThreadsByUser(utils.StringToUint(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"total": count})
}

func (h *ThreadHandler) GetThreadsUserReplied(c *gin.Context) {
	userId := c.Param("id")
	threads, err := h.threadService.GetThreadsUserReplied(utils.StringToUint(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Format content for each thread
	for i := range threads {
		threads[i].Content = utils.FormatThreadContent(threads[i].Content)
	}

	c.JSON(http.StatusOK, gin.H{"threads": threads})
}

func (h *ThreadHandler) GetThreadsWhereUserWasMentioned(c *gin.Context) {
	userId := c.Param("id")
	currentUserId, _ := c.Get("userId")
	threads, err := h.threadService.GetThreadsWhereUserWasMentioned(utils.StringToUint(userId), currentUserId.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Format content for each thread
	for i := range threads {
		threads[i].Content = utils.FormatThreadContent(threads[i].Content)
	}

	c.JSON(http.StatusOK, gin.H{"threads": threads})
}
