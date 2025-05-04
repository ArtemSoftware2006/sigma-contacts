package dto_response

type AddNodeResponse struct {
	NodeId string `bson:"nodeId" json:"nodeId"`
}

type ChangeNodeResponse struct {
	BaseResponse
}
