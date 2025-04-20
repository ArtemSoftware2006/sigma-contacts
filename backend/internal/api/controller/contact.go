package controller

import (
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type ContactController struct {
	ContactService service_interface.ContactFullDataService
}

func NewContactController(ContactService service_interface.ContactFullDataService) *ContactController {
	return &ContactController{
		ContactService: ContactService,
	}
}

func (c *ContactController) Add(ctx *gin.Context) {
	var req dto_request.AddContactFullDataRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	addContactResponse, err := c.ContactService.Add(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, addContactResponse)
}

func (c *ContactController) Change(ctx *gin.Context) {
	var req dto_request.ChangeContactFullDataRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	changeContactResponse, err := c.ContactService.Change(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, changeContactResponse)
}

func (c *ContactController) Delete(ctx *gin.Context) {
	var req dto_request.DeleteContactFullDataRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	changeContactResponse, err := c.ContactService.Delete(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, changeContactResponse)
}
