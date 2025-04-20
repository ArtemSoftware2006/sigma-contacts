package service_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

type ContactFullDataService interface {
	Add(*dto_request.AddContactFullDataRequest) (*dto_response.AddContactFullDataResponse, error)
	Change(*dto_request.ChangeContactFullDataRequest) (*dto_response.ChangeContactFullDataResponse, error)
	Delete(*dto_request.DeleteContactFullDataRequest) (*dto_response.DeleteContactFullDataResponse, error)
}
