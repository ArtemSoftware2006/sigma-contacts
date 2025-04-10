package repository_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type NodeRepository interface {
	Add(*dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error)
}
