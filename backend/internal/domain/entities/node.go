package entities

type Node struct {
	Id       string  `json:"_id"`
	GroupId  string  `json:"groupId"`
	Title    string  `json:"title"`
	Type     string  `json:"type"`
	Contacts Contact `json:"contacts"`
}
