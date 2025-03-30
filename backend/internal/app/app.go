package app

import (
	"context"
	"sigma-contacts/internal/api/controller"
	router "sigma-contacts/internal/api/route"
	"sigma-contacts/internal/config"
	repository_interface "sigma-contacts/internal/domain/interface/repository"
	service_interface "sigma-contacts/internal/domain/interface/service"
	"sigma-contacts/internal/repository"
	"sigma-contacts/internal/service"
	"time"

	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Run() {
	err := LoadEnv()
	if err != nil {
		log.Fatal(err)
	}

	client, err := DbConnect()
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Fatal("Ошибка закрытия соединения:", err)
		}
	}()

	config := *config.GetAppConfig()

	var userRepo repository_interface.UserRepository = repository.NewUserRepository(client, config.DatabaseName, 10)
	var UserService service_interface.UserService = service.NewUserService(userRepo)

	var UserController *controller.UserController = controller.NewUserController(&UserService)
	var UtilsController *controller.UtilsController = controller.NewUtilsController()

	var router = router.NewRouter(UserController, UtilsController)

	routesEngine := router.InitRoutes()

	routesEngine.Run()
}

func DbConnect() (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 1. Создаём одно подключение
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal("Ошибка подключения к MongoDB:", err)
		return nil, err
	}

	return client, nil
}

func LoadEnv() error {
	// loads values from .env into the system
	if err := godotenv.Load(); err != nil {
		log.Warn("No .env file found")
		return err
	}

	return nil
}
