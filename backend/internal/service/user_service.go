package service

import (
	"log"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"
)

type UserService struct {
	UserRepository repository_interface.UserRepository
}

func NewUserService(userRepository repository_interface.UserRepository) *UserService {
	return &UserService{
		UserRepository: userRepository,
	}
}

func (us *UserService) Create(user dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error) {
	resp, err := us.UserRepository.Create(user)
	if err != nil {
		log.Println("UserService Error: ", err)
		return nil, err
	}

	return resp, err
}
