package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userID string, secret string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		// TODO: Use constant for JWT_LIFETIME
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString([]byte(secret))
}

func ValidateToken(tokenString string, secret string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", errors.New("invalid token")
	}

	return claims["sub"].(string), nil
}
