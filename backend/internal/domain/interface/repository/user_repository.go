package repository_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type UserRepository interface {
	Create(dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error)
	// GetBaseAuth(dto_request.UserGetBaseAuthRequest) (*dto_response.UserGetBaseAuthResponse, error)
}
