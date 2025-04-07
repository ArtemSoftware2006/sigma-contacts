package dto_response

type AddNodeResponse struct {
	ID string `bson:"id" json:"id"` // Уникальный ID узла
	BaseResponse
}

type ChangeNodeResponse struct {
	BaseResponse
}
