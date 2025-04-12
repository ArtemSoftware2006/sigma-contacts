package dto_request

type AddContactRequest struct {
	Node AddNodeRequest `json:"node"`
	Edge AddEdgeRequest `json:"edge"`
}

type ChangeContactRequest struct {
	GraphId string            `json:"graphId"`
	Node    ChangeNodeRequest `json:"node"`
	Edge    ChangeEdgeRequest `json:"edge"`
}
