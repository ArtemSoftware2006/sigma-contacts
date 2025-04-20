package dto_request

type AddContactRequest struct {
	Surname       string `json:"surname"`
	Name          string `json:"name"`
	Phone         string `json:"phone"`
	VkId          string `json:"vkId"`
	TelegramId    string `json:"telegramId"`
	WhatsAppPhone string `json:"whatsAppPhone"`
	Github        string `json:"github"`
	Comment       string `json:"comment"`
}

type ChangeContactRequest struct {
	Id            string `json:"contactId"`
	Surname       string `json:"surname"`
	Name          string `json:"name"`
	Phone         string `json:"phone"`
	VkId          string `json:"vkId"`
	TelegramId    string `json:"telegramId"`
	WhatsAppPhone string `json:"whatsAppPhone"`
	Github        string `json:"github"`
	Comment       string `json:"comment"`
}
