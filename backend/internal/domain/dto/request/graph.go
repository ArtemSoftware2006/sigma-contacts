package dto_request

import (
	"time"
)

type CreateGraphRequest struct {
	UserID    string    `json:"userId"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
}

type GetGraphRequest struct {
	ID string `bson:"_id,omitempty"` // ID графа (Mongo автоматически генерирует)
}
