package repository_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type UserRepository interface {
	Create(*dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error)
	Get(*dto_request.UserGetRequest) (*dto_response.UserGet, error)
}
