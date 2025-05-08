package controller

import (
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	service_interface "sigma-contacts/internal/domain/interface/service"

	log "github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	UserService service_interface.UserService
}

func NewUserController(userService service_interface.UserService) *UserController {
	return &UserController{
		UserService: userService,
	}
}

func (uc *UserController) GetMe(ctx *gin.Context) {
	userId := ctx.Value("userId").(string)

	resp, err := uc.UserService.GetMe(&dto_request.UserGetRequest{Id: userId})

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Error("UserController Error: ", err)
		return
	}

	ctx.JSON(http.StatusOK, resp)
}

func (uc *UserController) CreateUser(ctx *gin.Context) {
	var request dto_request.UserCreateRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := uc.UserService.Create(&request)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Error("UserController Error: ", err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Пользователь успешно создан!",
	})
}

func (uc *UserController) UpdateUser(ctx *gin.Context) {
	userId := ctx.Value("userId").(string)

	var request dto_request.UserUpdateRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request.Id = userId

	log.Info(request)
	response, err := uc.UserService.Update(&request)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Error("UserController Error: ", err)
		return
	}

	ctx.JSON(http.StatusOK, response)
}
