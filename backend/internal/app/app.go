package app

import (
	"log"
	"net/http"
	dto_request "sigma-contacts/internal/domain/dto/request"
	"sigma-contacts/internal/repository"
	"sigma-contacts/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func Run() {
	Init()

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

func Init() {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
}
