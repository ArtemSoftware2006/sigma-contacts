package utils

import (
	"errors"
	"unicode/utf8"
)

type PasswordValidator struct {
	MinLength     int
	RequiredCount int
	Specials      string
}

func NewPasswordValidator(minLength int) *PasswordValidator {
	return &PasswordValidator{
		MinLength:     minLength,
		RequiredCount: 2,
		Specials:      "!/?$&@%",
	}
}

func (v *PasswordValidator) Validate(password string) error {
	if utf8.RuneCountInString(password) < v.MinLength {
		return errors.New("пароль должен содержать минимум 9 символов")
	}

	hasUpper := false
	hasLower := false
	specialCount := 0

	for _, ch := range password {
		if ch >= 'A' && ch <= 'Z' {
			hasUpper = true
		} else if ch >= 'a' && ch <= 'z' {
			hasLower = true
		}
		if containsRune(v.Specials, ch) {
			specialCount++
		}
	}

	if !hasUpper {
		return errors.New("пароль должен содержать хотя бы одну заглавную латинскую букву")
	}

	if !hasLower {
		return errors.New("пароль должен содержать хотя бы одну строчную латинскую букву")
	}

	if specialCount < v.RequiredCount {
		return errors.New("пароль должен содержать как минимум 2 спецсимвола: !, /, ?, $, &, @, %")
	}

	return nil
}

func containsRune(set string, r rune) bool {
	for _, ch := range set {
		if ch == r {
			return true
		}
	}
	return false
}
