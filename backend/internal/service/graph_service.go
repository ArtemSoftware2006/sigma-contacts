package service

import (
	"fmt"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"

	log "github.com/sirupsen/logrus"

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
		log.Error("GraphService, Error creating graph")

		return nil, err
	}

	return response, nil
}

func (gs *GraphService) Get(userId string, req *dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error) {
	response, err := gs.GraphRepository.Get(req)
	if err != nil {
		log.Error("GraphService, Error getting graph")

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
		log.Error("GraphService, Error getting graph by userId")

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
		log.Error("GraphService: func CreateUserGraph - ", err.Error())
		return nil, err
	}

	response, err := gs.GraphRepository.Create(req)
	if err != nil {
		log.Error("GraphService, Error getting graph by userId")
		return nil, err
	}

	for _, g := range defaultGroupNodes() {
		_, err = gs.NodeRepository.Add(response.GraphId, &g)
		if err != nil {
			log.Error("GraphService, Error adding default group node: ", g.Label)
			return nil, err
		}
	}

	return response, nil
}

func defaultGroupNodes() []dto_request.AddNodeRequest {
	return []dto_request.AddNodeRequest{
		{Label: "Коллеги", Color: "#4A90D9", X: -300, Y: 0, Size: 15, Type: "circle", IsGroup: true},
		{Label: "Родственники", Color: "#E74C3C", X: 300, Y: 0, Size: 15, Type: "circle", IsGroup: true},
		{Label: "Школа", Color: "#2ECC71", X: 0, Y: -300, Size: 15, Type: "circle", IsGroup: true},
		{Label: "Соседи", Color: "#F39C12", X: -200, Y: 250, Size: 15, Type: "circle", IsGroup: true},
		{Label: "Университет", Color: "#9B59B6", X: 200, Y: 250, Size: 15, Type: "circle", IsGroup: true},
		{Label: "Знакомые", Color: "#1ABC9C", X: 0, Y: 150, Size: 15, Type: "circle", IsGroup: true},
	}
}

func (gs *GraphService) CheckGraphForUser(userId string, graph *dto_response.GetGraphResponse) bool {
	return graph.UserId == userId
}
