package entities

type Node struct {
	ID       string   `json:"id" bson:"id"`             // Уникальный ID узла
	Label    string   `json:"label" bson:"label"`       // Метка узла
	X        float64  `json:"x" bson:"x"`               // Координата X
	Y        float64  `json:"y" bson:"y"`               // Координата Y
	Size     float64  `json:"size" bson:"size"`         // Размер узла
	Color    string   `json:"color" bson:"color"`       // Цвет узла
	Type     string   `json:"type" bson:"type"`         // Тип узла (например, "circle")
	IsGroup  bool     `json:"isGroup" bson:"isGroup"`   // Является ли узел особенным
	Children []string `json:"children" bson:"children"` // Дочерние узлы (если это особенный узел)
	ParentId string   `json:"parentId" bson:"parentId"` // ID родительского узла (если это дочерний)
	Category string   `json:"category" bson:"category"` // Категория контакта (Коллеги, Школа и т.д.)
	Contact  Contact  `json:"contact" bson:"contact"`
	Comment  string   `json:"comment" bson:"comment"`
}
