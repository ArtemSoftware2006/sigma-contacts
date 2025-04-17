package service

import (
	"context"
	"errors"
	"log"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"
	"sigma-contacts/pkg/utils"
)

//TODO: Добавить Auth и Refresh токены

type AuthService struct {
	userRepo repository_interface.UserRepository
	config   *config.AppConfig
}

func NewAuthService(userRepo repository_interface.UserRepository, config *config.AppConfig) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		config:   config,
	}
}

func (as *AuthService) Register(ctx context.Context, req *dto_request.AuthRequest) error {
	exists, err := as.userRepo.ExistsByNickname(req.Nickname)
	if err != nil {
		return err
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
		},
	)

	if err != nil {
		log.Println("Error in creating user")
		return err
	}

	return nil

}
func (as *AuthService) Login(ctx context.Context, req *dto_request.AuthRequest) (*dto_response.TokenResponse, error) {
	user, err := as.userRepo.FindByNickname(req.Nickname)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("invalid credentials")
	}

	if !utils.CheckPasswordHash(req.Password, user.Password) {
		return nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateToken(user.Id, as.config.JwtSecret)

	if err != nil {
		return nil, err
	}

	return &dto_response.TokenResponse{Token: token}, nil
}
