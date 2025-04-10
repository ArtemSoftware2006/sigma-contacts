package dto_response

type AddContactResponse struct {
	Node AddNodeResponse `json:"node"`
	Edge AddEdgeResponse `json:"edge"`
	BaseResponse
}
