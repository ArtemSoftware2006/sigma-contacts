package entities

type Graph struct {
	Id        string `json:"_id"`
	CreatedAt string `json:"createdAt"`
	Name      string `json:"name"`
	UserId    string `json:"userId"`
}
