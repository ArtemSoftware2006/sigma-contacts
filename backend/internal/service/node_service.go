package service

import (
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"

	log "github.com/sirupsen/logrus"
)

type NodeService struct {
	NodeRepository repository_interface.NodeRepository
	config         *config.AppConfig
}

func NewNodeService(nodeRepository repository_interface.NodeRepository, config *config.AppConfig) *NodeService {
	return &NodeService{
		NodeRepository: nodeRepository,
		config:         config,
	}
}

func (ns *NodeService) ChangeNode(graphid string, req *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error) {
	response, err := ns.NodeRepository.Update(graphid, req)
	log.Info(&response)

	if err != nil {
		log.Error("NodeService, Error changing graph`s node")

		return nil, err
	}

	return response, nil
}
