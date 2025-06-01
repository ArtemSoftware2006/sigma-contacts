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
	user.Role = "user"
	resp, err := us.UserRepository.Create(user)

	if err != nil {
		log.Error("UserService Error: ", err)
		return nil, err
	}

	return resp, err
}

func (us *UserService) GetMe(user *dto_request.UserGetRequest) (*dto_response.UserInfoResponse, error) {
	resp, err := us.UserRepository.Get(user)
	if err != nil {
		log.Error("UserService Error: ", err)
		return nil, err
	}

	return resp, err
}

func (us *UserService) Update(user *dto_request.UserUpdateRequest) (*dto_response.UserUpdateResponse, error) {
	response, err := us.UserRepository.Update(user)
	log.Info(response)

	if err != nil {
		log.Error("UserService, Error in updating user. Error: ", err)

		return nil, err
	}

	return response, nil
}

func (us *UserService) GetAll() ([]*dto_response.UserInfoResponse, error) {
	response, err := us.UserRepository.GetAll()
	log.Info(response)

	if err != nil {
		log.Error("UserService, Error in geting all users. Error: ", err)

		return nil, err
	}

	return response, nil
}
