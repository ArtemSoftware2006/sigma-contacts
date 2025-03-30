package controller

import "github.com/gin-gonic/gin"

type UtilsController struct {
}

func NewUtilsController() *UtilsController {
	return &UtilsController{}
}

func (uc *UserController) Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}
