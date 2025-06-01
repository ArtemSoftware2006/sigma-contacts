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
	"sigma-contacts/pkg/logger"
	"sigma-contacts/pkg/utils"
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

	logger.InitLogger(config.Evironment)

	client, err := DbConnect(config.DataBaseConfig.DatabaseHost)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Fatal("Ошибка закрытия соединения:", err)
		}
	}()

	//utils

	const MIN_PASSWORD_LENGTH = 9
	const MAX_LOGIN_LENGTH = 15

	var PasswordValidator *utils.PasswordValidator = utils.NewPasswordValidator(MIN_PASSWORD_LENGTH)
	var LoginValidator *utils.LoginValidator = utils.NewLoginValidator(MAX_LOGIN_LENGTH)

	//Repositories
	//TODO: передавать в Repositories context с задержкой. А не формировать его частично в конструкторе, частично в самом Repository
	const DB_TIMEOUT = 10

	var UserRepository repository_interface.UserRepository = repository.NewUserRepository(client, config.DatabaseName, DB_TIMEOUT)
	var EdgeRepository repository_interface.EdgeRepository = repository.NewEdgeRepository(client, config.DatabaseName, DB_TIMEOUT)
	var GraphRepository repository_interface.GraphRepository = repository.NewGraphRepository(client, config.DatabaseName, DB_TIMEOUT)
	var NodeRepository repository_interface.NodeRepository = repository.NewNodeRepository(client, config.DatabaseName, DB_TIMEOUT)
	var ContactRepository repository_interface.ContactRepository = repository.NewContactRepository(client, config.DatabaseName, DB_TIMEOUT)

	//Services
	var UserService service_interface.UserService = service.NewUserService(UserRepository)
	var NodeService service_interface.NodeService = service.NewNodeService(NodeRepository, GraphRepository, &config)
	var AuthService service_interface.AuthService = service.NewAuthService(UserRepository, PasswordValidator, LoginValidator, &config)
	var GraphService service_interface.GraphService = service.NewGraphService(GraphRepository, UserRepository, NodeRepository)
	var ContactService service_interface.ContactFullDataService = service.NewContactService(NodeRepository, EdgeRepository, GraphRepository, ContactRepository, &config)
	var AnalyticsService service_interface.AnalyticsService = service.NewAnalysticsService(GraphRepository)

	//Controllers
	var UserController *controller.UserController = controller.NewUserController(UserService)
	var UtilsController *controller.UtilsController = controller.NewUtilsController()
	var AuthController *controller.AuthController = controller.NewAuthController(AuthService)
	var GraphController *controller.GraphController = controller.NewGraphController(GraphService)
	var ContactController *controller.ContactFullDataController = controller.NewContactController(ContactService)
	var NodeController *controller.NodeController = controller.NewNodeController(NodeService)
	var AnalyticsController *controller.AnalyticsController = controller.NewAnalysticsController(AnalyticsService)
	var AdminController *controller.AdminController = controller.NewAdminController(UserService)

	//Routes
	var router = router.NewRouter(UserController, UtilsController, AuthController, GraphController, ContactController, NodeController, AnalyticsController, AdminController, &config)
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
