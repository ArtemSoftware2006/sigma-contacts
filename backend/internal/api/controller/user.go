package controller

import (
	log "github.com/sirupsen/logrus"
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	UserService service_interface.UserService
}

func NewUserController(userService *service_interface.UserService) *UserController {
	return &UserController{
		UserService: *userService,
	}
}

func (uc *UserController) GetUser(c *gin.Context) {
	id := c.Param("id")

	resp, err := uc.UserService.Get(&dto_request.UserGetRequest{Id: id})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Error("UserController Error: ", err)
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (uc *UserController) CreateUser(c *gin.Context) {
	var request dto_request.UserCreateRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := uc.UserService.Create(&request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Error("UserController Error: ", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Пользовательуспешно создан!",
	})
}
