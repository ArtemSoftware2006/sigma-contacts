package middleware

import (
	"net/http"
	"sigma-contacts/pkg/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// RoleMiddleware проверяет, соответствует ли роль пользователя требуемой.
func RoleMiddleware(jwtSecret string, requiredRole string) gin.HandlerFunc {
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

		claims, err := utils.ParseTokenClaims(tokenString, jwtSecret)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token", "details": err.Error()})
			return
		}

		role, ok := claims["iss"].(string)
		if !ok || role != requiredRole {
			logrus.Info(ok)
			logrus.Info(role == requiredRole)
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			return
		}

		logrus.Info(role)
		logrus.Info(claims)
		logrus.Info(claims["iss"].(string))
		logrus.Info(requiredRole)
		ctx.Set("role", role) // проброс userId в context, если нужно
		ctx.Next()
	}
}
