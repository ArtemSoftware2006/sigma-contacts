package service

import (
	"log"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"
)

type ContactService struct {
	nodeRepo repository_interface.NodeRepository
	edgeRepo repository_interface.EdgeRepository
	config   *config.AppConfig
}

func NewContactService(nodeRepo repository_interface.NodeRepository, edgeRepo repository_interface.EdgeRepository,
	config *config.AppConfig) *ContactService {
	return &ContactService{
		nodeRepo: nodeRepo,
		edgeRepo: edgeRepo,
		config:   config,
	}
}

func (cs *ContactService) AddContact(req *dto_request.AddContactRequest) (*dto_response.AddContactResponse, error) {
	nodeResp, err := cs.nodeRepo.Add(&req.Node)
	if err != nil {
		log.Println("ContactService: error adding node", err)
		return nil, err
	}

	edgeNode, err := cs.edgeRepo.Add(nodeResp.IdNode, &req.Edge)
	if err != nil {
		log.Println("ContactService: error adding edge", err)
		return nil, err
	}

	return &dto_response.AddContactResponse{
		Node: dto_response.AddNodeResponse{
			IdNode: nodeResp.IdNode,
		},
		Edge: dto_response.AddEdgeResponse{
			IdEdge: edgeNode.IdEdge,
		},
		BaseResponse: dto_response.BaseResponse{
			Status:  200,
			Message: "Ok",
		},
	}, nil
}

func (cs *ContactService) ChangeContact(req *dto_request.ChangeContactRequest) (*dto_response.ChangeContactResponse, error) {
	_, err := cs.nodeRepo.Change(req.GraphId, &req.Node)
	if err != nil {
		log.Println("ContactService: error adding node", err)
		return nil, err
	}

	_, err = cs.edgeRepo.Change(req.GraphId, &req.Edge)
	if err != nil {
		log.Println("ContactService: error adding edge", err)
		return nil, err
	}

	return &dto_response.ChangeContactResponse{
		BaseResponse: dto_response.BaseResponse{
			Status:  200,
			Message: "Ok",
		},
	}, nil
}
