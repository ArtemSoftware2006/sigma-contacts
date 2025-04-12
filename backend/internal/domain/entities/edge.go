package entities

type Edge struct {
	ID     string  `json:"edgeId" bson:"edgeId"` // Уникальный ID ребра
	Source string  `json:"source" bson:"source"` // Источник (ID узла)
	Target string  `json:"target" bson:"target"` // Цель (ID узла)
	Label  string  `json:"label" bson:"label"`   // Метка ребра
	Color  string  `json:"color" bson:"color"`   // Цвет ребра
	Size   float64 `json:"size" bson:"size"`     // Размер ребра
}
