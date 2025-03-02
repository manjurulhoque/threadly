package middlewares

import (
	"github.com/gin-gonic/gin"
)


func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
		// origin := c.Request.Header.Get("Origin")
		// referer := c.Request.Header.Get("Referer")

		// if origin == "" && referer != "" {
		// 	origin = referer
		// }
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        // c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}