package service_interface

import (
	"context"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type AuthService interface {
	Register(ctx context.Context, req *dto_request.AuthRequest) error
	Login(ctx context.Context, req *dto_request.AuthRequest) (*dto_response.TokenResponse, error)
}
