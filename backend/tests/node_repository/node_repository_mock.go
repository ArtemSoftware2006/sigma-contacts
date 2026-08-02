package node_repository_test

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type MockNodeRepository struct {
	AddFunc    func(graphId string, req *dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error)
	UpdateFunc func(graphId string, req *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error)
	DeleteFunc func(graphId string, nodeId string) error

	CalledAdd    bool
	CalledUpdate bool
	CalledDelete bool

	AddCalls []*dto_request.AddNodeRequest
}

func (m *MockNodeRepository) Add(graphId string, req *dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error) {
	m.CalledAdd = true
	m.AddCalls = append(m.AddCalls, req)
	return m.AddFunc(graphId, req)
}

func (m *MockNodeRepository) Update(graphId string, req *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error) {
	m.CalledUpdate = true
	return m.UpdateFunc(graphId, req)
}

func (m *MockNodeRepository) Delete(graphId string, nodeId string) error {
	m.CalledDelete = true
	return m.DeleteFunc(graphId, nodeId)
}
