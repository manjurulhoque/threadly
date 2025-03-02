package middlewares

import (
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Allow frontend requests
        c.Writer.Header().Set("Access-Control-Allow-Origin", "http://threadly.manjurulhoque.com")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

        // Handle preflight requests
        if c.Request.Method == "OPTIONS" {
            c.Writer.WriteHeader(200)
            return
        }

        c.Next()
    }
}
