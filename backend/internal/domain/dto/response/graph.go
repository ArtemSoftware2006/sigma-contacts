package dto_response

import (
	"sigma-contacts/internal/domain/entities"
	"time"
)

type CreateGraphResponse struct {
	GraphId string `json:"graphId" bson:"graphId"` // ID графа
	BaseResponse
}

type GetGraphResponse struct {
	BaseResponse
	ID        string          `json:"id" bson:"_id,omitempty"`    // ID графа (Mongo автоматически генерирует)
	UserID    string          `json:"userId" bson:"userId"`       // ID пользователя, которому принадлежит граф
	Name      string          `json:"name" bson:"name"`           // Название графа
	CreatedAt time.Time       `json:"createdAt" bson:"createdAt"` // Дата создания графа
	Nodes     []entities.Node `json:"nodes" bson:"nodes"`         // Массив узлов графа
	Edges     []entities.Edge `json:"edges" bson:"edges"`         // Массив рёбер графа
}

type GetUserGraphResponse struct {
	BaseResponse
	Graph GetGraphResponse `json:"graph"`
}
