package dto_request

func EmptyAddContactRequest() *AddContactRequest {
	return &AddContactRequest{
		Surname:       "",
		Name:          "",
		Phone:         "",
		VkId:          "",
		TelegramId:    "",
		WhatsAppPhone: "",
		Github:        "",
		Comment:       "",
		Tags:          []string{},
	}
}

type AddContactRequest struct {
	Surname       string   `json:"surname"`
	Name          string   `json:"name"`
	Phone         string   `json:"phone"`
	VkId          string   `json:"vkId"`
	TelegramId    string   `json:"telegramId"`
	WhatsAppPhone string   `json:"whatsAppPhone"`
	Github        string   `json:"github"`
	Comment       string   `json:"comment"`
	Tags          []string `json:"tags"`
}

type ChangeContactRequest struct {
	Id            string   `json:"contactId"`
	Surname       string   `json:"surname"`
	Name          string   `json:"name"`
	Phone         string   `json:"phone"`
	VkId          string   `json:"vkId"`
	TelegramId    string   `json:"telegramId"`
	WhatsAppPhone string   `json:"whatsAppPhone"`
	Github        string   `json:"github"`
	Comment       string   `json:"comment"`
	Tags          []string `json:"tags"`
}
