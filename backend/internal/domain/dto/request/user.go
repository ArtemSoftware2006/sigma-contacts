package dto_request

type UserCreateRequest struct {
	Name     string `json:"name" bson:"name"`
	Surname  string `json:"surname" bson:"surname"`
	Nickname string `json:"nickname" bson:"nickname"`
	Role     string `json:"role"`
	Password string `json:"password" bson:"password"`
}

type UserUpdateRequest struct {
	Id      string `json:"_id"`
	Name    string `json:"name" bson:"name"`
	Surname string `json:"surname" bson:"surname"`
}

type UserGetRequest struct {
	Id string `json:"_id"`
}

type UserFindByNickRequest struct {
	Nickname string `json:"nickname"`
}
