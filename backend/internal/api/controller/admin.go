package controller

import (
	"net/http"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type AdminController struct {
	UserService service_interface.UserService
}

func NewAdminController(UserService service_interface.UserService) *AdminController {
	return &AdminController{
		UserService: UserService,
	}
}

func (ac *AdminController) Ping(ctx *gin.Context) {
	role := ctx.Value("role").(string)

	ctx.JSON(http.StatusOK, role)
}

func (ac *AdminController) GetAllUser(ctx *gin.Context) {

	response, err := ac.UserService.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, response)
}
