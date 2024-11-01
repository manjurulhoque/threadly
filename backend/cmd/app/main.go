package main

import (
	"github.com/gin-gonic/gin"
	"log/slog"
)

func main() {
	// create a new gin server and run it
	router := gin.Default()

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
