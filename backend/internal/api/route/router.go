package router

import (
	"sigma-contacts/internal/api/controller"
	"sigma-contacts/internal/api/middleware"
	"sigma-contacts/internal/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Router struct {
	UserController    *controller.UserController
	UtilsController   *controller.UtilsController
	AuthController    *controller.AuthController
	GraphController   *controller.GraphController
	ContactController *controller.ContactController
	NodeController    *controller.NodeController
	AppConfig         *config.AppConfig
}

func NewRouter(userController *controller.UserController, utilsController *controller.UtilsController,
	AuthController *controller.AuthController, GraphController *controller.GraphController,
	ContactController *controller.ContactController, NodeController *controller.NodeController,
	AppConfig *config.AppConfig) *Router {
	return &Router{
		UserController:    userController,
		UtilsController:   utilsController,
		AuthController:    AuthController,
		GraphController:   GraphController,
		ContactController: ContactController,
		NodeController:    NodeController,
		AppConfig:         AppConfig,
	}
}

func (r *Router) InitRoutes() *gin.Engine {
	router := gin.New()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	utils := api.Group("/utils")

	utils.GET("/ping", r.UserController.Ping)

	users := api.Group("/users")
	users.Use(middleware.AuthMiddleware(r.AppConfig.JwtSecret))

	users.GET("/:id", r.UserController.GetUser)
	users.POST("/", r.UserController.CreateUser)

	auth := api.Group("/auth")
	auth.POST("/register", r.AuthController.Register)
	auth.POST("/login", r.AuthController.Login)

	graph := api.Group("/graph")
	graph.Use(middleware.AuthMiddleware(r.AppConfig.JwtSecret))

	graph.GET("/:id", r.GraphController.Get)
	graph.POST("/", r.GraphController.Create)

	contact := api.Group("/contact")
	contact.Use(middleware.AuthMiddleware(r.AppConfig.JwtSecret))

	contact.POST("/", r.ContactController.Add)
	contact.PUT("/", r.ContactController.Change)
	contact.DELETE("/", r.ContactController.Delete)

	node := api.Group("/node")
	node.Use(middleware.AuthMiddleware(r.AppConfig.JwtSecret))

	node.PUT("/:id", r.NodeController.Change)

	return router
}
