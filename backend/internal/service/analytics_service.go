package service

import (
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	repository_interface "sigma-contacts/internal/domain/interface/repository"

	log "github.com/sirupsen/logrus"
)

type AnalyticsService struct {
	GraphRepository repository_interface.GraphRepository
}

func NewAnalysticsService(graphRepository repository_interface.GraphRepository) *AnalyticsService {
	return &AnalyticsService{
		GraphRepository: graphRepository,
	}
}

func (as *AnalyticsService) CountByUserID(userId string) (*dto_response.BaseProfileAnalytics, error) {
	graph, err := as.GraphRepository.GetUserGraph(&dto_request.GetUserGraphRequest{
		UserId: userId,
	})

	if err != nil {
		log.Error(err)
		return nil, err
	}

	return &dto_response.BaseProfileAnalytics{
		CountContacts: len(graph.Nodes),
	}, nil
}
