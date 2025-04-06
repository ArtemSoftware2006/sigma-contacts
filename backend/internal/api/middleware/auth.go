package middleware

import (
	"net/http"
	"sigma-contacts/pkg/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			return
		}
		tokenString := tokenParts[1]

		userID, err := utils.ValidateToken(tokenString, jwtSecret)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error":   "Invalid token",
				"details": err.Error(),
			})
			return
		}

		ctx.Set("userID", userID)
		ctx.Next()
	}
}
