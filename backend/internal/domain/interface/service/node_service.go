package service_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type NodeService interface {
	ChangeNode(string, *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error)
}
