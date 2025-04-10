package service_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type ContactService interface {
	AddContact(*dto_request.AddContactRequest) (*dto_response.AddContactResponse, error)
}
