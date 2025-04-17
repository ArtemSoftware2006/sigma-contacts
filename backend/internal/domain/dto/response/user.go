package dto_response

type UserCreateResponse struct {
}

type UserGetBaseAuthResponse struct {
	UserGetResponse
}

type UserGetResponse struct {
	Id       string `bson:"_id" json:"id"`
	Name     string `bson:"name" json:"name"`
	Surname  string `bson:"sutnmae" json:"surname"`
	Nickname string `json:"nickname"`
	Password string `json:"password"`
}
