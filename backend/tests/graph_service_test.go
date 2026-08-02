package tests

import (
	"errors"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/service"
	graph_repository_test "sigma-contacts/tests/graph_repository"
	node_repository_test "sigma-contacts/tests/node_repository"
	user_repository_test "sigma-contacts/tests/user_repository"
	"testing"

	"go.mongodb.org/mongo-driver/mongo"
)

const defaultGroupCount = 6

func TestCreateUserGraph_NewUser_CreatesDefaultGroups(t *testing.T) {
	graphRepo := &graph_repository_test.MockGraphRepository{
		GetUserGraphFunc: func(req *dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error) {
			return nil, mongo.ErrNoDocuments
		},
		CreateFunc: func(req *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {
			return &dto_response.CreateGraphResponse{GraphId: "graph-123"}, nil
		},
	}

	nodeRepo := &node_repository_test.MockNodeRepository{
		AddFunc: func(graphId string, req *dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error) {
			return &dto_response.AddNodeResponse{NodeId: "n-test"}, nil
		},
	}

	graphService := service.NewGraphService(graphRepo, &user_repository_test.UserRepositoryStub{}, nodeRepo)

	_, err := graphService.CreateUserGraph(&dto_request.CreateGraphRequest{UserId: "user-1"})
	if err != nil {
		t.Fatalf("Ожидался успех, получена ошибка: %v", err)
	}

	if len(nodeRepo.AddCalls) != defaultGroupCount {
		t.Errorf("Ожидалось %d групп, создано: %d", defaultGroupCount, len(nodeRepo.AddCalls))
	}

	for _, call := range nodeRepo.AddCalls {
		if !call.IsGroup {
			t.Errorf("Узел '%s' должен быть группой (IsGroup=true)", call.Label)
		}
		if call.Label == "" {
			t.Error("Label группы не должен быть пустым")
		}
		if call.Color == "" {
			t.Error("Color группы не должен быть пустым")
		}
	}
}

func TestCreateUserGraph_AllDefaultGroupsPresent(t *testing.T) {
	graphRepo := &graph_repository_test.MockGraphRepository{
		GetUserGraphFunc: func(req *dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error) {
			return nil, mongo.ErrNoDocuments
		},
		CreateFunc: func(req *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {
			return &dto_response.CreateGraphResponse{GraphId: "graph-456"}, nil
		},
	}

	nodeRepo := &node_repository_test.MockNodeRepository{
		AddFunc: func(graphId string, req *dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error) {
			return &dto_response.AddNodeResponse{NodeId: "n-test"}, nil
		},
	}

	graphService := service.NewGraphService(graphRepo, &user_repository_test.UserRepositoryStub{}, nodeRepo)
	graphService.CreateUserGraph(&dto_request.CreateGraphRequest{UserId: "user-2"})

	expectedLabels := []string{"Коллеги", "Родственники", "Школа", "Соседи", "Университет", "Знакомые"}
	createdLabels := make(map[string]bool)
	for _, call := range nodeRepo.AddCalls {
		createdLabels[call.Label] = true
	}

	for _, label := range expectedLabels {
		if !createdLabels[label] {
			t.Errorf("Отсутствует группа: %s", label)
		}
	}
}

func TestCreateUserGraph_GraphAlreadyExists_Error(t *testing.T) {
	graphRepo := &graph_repository_test.MockGraphRepository{
		GetUserGraphFunc: func(req *dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error) {
			return &dto_response.GetGraphResponse{}, nil
		},
	}

	nodeRepo := &node_repository_test.MockNodeRepository{}

	graphService := service.NewGraphService(graphRepo, &user_repository_test.UserRepositoryStub{}, nodeRepo)

	_, err := graphService.CreateUserGraph(&dto_request.CreateGraphRequest{UserId: "user-3"})
	if err == nil {
		t.Error("Ожидалась ошибка — граф уже существует")
	}

	if len(nodeRepo.AddCalls) != 0 {
		t.Error("Не должно создаваться узлов, если граф уже существует")
	}
}

func TestCreateUserGraph_NodeAddFails_Error(t *testing.T) {
	graphRepo := &graph_repository_test.MockGraphRepository{
		GetUserGraphFunc: func(req *dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error) {
			return nil, mongo.ErrNoDocuments
		},
		CreateFunc: func(req *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {
			return &dto_response.CreateGraphResponse{GraphId: "graph-789"}, nil
		},
	}

	nodeRepo := &node_repository_test.MockNodeRepository{
		AddFunc: func(graphId string, req *dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error) {
			return nil, errors.New("db error")
		},
	}

	graphService := service.NewGraphService(graphRepo, &user_repository_test.UserRepositoryStub{}, nodeRepo)

	_, err := graphService.CreateUserGraph(&dto_request.CreateGraphRequest{UserId: "user-4"})
	if err == nil {
		t.Error("Ожидалась ошибка при сбое добавления узла")
	}
}
