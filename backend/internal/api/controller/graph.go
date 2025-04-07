package controller

import (
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type GraphController struct {
	GraphService service_interface.GraphService
}

func NewGraphController(GraphService service_interface.GraphService) *GraphController {
	return &GraphController{
		GraphService: GraphService,
	}
}

func (gc *GraphController) Create(ctx *gin.Context) {
	var req dto_request.CreateGraphRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := gc.GraphService.Create(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp.Status = http.StatusCreated
	resp.Message = "Success"

	ctx.JSON(resp.Status, resp)

}
func (gc *GraphController) Get(ctx *gin.Context) {
	id := ctx.Param("id")
	req := dto_request.GetGraphRequest{ID: id}

	resp, err := gc.GraphService.Get(&req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp.Status = http.StatusCreated
	resp.Message = "Success"

	ctx.JSON(resp.Status, resp)

}
