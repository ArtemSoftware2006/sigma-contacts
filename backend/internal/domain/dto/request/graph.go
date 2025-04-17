package dto_request

type CreateGraphRequest struct {
	UserId string `json:"userId"`
	Name   string `json:"name"`
}
type GetGraphRequest struct {
	ID string `bson:"_id,omitempty"` // ID графа (Mongo автоматически генерирует)
}

type GetUserGraphRequest struct {
	UserId string `bson:"userId" json:"userId"`
}

type CreateUserGraphRequest struct {
	UserId string `bson:"userId" json:"userId"`
	Name   string `bson:"name" json:"name"`
}
