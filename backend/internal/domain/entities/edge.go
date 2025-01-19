package entities

type Edge struct {
	Id      string `json:"_id"`
	GroupId string `json:"groupId"`
	From    string `json:"from"`
	To      string `json:"to"`
}
