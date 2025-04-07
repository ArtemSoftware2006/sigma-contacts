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

	config := *config.GetAppConfig()

	client, err := DbConnect(config.DataBaseConfig.DatabaseHost)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Fatal("Ошибка закрытия соединения:", err)
		}
	}()

	var userRepo repository_interface.UserRepository = repository.NewUserRepository(client, config.DatabaseName, 10)
	var UserService service_interface.UserService = service.NewUserService(userRepo)

	var UserController *controller.UserController = controller.NewUserController(&UserService)
	var UtilsController *controller.UtilsController = controller.NewUtilsController()

	var AuthService service.AuthService = *service.NewAuthService(userRepo, &config)
	var AuthController *controller.AuthController = controller.NewAuthController(&AuthService)

	var GraphRepository repository.GraphRepository = *repository.NewGraphRepository(client, config.DatabaseName, 10)
	var GraphService *service.GraphService = service.NewGraphService(&GraphRepository)

	var GraphController *controller.GraphController = controller.NewGraphController(GraphService)

	var router = router.NewRouter(UserController, UtilsController, AuthController, GraphController, &config)

	routesEngine := router.InitRoutes()

	routesEngine.Run()
}

func DbConnect(mongoUrl string) (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 1. Создаём одно подключение
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoUrl))
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
