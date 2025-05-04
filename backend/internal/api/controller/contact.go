package controller

import (
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type ContactFullDataController struct {
	ContactFullDataService service_interface.ContactFullDataService
}

func NewContactController(ContactFullDataService service_interface.ContactFullDataService) *ContactFullDataController {
	return &ContactFullDataController{
		ContactFullDataService: ContactFullDataService,
	}
}

func (c *ContactFullDataController) Add(ctx *gin.Context) {
	var req dto_request.AddContactFullDataRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	addContactResponse, err := c.ContactFullDataService.Add(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, addContactResponse)
}

func (c *ContactFullDataController) Change(ctx *gin.Context) {
	var req dto_request.ChangeContactFullDataRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	changeContactResponse, err := c.ContactFullDataService.Change(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, changeContactResponse)
}

func (c *ContactFullDataController) Delete(ctx *gin.Context) {
	var req dto_request.DeleteContactFullDataRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	changeContactResponse, err := c.ContactFullDataService.Delete(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, changeContactResponse)
}
