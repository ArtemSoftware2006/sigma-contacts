package controller

import (
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	log "github.com/sirupsen/logrus"

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
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if req.Id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "ID узла обязателен для изменения",
		})
		return
	}

	graphId := ctx.Param("id")

	resp, err := nc.NodeService.ChangeNode(graphId, &req)
	if err != nil {
		log.Error("Error NodeController in changing node: ", err)
		ctx.JSON(http.StatusInternalServerError, resp)
	}

	ctx.JSON(http.StatusOK, resp)
}

func (nc *NodeController) AddContactNode(ctx *gin.Context) {
	var req dto_request.AddContactNodeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if req.GroupID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "GroupId обязателен для добавление контакта",
		})
		return
	}

	userId := ctx.Value("userId").(string)

	resp, err := nc.NodeService.AddContactNode(userId, &req)
	if err != nil {
		log.Error("Error NodeController in adding contact node: ", err)
		ctx.JSON(http.StatusBadRequest, resp)
	}

	ctx.JSON(http.StatusOK, resp)
}

func (nc *NodeController) AddGroupNode(ctx *gin.Context) {
	var req dto_request.AddGroupNodeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if req.Label == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Label обязателен для добавления нового Группового-узла",
		})
		return
	}

	userId := ctx.Value("userId").(string)

	resp, err := nc.NodeService.AddGroupNode(userId, &req)
	if err != nil {
		log.Error("Error NodeController in changing node: ", err)
		ctx.JSON(http.StatusInternalServerError, resp)
	}

	ctx.JSON(http.StatusOK, resp)
}

func (nc *NodeController) DeleteNode(ctx *gin.Context) {

	nodeId := ctx.Param("id")
	userId := ctx.Value("userId").(string)

	resp, err := nc.NodeService.DeleteNode(userId, nodeId)
	if err != nil {
		log.Error("Error NodeController in deleting node: ", err)
		ctx.JSON(http.StatusInternalServerError, resp)
	}

	ctx.JSON(http.StatusOK, resp)
}
