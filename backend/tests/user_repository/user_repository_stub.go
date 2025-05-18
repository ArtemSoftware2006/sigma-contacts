package user_repository_test

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/pkg/utils"
)

type UserRepositoryStub struct{}

func (urs *UserRepositoryStub) Get(*dto_request.UserGetRequest) (*dto_response.UserInfoResponse, error) {
	return &dto_response.UserInfoResponse{
		Nickname: "Test",
	}, nil
}

func (urs *UserRepositoryStub) FindByNickname(nickname string) (*dto_response.UserGetResponse, error) {
	hashedPassword, _ := utils.HashPassword("Test")
	return &dto_response.UserGetResponse{
		Id:       "test",
		Nickname: "Test",
		Password: hashedPassword,
	}, nil
}

func (urs *UserRepositoryStub) Create(*dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error) {
	return &dto_response.UserCreateResponse{}, nil
}

func (urs *UserRepositoryStub) ExistsByNickname(nickname string) (bool, error) {
	return true, nil
}
func (urs *UserRepositoryStub) Update(*dto_request.UserUpdateRequest) (*dto_response.UserUpdateResponse, error) {
	return &dto_response.UserUpdateResponse{}, nil
}
