package main

import (
	"fmt"
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
	"log/slog"
	"time"
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

	err = db.DB.AutoMigrate(&models.User{}, &models.Community{}, &models.Thread{}, &models.Comment{}, &models.Follow{})
	if err != nil {
		slog.Error("Error migrating database", "error", err.Error())
		panic(fmt.Sprintf("Error migrating database: %v", err))
	}
}

func main() {
	// create a new gin server and run it
	router := gin.Default()
	defer db.CloseDB(db.DB)

	userRepo := repositories.NewUserRepository(db.DB)
	threadRepo := repositories.NewThreadRepository(db.DB)
	commentRepo := repositories.NewCommentRepository(db.DB)

	userService := services.NewUserService(userRepo)
	threadService := services.NewThreadService(threadRepo)
	commentService := services.NewCommentService(commentRepo)

	userHandler := handlers.NewUserHandler(userService)
	threadHandler := handlers.NewThreadHandler(threadService)
	commentHandler := handlers.NewCommentHandler(commentService)

	router.Static("/web/uploads", "./web/uploads")

	// Set the user repository in the utils package
	utils.SetUserRepo(userRepo)

	// Updated CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := router.Group("/api")
	{
		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)
		api.POST("/token/refresh", userHandler.Refresh)
		api.GET("/users/:id", middlewares.AuthMiddleware(userRepo, userService), userHandler.GetUserById)
		api.PUT("/users/update-profile", middlewares.AuthMiddleware(userRepo, userService), userHandler.UpdateUserProfile)
		api.GET("/similar-minds", middlewares.AuthMiddleware(userRepo, userService), userHandler.GetSimilarMinds)

		api.POST("/threads", middlewares.AuthMiddleware(userRepo, userService), threadHandler.CreateThread)
		api.GET("/threads", middlewares.AuthMiddleware(userRepo, userService), threadHandler.GetThreadsForUser)
		api.GET("/threads/:id", middlewares.AuthMiddleware(userRepo, userService), threadHandler.GetThreadById)

		api.POST("/threads/:id/comments", middlewares.AuthMiddleware(userRepo, userService), commentHandler.CreateComment)
		api.GET("/threads/:id/comments", middlewares.AuthMiddleware(userRepo, userService), commentHandler.CommentsByThreadId)

		api.POST("/users/:id/follow", middlewares.AuthMiddleware(userRepo, userService), handlers.FollowUser)
		api.DELETE("/users/:id/unfollow", middlewares.AuthMiddleware(userRepo, userService), handlers.UnfollowUser)
		api.GET("/users/:id/following", middlewares.AuthMiddleware(userRepo, userService), userHandler.IsFollowing)
	}

	// run the server
	err := router.Run()
	if err != nil {
		slog.Error("Failed to start server", "error", err.Error())
		panic(err)
	}
}
