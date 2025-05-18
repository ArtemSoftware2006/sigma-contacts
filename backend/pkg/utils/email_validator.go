package utils

import (
	"errors"
	"regexp"
)

type EmailValidator struct {
	pattern *regexp.Regexp
}

func NewEmailValidator() *EmailValidator {
	// Упрощённое, но достаточно строгое регулярное выражение
	pattern := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	return &EmailValidator{pattern: pattern}
}

func (v *EmailValidator) Validate(email string) error {
	if !v.pattern.MatchString(email) {
		return errors.New("некорректный email. Ожидается формат: имя@домен.зона (например: user@example.com)")
	}
	return nil
}
