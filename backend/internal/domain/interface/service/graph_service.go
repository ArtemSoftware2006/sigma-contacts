package service_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type GraphService interface {
	Create(*dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error)
	CheckGraphForUser(userId string, graph *dto_response.GetGraphResponse) bool
	GetUserGraph(*dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error)
	CreateUserGraph(*dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error)
	Get(string, *dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error)
}
