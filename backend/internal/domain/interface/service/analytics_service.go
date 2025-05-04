package service_interface

import dto_response "sigma-contacts/internal/domain/dto/response"

type AnalyticsService interface {
	CountByUserID(userId string) (*dto_response.BaseProfileAnalytics, error)
}
