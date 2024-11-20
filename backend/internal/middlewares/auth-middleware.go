package middlewares

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"log/slog"
	"net/http"
	"strings"
)

const (
	authorizationHeaderKey = "Authorization"
	claimsKey              = "Claims"
	userIdKey              = "userId"
	emailKey               = "email"
	isAdminKey             = "isAdmin"
	tokenKey               = "token"
)

func AuthMiddleware(userRepo repositories.UserRepository, userService services.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get(authorizationHeaderKey)
		parts := strings.Split(token, " ")

		if len(parts) != 2 || parts[0] != "Bearer" {
			slog.Error("Bearer token missing")
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Bearer token required",
			})
			c.Abort()
			return
		}

		bearerToken := parts[1]
		claims, err := userService.VerifyToken(bearerToken)
		if err != nil {
			slog.Error("Error verifying token", "error", err.Error())
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": err.Error(),
			})
			c.Abort()
			return
		}

		user, err := userRepo.GetUserByEmail(claims.Email)
		if err != nil || user.Email != claims.Email {
			slog.Error("Unauthorized access attempt", "error", "User does not match token claims")
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Unauthorized",
			})
			c.Abort()
			return
		}

		c.Set(claimsKey, claims)
		c.Set(userIdKey, user.ID)
		c.Set(emailKey, user.Email)
		c.Set(isAdminKey, user.IsAdmin)
		c.Next()
	}
}

// WebSocketAuthMiddleware is a middleware to authenticate WebSocket connections
func WebSocketAuthMiddleware(userRepo repositories.UserRepository, userService services.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// get token from query params
		bearerToken := c.Query(tokenKey)
		claims, err := userService.VerifyToken(bearerToken)
		if err != nil {
			slog.Error("Error verifying token", "error", err.Error())
			c.Abort()
			return
		}

		user, err := userRepo.GetUserByEmail(claims.Email)
		if err != nil || user.Email != claims.Email {
			slog.Error("Unauthorized access attempt", "error", "User does not match token claims")
			c.Abort()
			return
		}

		c.Set(claimsKey, claims)
		c.Set(userIdKey, user.ID)
		c.Set(emailKey, user.Email)
		c.Set(isAdminKey, user.IsAdmin)
		c.Next()
	}
}
