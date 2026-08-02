package user_repository_test

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

// MockUserRepository — ручной мок
type MockUserRepository struct {
	FindByNicknameFunc   func(nickname string) (*dto_response.UserGetResponse, error)
	CreateFunc           func(user *dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error)
	ExistsByNicknameFunc func(nickname string) (bool, error)
	UpdateFunc           func(*dto_request.UserUpdateRequest) (*dto_response.UserUpdateResponse, error)
	GetFunc              func(*dto_request.UserGetRequest) (*dto_response.UserInfoResponse, error)

	CalledFindByNickname   bool
	CalledCreate           bool
	CalledExistsByNickname bool
	CalledUpdate           bool
	CalledGet              bool
	CalledGetAll           bool

	GetAllFunc func() ([]*dto_response.UserInfoResponse, error)
}

func (m *MockUserRepository) FindByNickname(nickname string) (*dto_response.UserGetResponse, error) {
	m.CalledFindByNickname = true
	return m.FindByNicknameFunc(nickname)
}

func (m *MockUserRepository) Create(user *dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error) {
	m.CalledCreate = true
	return m.CreateFunc(user)
}

func (urs *MockUserRepository) ExistsByNickname(nickname string) (bool, error) {
	urs.CalledExistsByNickname = true
	return urs.ExistsByNicknameFunc(nickname)
}

func (urs *MockUserRepository) Update(req *dto_request.UserUpdateRequest) (*dto_response.UserUpdateResponse, error) {
	urs.CalledUpdate = true
	return urs.UpdateFunc(req)
}

func (urs *MockUserRepository) Get(req *dto_request.UserGetRequest) (*dto_response.UserInfoResponse, error) {
	urs.CalledGet = true
	return urs.GetFunc(req)
}

func (urs *MockUserRepository) GetAll() ([]*dto_response.UserInfoResponse, error) {
	urs.CalledGetAll = true
	return urs.GetAllFunc()
}
