package tests

import (
	"testing"

	"sigma-contacts/pkg/utils"

	"github.com/stretchr/testify/assert"
)

func TestEmailValidator(t *testing.T) {
	validator := utils.NewEmailValidator()

	tests := []struct {
		name    string
		email   string
		wantErr bool
	}{
		// 1. Валидный email — ✅
		{"ValidEmail", "user@example.com", false},

		// 2. Нет символа @ — ❌
		{"MissingAtSymbol", "userexample.com", true},

		// 3. Нет точки после @ — ❌
		{"MissingDotAfterDomain", "user@examplecom", true},

		// 4. Доменная зона слишком короткая — ❌
		{"ShortZone", "user@example.c", true},

		// 5. Есть кириллица — ❌
		{"ContainsCyrillic", "юзер@почта.рф", true},

		// 6. Валидный email с дефисами и точками — ✅
		{"ValidComplexEmail", "john.doe-test_123@sub-domain.example.co", false},

		// 7. Недопустимые спецсимволы в имени — ❌
		{"InvalidCharacters", "us!er@example.com", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.Validate(tt.email)
			if tt.wantErr {
				assert.Error(t, err, "Ожидалась ошибка, но её нет")
			} else {
				assert.NoError(t, err, "Ошибка не ожидалась, но она есть")
			}
		})
	}
}
