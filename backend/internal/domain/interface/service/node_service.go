package service_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type NodeService interface {
	ChangeNode(string, *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error)
	DeleteNode(userId string, nodeId string) (*dto_response.BaseResponse, error)
	AddGroupNode(userId string, req *dto_request.AddGroupNodeRequest) (*dto_response.AddGroupNodeResponse, error)
	AddContactNode(userId string, req *dto_request.AddContactNodeRequest) (*dto_response.AddContactNodeResponse, error)
}
