package dto_response

type UserCreateResponse struct {
}

type UserUpdateResponse struct {
	BaseResponse
}

type UserGetBaseAuthResponse struct {
	UserGetResponse
}

type UserGetResponse struct {
	Id       string `bson:"_id" json:"id"`
	Name     string `bson:"name" json:"name"`
	Surname  string `bson:"surname" json:"surname"`
	Nickname string `json:"nickname"`
	Password string `json:"password"`
}

type UserInfoResponse struct {
	Name     string `bson:"name" json:"name"`
	Surname  string `bson:"surname" json:"surname"`
	Nickname string `json:"nickname"`
}
