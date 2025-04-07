package service

import (
	"log"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"
)

type GraphService struct {
	GraphRepository repository_interface.GraphRepository
}

func NewGraphService(GraphRepository repository_interface.GraphRepository) *GraphService {
	return &GraphService{
		GraphRepository: GraphRepository,
	}
}

func (gs *GraphService) Create(req *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {
	response, err := gs.GraphRepository.Create(req)
	if err != nil {
		log.Println("GraphService, Error creating graph")

		return nil, err
	}

	return response, nil
}

func (gs *GraphService) Get(req *dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error) {
	response, err := gs.GraphRepository.Get(req)
	if err != nil {
		log.Println("GraphService, Error getting graph")

		return nil, err
	}

	return response, nil
}
