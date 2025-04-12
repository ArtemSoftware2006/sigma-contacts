package service_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type ContactService interface {
	Add(*dto_request.AddContactRequest) (*dto_response.AddContactResponse, error)
	Change(*dto_request.ChangeContactRequest) (*dto_response.ChangeContactResponse, error)
	Delete(*dto_request.DeleteContactRequest) (*dto_response.DeleteContactResponse, error)
}
