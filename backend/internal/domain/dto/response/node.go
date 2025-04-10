package dto_response

type AddNodeResponse struct {
	IdNode string `bson:"idNode" json:"idNode"` // Уникальный ID узла
}

type ChangeNodeResponse struct {
	BaseResponse
}
