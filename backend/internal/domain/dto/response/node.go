package dto_response

type AddNodeResponse struct {
	NodeId string `bson:"nodeId" json:"nodeId"`
}

type ChangeNodeResponse struct {
	BaseResponse
}

type AddGroupNodeResponse struct {
	BaseResponse
	NodeID string `json:"nodeId"`
}
type AddContactNodeResponse struct {
	BaseResponse
	NodeID string `json:"nodeId"`
	EdgeID string `json:"edgeId"`
}
