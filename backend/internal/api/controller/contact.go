package controller

import (
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type ContactController struct {
	ContactService service_interface.ContactService
}

func NewContactController(ContactService service_interface.ContactService) *ContactController {
	return &ContactController{
		ContactService: ContactService,
	}
}

func (c *ContactController) Add(ctx *gin.Context) {
	var req dto_request.AddContactRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	addContactResponse, err := c.ContactService.AddContact(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, addContactResponse)
}
