package graph_repository_test

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/domain/entities"
)

type MockGraphRepository struct {
	CreateFunc       func(*dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error)
	GetFunc          func(*dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error)
	GetUserGraphFunc func(*dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error)
	UpdateGraphFunc  func(userId string, nodes []entities.Node, edges []entities.Edge) error

	CalledCreate       bool
	CalledGet          bool
	CalledGetUserGraph bool
	CalledUpdateGraph  bool
}

func (m *MockGraphRepository) Create(req *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {
	m.CalledCreate = true
	return m.CreateFunc(req)
}

func (m *MockGraphRepository) Get(req *dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error) {
	m.CalledGet = true
	return m.GetFunc(req)
}

func (m *MockGraphRepository) GetUserGraph(req *dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error) {
	m.CalledGetUserGraph = true
	return m.GetUserGraphFunc(req)
}

func (m *MockGraphRepository) UpdateGraph(userId string, nodes []entities.Node, edges []entities.Edge) error {
	m.CalledUpdateGraph = true
	return m.UpdateGraphFunc(userId, nodes, edges)
}
