package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/threadly/backend/internal/db"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
	"log/slog"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

type UserHandler struct {
	userService services.UserService
}

func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// Register user handler
func (h *UserHandler) Register(c *gin.Context) {
	var input struct {
		Name     string `json:"name" validate:"required"`
		Username string `json:"username" validate:"required"`
		Email    string `json:"email" validate:"required,email,emailExists"`
		Password string `json:"password" validate:"required"`
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

	slog.Info("Input", "input", input)

	if err := h.userService.RegisterUser(input.Username, input.Name, input.Email, input.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

// Login user handler
func (h *UserHandler) Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email" validate:"required"`
		Password string `json:"password" validate:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken, refreshToken, err := h.userService.LoginUser(input.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access":  accessToken,
		"refresh": refreshToken,
	})
}

// Refresh token handler
func (h *UserHandler) Refresh(c *gin.Context) {
	var input struct {
		RefreshToken string `json:"refresh_token" validate:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken, err := h.userService.RefreshToken(input.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": accessToken})
}

func (h *UserHandler) GetUserById(c *gin.Context) {
	userId := c.Param("id")
	userIdInt, err := strconv.Atoi(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user id"})
		return
	}
	user, err := h.userService.GetUserById(uint(userIdInt))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": user})
}

func (h *UserHandler) UpdateUserProfile(c *gin.Context) {
	var input struct {
		Name     string                `form:"name" validate:"required"`
		Username string                `form:"username" validate:"required"`
		Bio      string                `form:"bio" validate:"required"`
		Image    *multipart.FileHeader `form:"image"`
	}

	// Bind input
	if err := c.ShouldBind(&input); err != nil {
		slog.Error("Error binding JSON", "error", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "status": false})
		return
	}

	// Validate input
	errs := utils.TranslateError(input)
	if errs != nil {
		slog.Error("Validation error", "errors", errs)
		c.JSON(http.StatusBadRequest, gin.H{"errors": errs, "status": false})
		return
	}
	userId, _ := c.Get("userId")

	// Prepare updates
	updates := map[string]interface{}{
		"Name":     input.Name,
		"Username": input.Username,
		"Bio":      input.Bio,
	}

	// Handle file upload
	if input.Image != nil {
		// Define the path where files should be saved
		uploadsPath := "./web/uploads"

		// Check if the uploads directory exists; create it if it doesn't
		if _, err := os.Stat(uploadsPath); os.IsNotExist(err) {
			err = os.MkdirAll(uploadsPath, os.ModePerm)
			if err != nil {
				slog.Error("Failed to create uploads directory", "error", err.Error())
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
				return
			}
		}
		slog.Info("Uploads directory created", "Filename", input.Image.Filename)
		extension := filepath.Ext(input.Image.Filename)
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension)
		filePath := filepath.Join(uploadsPath, newFileName)
		slog.Info("File path", "path", filePath)

		// Save the uploaded file
		if err := c.SaveUploadedFile(input.Image, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
			return
		}
		updates["Image"] = filePath
	}

	err := h.userService.UpdateUser(userId.(uint), updates)
	if err != nil {
		slog.Error("Error updating user profile", "error", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User profile updated successfully"})
}

func (h *UserHandler) GetSimilarMinds(c *gin.Context) {
	userId, _ := c.Get("userId")
	users, err := h.userService.GetSimilarMinds(userId.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": users})
}

// IsFollowing Check if current logged-in user is following another user
func (h *UserHandler) IsFollowing(c *gin.Context) {
	userId, _ := c.Get("userId") // Get the current logged-in user ID
	userIdInt, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user id"})
		return
	}
	isFollowing, err := h.userService.IsFollowing(uint(userIdInt), userId.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": isFollowing})
}

// GetThreadsForUser Get threads for a user
func (h *UserHandler) GetThreadsForUser(c *gin.Context) {
	userId := c.Param("id")

	threads, err := h.userService.GetThreadsForUser(utils.StringToUint(userId))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"threads": threads})
}

// GetUserSuggestions Get user suggestions for autocomplete
func (h *UserHandler) GetUserSuggestions(c *gin.Context) {
	userID, _ := c.Get("userId")
	query := c.Query("query") // Query string for autocomplete

	var users []models.PublicUser
	err := db.DB.Table("follows").
		Select("users.id, users.username, users.name").
		Joins("JOIN users ON follows.followee_id = users.id").
		Where("follows.follower_id = ? AND users.username LIKE ?", userID, "%"+query+"%").
		Find(&users).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}
