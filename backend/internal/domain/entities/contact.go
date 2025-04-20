package entities

type Contact struct {
	Id            string `json:"contactId" bson:"contactId"`
	Surname       string `json:"surname" bson:"surname"`
	Name          string `json:"name" bson:"name"`
	Phone         string `json:"phone" bson:"phone"`
	VkId          string `json:"vkId" bson:"vkId"`
	TelegramId    string `json:"telegramId" bson:"telegramId"`
	WhatsAppPhone string `json:"whatsAppPhone" bson:"whatsAppPhone"`
	Github        string `json:"github" bson:"github"`
	Comment       string `json:"comment" bson:"comment"`
}
