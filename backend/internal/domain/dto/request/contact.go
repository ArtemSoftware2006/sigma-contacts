package dto_request

type AddContactRequest struct {
	Node AddNodeRequest `json:"node"`
	Edge AddEdgeRequest `json:"edge"`
}
