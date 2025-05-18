package tests

import (
	"context"
	"errors"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/service"
	"sigma-contacts/pkg/utils"
	user_repository_test "sigma-contacts/tests/user_repository"
	"strings"
	"testing"
)

const MIN_PASSWORD_LENGTH = 8
const MAX_LOGIN_LENGTH = 15

// USE STUB
func TestLogin_BaseCase_Success(t *testing.T) {
	//Arrange
	UserRepositoryStub := &user_repository_test.UserRepositoryStub{}
	userRequest := &dto_request.AuthRequest{
		Nickname: "Test",
		Password: "Test",
	}

	AuthServise := service.NewAuthService(UserRepositoryStub, utils.NewPasswordValidator(MIN_PASSWORD_LENGTH),
		utils.NewLoginValidator(MAX_LOGIN_LENGTH), &config.AppConfig{})

	//Act
	_, err := AuthServise.Login(context.TODO(), userRequest)

	//Assert
	if err != nil {
		t.Fatal(err)
	}
}

func TestRegister_NicknameAlreadyExists_Error(t *testing.T) {
	//Arrange
	UserRepositoryStub := &user_repository_test.UserRepositoryStub{}
	userRequest := dto_request.AuthRequest{
		Nickname: "Test",
		//PasswordAgain: "TestPass",
		Password: "TestPass!@",
	}
	want := "nickname already exists"

	AuthServise := service.NewAuthService(UserRepositoryStub, utils.NewPasswordValidator(MIN_PASSWORD_LENGTH),
		utils.NewLoginValidator(MAX_LOGIN_LENGTH), &config.AppConfig{})
	//Act
	err := AuthServise.Register(context.TODO(), &userRequest)

	//Assert
	if err == nil {
		t.Errorf("Должна быть ошибка, так как пользователь с nickname уже зарегистрирован")
	} else if !strings.Contains(err.Error(), want) {
		t.Errorf("Должна быть ошибка, так как пользователь с nickname уже зарегистрирован")
	}
}

// USE MOCK
func TestLogin_NicknameNotFound_Error(t *testing.T) {
	//Arrange
	UserRepositoryMock := &user_repository_test.MockUserRepository{
		FindByNicknameFunc: func(nickname string) (*dto_response.UserGetResponse, error) {
			return nil, errors.New("Пустой ответ")
		},
	}

	userRequest := dto_request.AuthRequest{
		Nickname: "Test",
		Password: "TestPass!@",
	}

	AuthServise := service.NewAuthService(UserRepositoryMock, utils.NewPasswordValidator(MIN_PASSWORD_LENGTH),
		utils.NewLoginValidator(MAX_LOGIN_LENGTH), &config.AppConfig{})

	//Act
	_, err := AuthServise.Login(context.TODO(), &userRequest)

	//Assert
	if err == nil {
		t.Errorf("Должна быть ошибка, так как пользователь с таким nickname не найден.")
	}

	if !UserRepositoryMock.CalledFindByNickname {
		t.Errorf("Не вызван метод FindByNickname в UserRepository")
	}
}

func TestLogin_PasswordWrong_Error(t *testing.T) {
	//Arrange
	UserRepositoryMock := &user_repository_test.MockUserRepository{
		FindByNicknameFunc: func(nickname string) (*dto_response.UserGetResponse, error) {
			hashedPassword, _ := utils.HashPassword("Test")

			return &dto_response.UserGetResponse{
				Id:       "test",
				Nickname: "Test",
				Password: hashedPassword,
			}, nil
		},
	}

	userRequest := dto_request.AuthRequest{
		Nickname: "Test",
		Password: "TestPass!@",
	}

	want := "invalid credentials"

	AuthServise := service.NewAuthService(UserRepositoryMock, utils.NewPasswordValidator(MIN_PASSWORD_LENGTH),
		utils.NewLoginValidator(MAX_LOGIN_LENGTH), &config.AppConfig{})

	//Act
	_, err := AuthServise.Login(context.TODO(), &userRequest)

	//Assert
	if err == nil {
		t.Errorf("Должна быть ошибка, так как введен неверный пароль.")
	} else if !strings.Contains(err.Error(), want) {
		t.Errorf("Должна быть ошибка, так как введен неверный пароль.")
	}

	if !UserRepositoryMock.CalledFindByNickname {
		t.Errorf("Не вызван метод FindByNickname в UserRepository")
	}
}

func TestRegister_CorrectRequest_Success(t *testing.T) {
	//Arrange
	UserRepositoryMock := &user_repository_test.MockUserRepository{
		ExistsByNicknameFunc: func(nickname string) (bool, error) {
			return false, nil
		},

		CreateFunc: func(user *dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error) {
			return &dto_response.UserCreateResponse{}, nil
		},
	}

	userRequest := dto_request.AuthRequest{
		Nickname: "Test",
		//PasswordAgain: "TestPass",
		Password: "TestPass!@",
	}

	AuthServise := service.NewAuthService(UserRepositoryMock, utils.NewPasswordValidator(MIN_PASSWORD_LENGTH),
		utils.NewLoginValidator(MAX_LOGIN_LENGTH), &config.AppConfig{})

	//Act
	err := AuthServise.Register(context.TODO(), &userRequest)

	//Assert
	if err != nil {
		t.Errorf("Пользователь должен зарегистрироваться успешно")
	}

	if !UserRepositoryMock.CalledExistsByNickname {
		t.Errorf("Не вызван метод GetByNickname в UserRepository")
	}

	if !UserRepositoryMock.CalledCreate {
		t.Errorf("Не вызван метод CalledAdd в UserRepository")
	}
}

// func TestRegister_PasswordsNotEqual_Error(t *testing.T) {
// 	UserRepositoryMock := &user_repository_test.MockUserRepository{
// 		ExistsByNicknameFunc: func(nickname string) (bool, error) {
// 			return true, nil
// 		},
// 	}

// 	userRequest := dto_request.AuthRequest{
// 		Nickname: "Test",
// 		//PasswordAgain: "TestPass",
// 		Password: "TestPass222",
// 	}
// 	want := "invalid credentials"

// 	AuthServise := service.NewAuthService(UserRepositoryMock, &config.AppConfig{})

// 	err := AuthServise.Register(context.TODO(), &userRequest)

// 	if err == nil {
// 		t.Errorf("Должна быть ошибка, что пароли не совпадают.")
// 	} else if !strings.Contains(err.Error(), want) {
// 		t.Errorf("Должна быть ошибка, что пароли не совпадают.")
// 	}
// }
