package dto_response

type AddEdgeResponse struct {
	IdEdge string `bson:"idEdge" json:"idEdge"` // Уникальный ID узла
}

type ChangeEdgeResponse struct {
	BaseResponse
}
