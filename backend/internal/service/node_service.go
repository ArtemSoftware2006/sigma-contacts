package service

import (
	"errors"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/domain/entities"
	repository_interface "sigma-contacts/internal/domain/interface/repository"

	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
)

type NodeService struct {
	NodeRepository  repository_interface.NodeRepository
	GraphRepository repository_interface.GraphRepository
	config          *config.AppConfig
}

func NewNodeService(nodeRepository repository_interface.NodeRepository, graphRepository repository_interface.GraphRepository,
	config *config.AppConfig) *NodeService {
	return &NodeService{
		NodeRepository:  nodeRepository,
		GraphRepository: graphRepository,
		config:          config,
	}
}

func (ns *NodeService) ChangeNode(graphId string, req *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error) {
	response, err := ns.NodeRepository.Update(graphId, req)
	log.Info(&response)

	if err != nil {
		log.Error("NodeService, Error changing graph`s node")
		return nil, err
	}

	return response, nil
}

func (s *NodeService) AddGroupNode(userId string, req *dto_request.AddGroupNodeRequest) (*dto_response.AddGroupNodeResponse, error) {
	graph, err := s.GraphRepository.GetUserGraph(&dto_request.GetUserGraphRequest{
		UserId: userId,
	})
	if err != nil {
		log.Error("NodeService, Error graph not found. userId = ", userId)
		return nil, err
	}

	nodeID := uuid.New().String()
	groupNode := entities.Node{
		ID:      nodeID,
		Label:   req.Label,
		X:       req.X,
		Y:       req.Y,
		Size:    10,
		Color:   req.Color,
		Type:    "circle",
		IsGroup: true,
	}

	graph.Nodes = append(graph.Nodes, groupNode)

	if err := s.GraphRepository.UpdateGraph(userId, graph.Nodes, graph.Edges); err != nil {
		return nil, err
	}

	return &dto_response.AddGroupNodeResponse{NodeID: nodeID}, nil
}

func (s *NodeService) AddContactNode(userId string, req *dto_request.AddContactNodeRequest) (*dto_response.AddContactNodeResponse, error) {
	graph, err := s.GraphRepository.GetUserGraph(&dto_request.GetUserGraphRequest{
		UserId: userId,
	})

	if err != nil {
		log.Error("NodeService, Error graph not found. userId = ", userId)
		return nil, err
	}

	log.Info(graph)
	// Найти цвет группы
	var groupColor string
	for _, n := range graph.Nodes {
		log.Info(n.ID)
		log.Info(req.GroupID)
		log.Info(n.IsGroup)
		if n.ID == req.GroupID && n.IsGroup {
			groupColor = n.Color
			break
		}
	}

	if groupColor == "" {
		return nil, errors.New("групповой узел не найден")
	}

	nodeID := uuid.New().String()
	edgeID := uuid.New().String()

	newNode := entities.Node{
		ID:       nodeID,
		Label:    req.Label,
		X:        req.X,
		Y:        req.Y,
		Size:     10,
		Color:    groupColor,
		Type:     "circle",
		Contact:  *dto_request.MapDtoToEntityContact(&req.Contact),
		ParentId: req.GroupID,
	}

	newEdge := entities.Edge{
		ID:     edgeID,
		Source: req.GroupID,
		Target: nodeID,
		Color:  groupColor,
		Size:   1,
	}

	graph.Nodes = append(graph.Nodes, newNode)
	graph.Edges = append(graph.Edges, newEdge)

	if err := s.GraphRepository.UpdateGraph(userId, graph.Nodes, graph.Edges); err != nil {
		return nil, err
	}

	return &dto_response.AddContactNodeResponse{NodeID: nodeID, EdgeID: edgeID}, nil
}

func (s *NodeService) DeleteNode(userId string, nodeId string) (*dto_response.BaseResponse, error) {
	graph, err := s.GraphRepository.GetUserGraph(&dto_request.GetUserGraphRequest{
		UserId: userId,
	})

	if err != nil {
		log.Error("NodeService, Error graph not found. userId = ", userId)
		return nil, err
	}

	err = s.NodeRepository.Delete(graph.Id, nodeId)
	if err != nil {
		log.Error("ContactService: error deleting node", err)
		return nil, err
	}

	return &dto_response.BaseResponse{
		Message: "Success deleted",
	}, nil
}
