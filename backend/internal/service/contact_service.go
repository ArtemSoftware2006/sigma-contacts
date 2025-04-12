package service

import (
	"fmt"
	"log"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/domain/entities"
	repository_interface "sigma-contacts/internal/domain/interface/repository"
)

type ContactService struct {
	nodeRepo  repository_interface.NodeRepository
	edgeRepo  repository_interface.EdgeRepository
	graphRepo repository_interface.GraphRepository
	config    *config.AppConfig
}

func NewContactService(nodeRepo repository_interface.NodeRepository, edgeRepo repository_interface.EdgeRepository,
	graphRepo repository_interface.GraphRepository, config *config.AppConfig) *ContactService {
	return &ContactService{
		nodeRepo:  nodeRepo,
		edgeRepo:  edgeRepo,
		graphRepo: graphRepo,
		config:    config,
	}
}

func (cs *ContactService) Add(req *dto_request.AddContactRequest) (*dto_response.AddContactResponse, error) {
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

func (cs *ContactService) Change(req *dto_request.ChangeContactRequest) (*dto_response.ChangeContactResponse, error) {
	_, err := cs.nodeRepo.Change(req.GraphId, &req.Node)
	if err != nil {
		log.Println("ContactService: error changing node", err)
		return nil, err
	}

	_, err = cs.edgeRepo.Change(req.GraphId, &req.Edge)
	if err != nil {
		log.Println("ContactService: error changing edge", err)
		return nil, err
	}

	return &dto_response.ChangeContactResponse{
		BaseResponse: dto_response.BaseResponse{
			Status:  200,
			Message: "Ok",
		},
	}, nil
}

func (cs *ContactService) Delete(req *dto_request.DeleteContactRequest) (*dto_response.DeleteContactResponse, error) {

	//TODO: GetPraphResponse должен состоять из graph: entities.Graph и BaseReponse (а сейчас все поля для Graph перечислены вручную)
	graph, err := cs.graphRepo.Get(&dto_request.GetGraphRequest{
		ID: req.GraphId,
	})
	if err != nil {
		return nil, err
	}

	//TODO: использовать гуард
	if !cs.isHaveNode(req.NodeId, &entities.Graph{
		Nodes: graph.Nodes,
	}) {
		return nil, fmt.Errorf("ContactService: Нет узла с таким id")
	}

	if !cs.isHaveEdge(req.EdgeId, &entities.Graph{
		Edges: graph.Edges,
	}) {
		return nil, fmt.Errorf("ContactService: Нет ребра с таким id")
	}

	if !cs.isEdgeForThisNode(req.EdgeId, req.NodeId, &entities.Graph{
		Edges: graph.Edges,
	}) {
		return nil, fmt.Errorf("ContactService: Удаление ребра не для того узла")
	}

	if cs.isHaveChildren(req.NodeId, graph.Edges) {
		return nil, fmt.Errorf("ContactService: Сначала надо удалить все дочерние узлы")
	}

	// ----------- Вот это все в гуарды

	err = cs.nodeRepo.Delete(req.GraphId, req.NodeId)
	if err != nil {
		log.Println("ContactService: error deleting node", err)
		return nil, err
	}

	err = cs.edgeRepo.Delete(req.GraphId, req.EdgeId)
	if err != nil {
		log.Println("ContactService: error deleting edge", err)
		return nil, err
	}

	return &dto_response.DeleteContactResponse{
		BaseResponse: dto_response.BaseResponse{
			Status:  200,
			Message: "Ok",
		},
	}, nil
}

// TODO: Вынести в отдельный класс гуарда или бизнес логики
func (cs *ContactService) isHaveChildren(nodeId string, edges []entities.Edge) bool {
	countChildren := 0

	for i := 0; i < len(edges); i++ {
		if edges[i].Source == nodeId {
			countChildren++
		}
	}

	return countChildren >= 1
}

func (cs *ContactService) isHaveNode(nodeId string, graph *entities.Graph) bool {
	countNodes := 0
	for i := 0; i < len(graph.Nodes); i++ {
		if graph.Nodes[i].ID == nodeId {
			countNodes++
		}
	}

	return countNodes == 1
}

func (cs *ContactService) isHaveEdge(edgeId string, graph *entities.Graph) bool {
	countEdges := 0
	for i := 0; i < len(graph.Edges); i++ {
		if graph.Edges[i].ID == edgeId {
			countEdges++
		}
	}

	return countEdges == 1
}

func (cs *ContactService) isEdgeForThisNode(edgeId, nodeId string, graph *entities.Graph) bool {
	countEdges := 0
	for i := 0; i < len(graph.Edges); i++ {
		if graph.Edges[i].ID == edgeId && graph.Edges[i].Target == nodeId {
			countEdges++
		}
	}

	return countEdges == 1
}
