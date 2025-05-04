package controller

import (
	"net/http"
	service_interface "sigma-contacts/internal/domain/interface/service"

	"github.com/gin-gonic/gin"
)

type AnalyticsController struct {
	analiticsService service_interface.AnalyticsService
}

func NewAnalysticsController(analyticsService service_interface.AnalyticsService) *AnalyticsController {
	return &AnalyticsController{
		analiticsService: analyticsService,
	}
}

func (ac *AnalyticsController) Add(ctx *gin.Context) {
	userId := ctx.Value("userId").(string)

	countByUserIdResponse, err := ac.analiticsService.CountByUserID(userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, countByUserIdResponse)
}
