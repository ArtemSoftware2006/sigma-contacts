package dto_request

type UserGetBaseAuthRequest struct {
	Nickname string `json:"nickname"`
	Password string `json:"password"`
}
