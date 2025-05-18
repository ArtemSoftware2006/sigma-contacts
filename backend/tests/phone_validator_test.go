package tests

import (
	"testing"

	"sigma-contacts/pkg/utils"

	"github.com/stretchr/testify/assert"
)

func TestPhoneValidator(t *testing.T) {
	validator := utils.NewPhoneValidator(10)

	tests := []struct {
		name    string
		phone   string
		wantErr bool
	}{
		// 1. Валидный номер — ✅
		{"ValidPhone", "9123456789", false},

		// 2. Слишком короткий — ❌
		{"TooShort", "123456789", true},

		// 3. Слишком длинный — ❌
		{"TooLong", "12345678901", true},

		// 4. Включает буквы — ❌
		{"ContainsLetters", "91234abcde", true},

		// 5. Включает спецсимвол — ❌
		{"ContainsSymbol", "91234-6789", true},

		// 6. Только символы — ❌
		{"OnlySymbols", "+7(999)000", true},

		// 7. Только цифры, граничный случай — ✅
		{"AllDigitsEdge", "0000000000", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.Validate(tt.phone)
			if tt.wantErr {
				assert.Error(t, err, "Ожидалась ошибка, но её нет")
			} else {
				assert.NoError(t, err, "Ошибка не ожидалась, но она есть")
			}
		})
	}
}
