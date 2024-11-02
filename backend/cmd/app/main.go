package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/internal/config"
	"github.com/manjurulhoque/threadly/backend/internal/db"
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
}

func main() {
	// create a new gin server and run it
	router := gin.Default()
	defer db.CloseDB(db.DB)

	router.Static("/uploads", "./uploads")

	// Updated CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// run the server
	err := router.Run()
	if err != nil {
		slog.Error("Failed to start server", "error", err.Error())
		panic(err)
	}
}
