package dto_response

type AddContactResponse struct {
	BaseResponse
	Id string `json:"contactId"`
}

type ChangeContactResponse struct {
	BaseResponse
}
