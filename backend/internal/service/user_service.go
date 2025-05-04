package service

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"

	log "github.com/sirupsen/logrus"
)

type UserService struct {
	UserRepository repository_interface.UserRepository
}

func NewUserService(userRepository repository_interface.UserRepository) *UserService {
	return &UserService{
		UserRepository: userRepository,
	}
}

func (us *UserService) Create(user *dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error) {
	resp, err := us.UserRepository.Create(user)
	if err != nil {
		log.Error("UserService Error: ", err)
		return nil, err
	}

	return resp, err
}

func (us *UserService) Get(user *dto_request.UserGetRequest) (*dto_response.UserGetResponse, error) {
	resp, err := us.UserRepository.Get(user)
	if err != nil {
		log.Error("UserService Error: ", err)
		return nil, err
	}

	return resp, err
}
