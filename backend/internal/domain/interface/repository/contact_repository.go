package repository_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type ContactRepository interface {
	Add(graphId string, nodeId string, contact *dto_request.AddContactRequest) (*dto_response.AddContactResponse, error)
	//Change(graphId string, contact *dto_request.ChangeContactRequest) (*dto_response.ChangeContactResponse, error)
}
