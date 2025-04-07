package dto_response

import (
	"sigma-contacts/internal/domain/entities"
	"time"
)

type CreateGraphResponse struct {
	BaseResponse
}

type GetGraphResponse struct {
	BaseResponse
	ID        string          `json:"id" bson:"_id,omitempty"` // ID графа (Mongo автоматически генерирует)
	UserID    string          `bson:"userId"`                  // ID пользователя, которому принадлежит граф
	Name      string          `bson:"name"`                    // Название графа
	CreatedAt time.Time       `bson:"createdAt"`               // Дата создания графа
	Nodes     []entities.Node `bson:"nodes"`                   // Массив узлов графа
	Edges     []entities.Edge `bson:"edges"`                   // Массив рёбер графа
}
