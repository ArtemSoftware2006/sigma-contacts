package dto_response

type BaseProfileAnalytics struct {
	BaseResponse
	CountContacts int `json:"countContacts"`
}
