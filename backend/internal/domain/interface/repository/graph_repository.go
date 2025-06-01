package repository_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/domain/entities"
)

type GraphRepository interface {
	Create(*dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error)
	Get(*dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error)
	GetUserGraph(*dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error)
	UpdateGraph(userId string, nodes []entities.Node, edges []entities.Edge) error
}
