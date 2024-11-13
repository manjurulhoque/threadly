package services

import (
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
	"golang.org/x/crypto/bcrypt"
	"time"
)

// Define constants for token expiration
const (
	accessTokenExpiry  = time.Minute * 60
	refreshTokenExpiry = time.Hour * 24 * 7
)

type UserService interface {
	RegisterUser(username, name, email, password string) error
	LoginUser(email, password string) (string, string, error) // Returns access and refresh tokens
	RefreshToken(refreshToken string) (string, error)         // Returns new access token
	VerifyToken(token string) (*JWTCustomClaims, error)
	GetUserById(userId uint) (*models.PublicUser, error)
	UpdateUser(uint, map[string]interface{}) error
	GetSimilarMinds(userId uint) ([]models.PublicUser, error)
}

var jwtSecret = []byte("ABC123")

type JWTCustomClaims struct {
	jwt.RegisteredClaims
	IsAdmin bool   `json:"is_admin"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	UserId  uint   `json:"user_id"`
}

type userService struct {
	userRepo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{userRepo: repo}
}

// Password Hashing and Verification
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// RegisterUser Register User
func (s *userService) RegisterUser(username, name, email, password string) error {
	hashedPassword, err := hashPassword(password)
	if err != nil {
		return err
	}

	user := &models.User{
		Username: username,
		Name:     name,
		Email:    email,
		Password: hashedPassword,
		IsAdmin:  false,
	}

	return s.userRepo.CreateUser(user)
}

// LoginUser Login User
func (s *userService) LoginUser(email, password string) (string, string, error) {
	user, err := s.userRepo.GetUserByEmail(email)
	if err != nil {
		return "", "", errors.New("user not found")
	}

	if !checkPasswordHash(password, user.Password) {
		return "", "", errors.New("incorrect password")
	}

	// Generate Access and Refresh Tokens
	accessToken, err := s.generateToken(user, accessTokenExpiry)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := s.generateToken(user, refreshTokenExpiry)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

// generateToken Generate JWT Token
func (s *userService) generateToken(user *models.User, expiry time.Duration) (string, error) {
	claims := JWTCustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprintf("%d", user.ID),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ID:        uuid.New().String(),
		},
		IsAdmin: user.IsAdmin,
		Name:    user.Name,
		Email:   user.Email,
		UserId:  user.ID,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// RefreshToken Refresh Access Token
func (s *userService) RefreshToken(refreshToken string) (string, error) {
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("invalid refresh token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", errors.New("invalid token claims")
	}

	// Get the user by ID
	userId := uint(claims["sub"].(float64))
	user, err := s.userRepo.GetUserById(userId)
	if err != nil {
		return "", errors.New("user not found")
	}

	return s.generateToken(user, time.Minute*15)
}

// VerifyToken Verify token
func (s *userService) VerifyToken(tokenString string) (*JWTCustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*JWTCustomClaims)
	if !ok || !token.Valid {
		return nil, errors.New("unauthorized")
	}
	return claims, nil
}

// GetUserById Get User By ID
func (s *userService) GetUserById(userId uint) (*models.PublicUser, error) {
	user, err := s.userRepo.GetUserById(userId)
	if err != nil {
		return nil, err
	}

	return &models.PublicUser{
		Id:        user.ID,
		Name:      user.Name,
		Username:  user.Username,
		Image:     user.Image,
		Bio:       user.Bio,
		Onboarded: user.Onboarded,
	}, nil
}

// UpdateUser Update User
func (s *userService) UpdateUser(userId uint, updates map[string]interface{}) error {
	return s.userRepo.UpdateUser(userId, updates)
}

// GetSimilarMinds Get Similar Minds
func (s *userService) GetSimilarMinds(userId uint) ([]models.PublicUser, error) {
	users, err := s.userRepo.GetSimilarMinds(userId)
	if err != nil {
		return nil, err
	}

	var similarMinds []models.PublicUser
	for _, user := range users {
		similarMinds = append(similarMinds, models.PublicUser{
			Id:        user.Id,
			Name:      user.Name,
			Username:  user.Username,
			Image:     user.Image,
			Bio:       user.Bio,
			Onboarded: user.Onboarded,
		})
	}

	return similarMinds, nil
}
