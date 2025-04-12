package repository_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type EdgeRepository interface {
	Add(string, *dto_request.AddEdgeRequest) (*dto_response.AddEdgeResponse, error)
	Change(string, *dto_request.ChangeEdgeRequest) (*dto_response.ChangeEdgeResponse, error)
}
