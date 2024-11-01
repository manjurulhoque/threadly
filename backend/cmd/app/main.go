package main

import (
	"github.com/gin-gonic/gin"
	"github.com/manjurulhoque/threadly/backend/config"
	"log/slog"
)

func init() {
	// load the configuration
	config.LoadConfig()

	// initialize the database
	_, err := config.InitializeDB()
	if err != nil {
		slog.Error("Failed to initialize database", "error", err.Error())
		panic(err)
	}
}

func main() {
	// create a new gin server and run it
	router := gin.Default()
	defer config.CloseDB(config.DB)

	// add a route to the server
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// run the server
	err := router.Run()
	if err != nil {
		slog.Error("Failed to start server", "error", err.Error())
		panic(err)
	}
}
