package dto_request

type AuthRequest struct {
	Nickname string `json:"nickname"`
	Password string `json:"password"`
}
