package utils

import (
	"errors"
	"unicode"
	"unicode/utf8"
)

type LoginValidator struct {
	MaxLength int
}

func NewLoginValidator(maxLength int) *LoginValidator {
	return &LoginValidator{MaxLength: maxLength}
}

func (v *LoginValidator) Validate(login string) error {
	if utf8.RuneCountInString(login) > v.MaxLength {
		return errors.New("логин не должен превышать 15 символов")
	}

	hasLatin := false
	digitsStarted := false

	for _, ch := range login {
		if (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') {
			hasLatin = true
			if digitsStarted {
				return errors.New("цифры могут располагаться только в конце логина")
			}
		} else if unicode.IsDigit(ch) {
			digitsStarted = true
		} else {
			return errors.New("логин может содержать только латинские буквы и цифры")
		}
	}

	if !hasLatin {
		return errors.New("логин должен содержать хотя бы одну латинскую букву")
	}

	return nil
}
