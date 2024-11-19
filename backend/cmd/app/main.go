package main

import (
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/config"
	"github.com/manjurulhoque/threadly/backend/internal/db"
	"github.com/manjurulhoque/threadly/backend/internal/handlers"
	"github.com/manjurulhoque/threadly/backend/internal/middlewares"
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/manjurulhoque/threadly/backend/internal/repositories"
	"github.com/manjurulhoque/threadly/backend/internal/services"
	"github.com/manjurulhoque/threadly/backend/pkg/utils"
)

func init() {
	// load the configuration
	config.LoadConfig()

	// initialize the database
	_, err := db.InitializeDB()
	if err != nil {
		slog.Error("Failed to initialize database", "error", err.Error())
		panic(err)
	}

	err = db.DB.AutoMigrate(
		&models.User{}, &models.Community{}, &models.Thread{}, &models.Comment{}, &models.Follow{},
		&models.Like{}, &models.Mention{}, &models.Message{})
	if err != nil {
		slog.Error("Error migrating database", "error", err.Error())
		panic(fmt.Sprintf("Error migrating database: %v", err))
	}
}

func main() {
	// create a new gin server and run it
	router := gin.Default()
	defer db.CloseDB(db.DB)

	// Initialize repositories with pointer receivers
	userRepo := repositories.NewUserRepository(db.DB)
	threadRepo := repositories.NewThreadRepository(db.DB)
	commentRepo := repositories.NewCommentRepository(db.DB)
	likeRepo := repositories.NewLikeRepository(db.DB)

	// Initialize services with pointer receivers
	userService := services.NewUserService(userRepo)
	threadService := services.NewThreadService(threadRepo)
	commentService := services.NewCommentService(commentRepo)
	likeService := services.NewLikeService(likeRepo)

	// Initialize handlers with pointer receivers
	userHandler := handlers.NewUserHandler(userService)
	threadHandler := handlers.NewThreadHandler(threadService)
	commentHandler := handlers.NewCommentHandler(commentService)
	likeHandler := handlers.NewLikeHandler(likeService)

	// Set up WebSocket message handler
	var wg sync.WaitGroup
	wg.Add(1)
	go handlers.HandleMessages(db.DB, &wg)

	router.Static("/web/uploads", "./web/uploads")

	// Set the user repository in the utils package
	utils.SetUserRepo(userRepo)

	// CORS configuration - using a single config instance
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(corsConfig))
	router.GET("/ws", handlers.HandleConnections)

	// Group API routes for better organization and middleware reuse
	api := router.Group("/api")
	authMiddleware := middlewares.AuthMiddleware(userRepo, userService)
	{
		// Auth routes
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.POST("/token/refresh", userHandler.Refresh)

		// Chat routes with auth
		api.GET("/chat/users", authMiddleware, handlers.GetChatUsers)
		api.GET("/chat/:receiverId/messages", authMiddleware, handlers.GetMessages)

		// User routes with auth
		api.GET("/users/:id", authMiddleware, userHandler.GetUserById)
		api.PUT("/users/update-profile", authMiddleware, userHandler.UpdateUserProfile)
		api.GET("/similar-minds", authMiddleware, userHandler.GetSimilarMinds)
		api.GET("/users/:id/total-threads", authMiddleware, threadHandler.TotalThreadsByUser)
		api.GET("/users/:id/followers", authMiddleware, userHandler.GetUserFollowers)
		api.GET("/users/:id/following", authMiddleware, userHandler.GetUserFollowing)

		// Thread routes with auth
		api.POST("/threads", authMiddleware, threadHandler.CreateThread)
		api.GET("/threads", authMiddleware, threadHandler.GetThreadsForUser)
		api.GET("/threads/:id", authMiddleware, threadHandler.GetThreadById)

		// Comment routes with auth
		api.POST("/threads/:id/comments", authMiddleware, commentHandler.CreateComment)
		api.GET("/threads/:id/comments", authMiddleware, commentHandler.CommentsByThreadId)

		// Like routes with auth
		api.POST("/threads/:id/like", authMiddleware, likeHandler.LikeThread)
		api.DELETE("/threads/:id/unlike", authMiddleware, likeHandler.UnlikeThread)

		// Follow/Unfollow routes with auth
		api.POST("/users/:id/follow", authMiddleware, handlers.FollowUser)
		api.DELETE("/users/:id/unfollow", authMiddleware, handlers.UnfollowUser)
		api.GET("/users/:id/is-following", authMiddleware, userHandler.IsFollowing)

		// User content routes with auth
		api.GET("/users/:id/threads", authMiddleware, userHandler.GetThreadsForUser)
		api.GET("/users/:id/replied-threads", authMiddleware, threadHandler.GetThreadsUserReplied)
		api.GET("/users/:id/mentioned-threads", authMiddleware, threadHandler.GetThreadsWhereUserWasMentioned)
		api.GET("/user-suggestions", authMiddleware, userHandler.GetUserSuggestions)
	}

	// run the server
	if err := router.Run(); err != nil {
		slog.Error("Failed to start server", "error", err.Error())
		panic(err)
	}

	wg.Wait() // Wait for all goroutines to finish (e.g., HandleMessages)
}
