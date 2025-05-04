package dto_response

type AddContactFullDataResponse struct {
	Node    *AddNodeResponse    `json:"node"`
	Edge    *AddEdgeResponse    `json:"edge"`
	Contact *AddContactResponse `json:"contact"`
	BaseResponse
}

type ChangeContactFullDataResponse struct {
	BaseResponse
}

type DeleteContactFullDataResponse struct {
	BaseResponse
}
