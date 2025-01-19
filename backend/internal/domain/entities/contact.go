package entities

type Contact struct {
	Surname       string `json:"surname"`
	Name          string `json:"name"`
	Phone         string `json:"phone"`
	VkId          string `json:"vkId"`
	TelegramId    string `json:"telegramId"`
	WhatsAppPhone string `json:"whatsAppPhone"`
	Github        string `json:"github"`
}
