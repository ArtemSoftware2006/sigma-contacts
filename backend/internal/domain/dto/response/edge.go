package dto_response

type AddEdgeResponse struct {
	EdgeId string `bson:"edgeId" json:"edgeId"` // Уникальный ID узла
}

type ChangeEdgeResponse struct {
	BaseResponse
}
