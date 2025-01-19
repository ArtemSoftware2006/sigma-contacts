package app

import (
	"log"
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	"sigma-contacts/internal/repository"
	"sigma-contacts/internal/service"

	"github.com/gin-gonic/gin"
)

func Run() {
	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	router.POST("/users", func(context *gin.Context) {
		var request dto_request.UserCreateRequest

		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		UserRepository := repository.NewUserRepository()
		UserService := service.NewUserService(UserRepository)

		_, err := UserService.Create(request)

		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Println("UserController Error: ", err)
			return
		}

		context.JSON(http.StatusOK, gin.H{
			"message": "Пользовательуспешно создан!",
		})
	})
	router.Run()
}
