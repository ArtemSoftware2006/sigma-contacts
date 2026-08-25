package dto_request

import "sigma-contacts/internal/domain/entities"

type AddNodeRequest struct {
	Label    string  `bson:"label" json:"label"`
	X        float64 `bson:"x" json:"x"`
	Y        float64 `bson:"y" json:"y"`
	Size     float64 `bson:"size" json:"size"`
	Color    string  `bson:"color" json:"color"`
	Type     string  `bson:"type" json:"type"`
	IsGroup  bool    `bson:"isGroup" json:"isGroup"`
	Category string  `bson:"category" json:"category"`
	// Children  []string `bson:"children,omitempty" json:"children,omitempty"`
	Contact  entities.Contact `bson:"contact" json:"contact"`
	ParentID string           `bson:"parentId" json:"parentId"`
}

type ChangeNodeRequest struct {
	Id       string           `bson:"id"`
	Label    string           `bson:"label" json:"label"`
	X        float64          `bson:"x" json:"x"`
	Y        float64          `bson:"y" json:"y"`
	Size     float64          `bson:"size" json:"size"`
	Color    string           `bson:"color" json:"color"`
	Type     string           `bson:"type" json:"type"`
	IsGroup  bool             `bson:"isGroup" json:"isGroup"`
	Category string           `bson:"category" json:"category"`
	Children []string         `bson:"children,omitempty" json:"children,omitempty"`
	Contact  entities.Contact `bson:"contact" json:"contact"`
	ParentID *string          `bson:"parentId,omitempty" json:"parentId,omitempty"`
}

type AddGroupNodeRequest struct {
	Label string  `json:"label"`
	Size  float64 `bson:"size" json:"size"`
	Type  string  `bson:"type" json:"type"`
	Color string  `json:"color"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
}

type AddContactNodeRequest struct {
	GroupID string         `json:"groupId"`
	Label   string         `json:"label"`
	Contact ContactPayload `json:"contact"`
	X       float64        `json:"x"`
	Y       float64        `json:"y"`
}

type ContactPayload struct {
	ContactId     string `json:"contactId"`
	Surname       string `json:"surname"`
	Name          string `json:"name"`
	Phone         string `json:"phone"`
	VkId          string `json:"vkId"`
	TelegramId    string `json:"telegramId"`
	WhatsAppPhone string `json:"whatsAppPhone"`
	Github        string `json:"github"`
	Comment       string `json:"comment"`
}

func MapDtoToEntityContact(contactDto *ContactPayload) *entities.Contact {
	if contactDto == nil {
		return nil
	}

	return &entities.Contact{
		Id:            contactDto.ContactId,
		Surname:       contactDto.Surname,
		Name:          contactDto.Name,
		Phone:         contactDto.Phone,
		VkId:          contactDto.VkId,
		TelegramId:    contactDto.TelegramId,
		WhatsAppPhone: contactDto.WhatsAppPhone,
		Github:        contactDto.Github,
		Comment:       contactDto.Comment,
	}
}
