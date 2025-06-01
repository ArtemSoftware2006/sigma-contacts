package service

import (
	"context"
	"errors"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"
	"sigma-contacts/pkg/utils"

	log "github.com/sirupsen/logrus"
)

//TODO: Добавить Auth и Refresh токены

type AuthService struct {
	userRepo          repository_interface.UserRepository
	passwordValidator *utils.PasswordValidator
	loginValidator    *utils.LoginValidator
	config            *config.AppConfig
}

func NewAuthService(userRepo repository_interface.UserRepository, passwordValidator *utils.PasswordValidator, loginValidator *utils.LoginValidator, config *config.AppConfig) *AuthService {
	return &AuthService{
		userRepo:          userRepo,
		passwordValidator: passwordValidator,
		loginValidator:    loginValidator,
		config:            config,
	}
}

func (as *AuthService) Register(ctx context.Context, req *dto_request.AuthRequest) error {
	if err := as.passwordValidator.Validate(req.Password); err != nil {
		return err
	}

	if err := as.loginValidator.Validate(req.Nickname); err != nil {
		return err
	}

	exists, err := as.userRepo.ExistsByNickname(req.Nickname)

	if err != nil {
		return errors.New("User not found")
	}
	if exists {
		return errors.New("nickname already exists")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return err
	}

	_, err = as.userRepo.Create(
		&dto_request.UserCreateRequest{
			Nickname: req.Nickname,
			Password: hashedPassword,
			Role:     "user",
		},
	)

	if err != nil {
		log.Error("Error in creating user")
		return err
	}

	return nil

}
func (as *AuthService) Login(ctx context.Context, req *dto_request.AuthRequest) (*dto_response.TokenResponse, error) {

	if req.Nickname == "" && req.Password == "" {
		return nil, errors.New("Enter nickname and password")
	}

	user, err := as.userRepo.FindByNickname(req.Nickname)
	if err != nil {
		return nil, errors.New("User not found")
	}
	if user == nil {
		return nil, errors.New("invalid credentials")
	}

	if !utils.CheckPasswordHash(req.Password, user.Password) {
		return nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateToken(user.Id, user.Role, as.config.JwtSecret)

	if err != nil {
		return nil, err
	}

	return &dto_response.TokenResponse{Token: token}, nil
}
