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

        // Properly handle preflight requests
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatusJSON(200, gin.H{"message": "Preflight OK"})  // ✅ Return JSON response
            return
        }

        c.Next()
    }
}
