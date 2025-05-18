package tests

import (
	"sigma-contacts/pkg/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPasswordValidator(t *testing.T) {
	const MIN_PASSWORD_LENGTH = 9
	validator := utils.NewPasswordValidator(MIN_PASSWORD_LENGTH)

	tests := []struct {
		name     string
		password string
		wantErr  bool
	}{
		// --- Task 1–2 (обновлены под длину 9 и спецсимволы) ---

		{"TooShort", "Abc12", true},
		{"MinLengthValid", "AbcdefG1@", true},
		{"AboveMinLengthValidFixed", "AbcdefGh123@!", false},
		{"NoUpperCase", "abcdefghi@!", true},
		{"NoLowerCase", "ABCDEFGH@!", true},
		{"NoLetters", "12345678@!", true},
		{"ValidPasswordFixed", "MyPassw0rd@!", false},

		{"TooShortWithValidChars", "AbcdefG", true},
		{"ExactValidPassword", "AbcdefGh", true},
		{"NoUpperLatin", "abcdefgh1@!", true},
		{"NoLowerLatin", "ABCDEFGH1@!", true},
		{"CyrillicWithNumbers", "Пароль12@!", true},
		{"ValidLongPasswordFixed", "GoodPass99@$", false},
		{"MixedNonLatinLower", "ABCДЕFGH1@!", true},

		// --- Task 3 (без изменений) ---
		{"ShortWithSymbols", "@A1/bc$", true},
		{"NoSpecialSymbols", "Abcdef123", true},
		{"OneSpecialSymbol", "Abcdefg@1", true},
		{"TwoSpecialSymbols", "Abcdef@/1", false},
		{"ValidWithThreeSymbols", "P@ssw!rd/1", false},
		{"InvalidSpecials", "Abcdefg#1", true},
		{"AllSpecialsValidLength", "!@/$%&?/@Aa", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := validator.Validate(tt.password)
			if tt.wantErr {
				assert.Error(t, err, "ожидалась ошибка, но её нет")
			} else {
				assert.NoError(t, err, "не ожидалась ошибка, но она есть")
			}
		})
	}
}
