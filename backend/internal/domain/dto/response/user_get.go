package dto_response

type UserGet struct {
	Id       string `json:"_id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Nickname string `json:"nickname"`
}
