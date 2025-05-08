package service_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type UserService interface {
	Create(*dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error)
	GetMe(*dto_request.UserGetRequest) (*dto_response.UserInfoResponse, error)
	Update(*dto_request.UserUpdateRequest) (*dto_response.UserUpdateResponse, error)
}
