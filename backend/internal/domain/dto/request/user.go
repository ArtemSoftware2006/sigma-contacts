package dto_request

type UserCreateRequest struct {
	Name     string `json:"name" bson:"name"`
	Surname  string `json:"surname" bson:"surname"`
	Nickname string `json:"nickname" bson:"nickname"`
	Password string `json:"password" bson:"password"`
}

type UserGetRequest struct {
	Id string `json:"_id"`
}

type UserFindByNickRequest struct {
	Nickname string `json:"nickname"`
}
