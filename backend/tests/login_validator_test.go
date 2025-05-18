package tests

import (
	"testing"

	"sigma-contacts/pkg/utils"

	"github.com/stretchr/testify/assert"
)

func TestLoginValidator(t *testing.T) {
	validator := utils.NewLoginValidator(15)

	tests := []struct {
		name    string
		login   string
		wantErr bool
	}{
		// 1. Валидный логин с буквами и цифрами в конце — ✅
		{"ValidWithDigits", "Admin123", false},

		// 2. Только буквы, длина < 15 — ✅
		{"OnlyLetters", "Username", false},

		// 3. Буквы + цифры в середине — ❌
		{"DigitsInMiddle", "Us3rname", true},

		// 4. Цифры в начале — ❌
		{"DigitsAtStart", "123Admin", true},

		// 5. Только цифры — ❌
		{"OnlyDigits", "123456", true},

		// 6. Превышение длины — ❌
		{"TooLongLogin", "VeryLongUsername123", true},

		// 7. Логин с недопустимым символом — ❌
		{"LoginWithSymbol", "User_name1", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.Validate(tt.login)
			if tt.wantErr {
				assert.Error(t, err, "ожидалась ошибка, но её нет")
			} else {
				assert.NoError(t, err, "не ожидалась ошибка, но она есть")
			}
		})
	}
}
