package repository_interface

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
)

// TODO: Передавать context в качестве аргумента

// Например, в Gin:
//
//	func(c *gin.Context) {
//	    exists, err := repo.ExistsByEmail(c.Request.Context(), email)
//	    // ...
//	}
type UserRepository interface {
	Create(*dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error)
	Get(*dto_request.UserGetRequest) (*dto_response.UserGetResponse, error)
	FindByNickname(string) (*dto_response.UserGetResponse, error)
	ExistsByNickname(nickname string) (bool, error)
}
