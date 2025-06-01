package entities

type User struct {
	Id       string `json:"_id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Nickname string `json:"nickname"`
	Role     string `bson:"role"`
	Password string `json:"password"`
}
