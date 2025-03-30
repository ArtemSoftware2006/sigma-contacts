package router

import (
	"sigma-contacts/internal/api/controller"

	"github.com/gin-gonic/gin"
)

type Router struct {
	UserController  *controller.UserController
	UtilsController *controller.UtilsController
}

func NewRouter(userController *controller.UserController, utilsController *controller.UtilsController) *Router {
	return &Router{
		UserController:  userController,
		UtilsController: utilsController,
	}
}

func (r *Router) InitRoutes() *gin.Engine {
	router := gin.New()

	api := router.Group("/api")
	utils := api.Group("/utils")

	utils.GET("/ping", r.UserController.Ping)

	users := api.Group("/users")
	users.GET("/:id", r.UserController.GetUser)
	users.POST("/", r.UserController.CreateUser)

	return router
}
