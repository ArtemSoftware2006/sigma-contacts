package dto_response

type UserCreateResponse struct {
}

type UserGetBaseAuthResponse struct {
	UserGetResponse
}

type UserGetResponse struct {
	Id       string `json:"_id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Nickname string `json:"nickname"`
	Password string `json:"password`
}
