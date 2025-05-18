package utils

import (
	"errors"
	"unicode"
)

type PhoneValidator struct {
	Length int
}

func NewPhoneValidator(length int) *PhoneValidator {
	return &PhoneValidator{Length: length}
}

func (v *PhoneValidator) Validate(phone string) error {
	if len(phone) != v.Length {
		return errors.New("номер телефона должен содержать ровно 10 цифр")
	}

	for _, ch := range phone {
		if !unicode.IsDigit(ch) {
			return errors.New("номер телефона должен состоять только из цифр")
		}
	}

	return nil
}
