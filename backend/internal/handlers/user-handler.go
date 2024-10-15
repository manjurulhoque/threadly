package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
	"log/slog"
	"net/http"
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
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input struct {
		Name     string `json:"name" validate:"required"`
		Username string `json:"username" validate:"required"`
		Bio      string `json:"bio"`
	}

	// Log the raw JSON payload
	var rawPayload map[string]interface{}
	if err := c.ShouldBindJSON(&rawPayload); err != nil {
		slog.Error("Error binding raw JSON", "error", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "status": false})
		return
	}
	slog.Info("Raw JSON payload", "payload", rawPayload)

	if err := c.ShouldBindJSON(&input); err != nil {
		slog.Error("Error binding JSON", "error", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "status": false})
		return
	}

	errs := utils.TranslateError(input)
	if errs != nil {
		slog.Error("Validation error", "errors", errs)
		c.JSON(http.StatusBadRequest, gin.H{"errors": errs, "status": false})
		return
	}

	var user models.User
	user.ID = userId.(uint)
	user.Name = input.Name
	user.Username = input.Username
	user.Bio = input.Bio

	// Handle file upload
	file, _ := c.FormFile("image")
	if file != nil {
		// Generate a unique file name using uuid and keep the original extension
		extension := filepath.Ext(file.Filename)                           // Get the file extension
		newFileName := fmt.Sprintf("%s%s", uuid.New().String(), extension) // Generate UUID and append the file extension

		// Define the path to save the file (e.g., "uploads/")
		filePath := filepath.Join("web/uploads", newFileName)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			slog.Error("Error saving file", "error", err.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "status": false})
			return
		}
		user.Image = filePath
	}

	err := h.userService.UpdateUser(&user)
	if err != nil {
		slog.Error("Error updating user profile", "error", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User profile updated successfully"})
}
