package controller

import (
	"log"
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type NodeController struct {
	NodeService service_interface.NodeService
}

func NewNodeController(nodeService service_interface.NodeService) *NodeController {
	return &NodeController{
		NodeService: nodeService,
	}
}

func (nc *NodeController) Change(ctx *gin.Context) {
	var req dto_request.ChangeNodeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "ID узла обязателен для изменения",
		})
		return
	}

	graphId := ctx.Param("id")

	resp, err := nc.NodeService.ChangeNode(graphId, &req)
	if err != nil {
		log.Println("Error NodeController in changing node: ", err)
		ctx.JSON(http.StatusInternalServerError, resp)
	}

	ctx.JSON(http.StatusOK, resp)
}
