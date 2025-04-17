package service

import (
	"fmt"
	"log"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"

	"go.mongodb.org/mongo-driver/mongo"
)

type GraphService struct {
	GraphRepository repository_interface.GraphRepository
	UserRepository  repository_interface.UserRepository
	NodeRepository  repository_interface.NodeRepository
}

func NewGraphService(GraphRepository repository_interface.GraphRepository, UserRepository repository_interface.UserRepository,
	nodeRepository repository_interface.NodeRepository) *GraphService {
	return &GraphService{
		GraphRepository: GraphRepository,
		UserRepository:  UserRepository,
		NodeRepository:  nodeRepository,
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

func (gs *GraphService) Get(userId string, req *dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error) {
	response, err := gs.GraphRepository.Get(req)
	if err != nil {
		log.Println("GraphService, Error getting graph")

		return nil, err
	}

	if !gs.CheckGraphForUser(userId, response) {
		return nil, fmt.Errorf("graph не принадлежит пользователю")
	}

	return response, nil
}

func (gs *GraphService) GetUserGraph(req *dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error) {
	response, err := gs.GraphRepository.GetUserGraph(req)
	if err != nil {
		log.Println("GraphService, Error getting graph by userId")

		return nil, err
	}

	if !gs.CheckGraphForUser(req.UserId, response) {
		return nil, fmt.Errorf("graph не принадлежит пользователю")
	}

	return response, nil
}

func (gs *GraphService) CreateUserGraph(req *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {

	graph, err := gs.GraphRepository.GetUserGraph(&dto_request.GetUserGraphRequest{
		UserId: req.UserId,
	})

	if graph != nil {
		return nil, fmt.Errorf("у пользователя уже создан граф")
	} else if err != mongo.ErrNoDocuments {
		log.Println("GraphService: func CreateUserGraph - ", err.Error())
		return nil, err
	}

	response, err := gs.GraphRepository.Create(req)
	if err != nil {
		log.Println("GraphService, Error getting graph by userId")
		return nil, err
	}

	//TODO: Инициазизацию начального узла (Или нескольких узлов и ребер) надо вынести в отдельную функцию/структуру
	_, err = gs.NodeRepository.Add(&dto_request.AddNodeRequest{
		GraphId: response.GraphId,
		Node: dto_request.AddNodeDto{
			Label:     "Root",
			X:         0,
			Y:         0,
			Size:      10,
			Color:     "#FF5733",
			Type:      "circle",
			IsSpecial: true,
			ParentID:  "",
		},
	})

	if err != nil {
		log.Println("GraphService, Error adding node in creating graph process")
		return nil, err
	}

	return response, nil
}

func (gs *GraphService) CheckGraphForUser(userId string, graph *dto_response.GetGraphResponse) bool {
	return graph.UserID == userId
}
