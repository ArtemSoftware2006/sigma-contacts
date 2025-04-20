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

type ContactFullDataService struct {
	nodeRepository    repository_interface.NodeRepository
	edgeRepository    repository_interface.EdgeRepository
	graphRepository   repository_interface.GraphRepository
	contactRepository repository_interface.ContactRepository
	config            *config.AppConfig
}

func NewContactService(nodeRepository repository_interface.NodeRepository, edgeRepository repository_interface.EdgeRepository,
	graphRepository repository_interface.GraphRepository,
	//contactRepository repository_interface.ContactRepository,
	config *config.AppConfig) *ContactFullDataService {
	return &ContactFullDataService{
		nodeRepository:  nodeRepository,
		edgeRepository:  edgeRepository,
		graphRepository: graphRepository,
		//contactRepository: contactRepository,
		config: config,
	}
}

func (cs *ContactFullDataService) Add(req *dto_request.AddContactFullDataRequest) (*dto_response.AddContactFullDataResponse, error) {
	nodeResponse, err := cs.nodeRepository.Add(req.GraphId, &req.Node)
	if err != nil {
		log.Println("ContactService: error adding node", err)
		return nil, err
	}

	edgeNode, err := cs.edgeRepository.Add(req.GraphId, nodeResponse.IdNode, &req.Edge)
	if err != nil {
		log.Println("ContactService: error adding edge", err)
		return nil, err
	}

	return &dto_response.AddContactFullDataResponse{
		Node: dto_response.AddNodeResponse{
			IdNode: nodeResponse.IdNode,
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

func (cs *ContactFullDataService) Change(req *dto_request.ChangeContactFullDataRequest) (*dto_response.ChangeContactFullDataResponse, error) {
	_, err := cs.nodeRepository.Change(req.GraphId, &req.Node)
	if err != nil {
		log.Println("ContactService: error changing node", err)
		return nil, err
	}

	_, err = cs.edgeRepository.Change(req.GraphId, &req.Edge)
	if err != nil {
		log.Println("ContactService: error changing edge", err)
		return nil, err
	}

	return &dto_response.ChangeContactFullDataResponse{
		BaseResponse: dto_response.BaseResponse{
			Status:  200,
			Message: "Ok",
		},
	}, nil
}

func (cs *ContactFullDataService) Delete(req *dto_request.DeleteContactFullDataRequest) (*dto_response.DeleteContactFullDataResponse, error) {

	//TODO: GetPraphResponse должен состоять из graph: entities.Graph и BaseReponse (а сейчас все поля для Graph перечислены вручную)
	graph, err := cs.graphRepository.Get(&dto_request.GetGraphRequest{
		Id: req.GraphId,
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

	err = cs.nodeRepository.Delete(req.GraphId, req.NodeId)
	if err != nil {
		log.Println("ContactService: error deleting node", err)
		return nil, err
	}

	err = cs.edgeRepository.Delete(req.GraphId, req.EdgeId)
	if err != nil {
		log.Println("ContactService: error deleting edge", err)
		return nil, err
	}

	return &dto_response.DeleteContactFullDataResponse{
		BaseResponse: dto_response.BaseResponse{
			Status:  200,
			Message: "Ok",
		},
	}, nil
}

// TODO: Вынести в отдельный класс гуарда или бизнес логики
func (cs *ContactFullDataService) isHaveChildren(nodeId string, edges []entities.Edge) bool {
	countChildren := 0

	for i := 0; i < len(edges); i++ {
		if edges[i].Source == nodeId {
			countChildren++
		}
	}

	return countChildren >= 1
}

func (cs *ContactFullDataService) isHaveNode(nodeId string, graph *entities.Graph) bool {
	countNodes := 0
	for i := 0; i < len(graph.Nodes); i++ {
		if graph.Nodes[i].ID == nodeId {
			countNodes++
		}
	}

	return countNodes == 1
}

func (cs *ContactFullDataService) isHaveEdge(edgeId string, graph *entities.Graph) bool {
	countEdges := 0
	for i := 0; i < len(graph.Edges); i++ {
		if graph.Edges[i].ID == edgeId {
			countEdges++
		}
	}

	return countEdges == 1
}

func (cs *ContactFullDataService) isEdgeForThisNode(edgeId, nodeId string, graph *entities.Graph) bool {
	countEdges := 0
	for i := 0; i < len(graph.Edges); i++ {
		if graph.Edges[i].ID == edgeId && graph.Edges[i].Target == nodeId {
			countEdges++
		}
	}

	return countEdges == 1
}
