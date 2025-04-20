package dto_request

type AddContactFullDataRequest struct {
	GraphId string         `json:"graphId"`
	Node    AddNodeRequest `json:"node"`
	Edge    AddEdgeRequest `json:"edge"`
}

type ChangeContactFullDataRequest struct {
	GraphId string            `json:"graphId"`
	Node    ChangeNodeRequest `json:"node"`
	Edge    ChangeEdgeRequest `json:"edge"`
}

type DeleteContactFullDataRequest struct {
	GraphId string `json:"graphId"`
	NodeId  string `json:"nodeId"`
	EdgeId  string `json:"edgeId"`
}
