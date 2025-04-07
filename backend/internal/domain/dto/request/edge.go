package dto_request

type AddEdgeRequest struct {
	Source string  `bson:"source"` // Источник (ID узла)
	Target string  `bson:"target"` // Цель (ID узла)
	Label  string  `bson:"label"`  // Метка ребра
	Color  string  `bson:"color"`  // Цвет ребра
	Size   float64 `bson:"size"`   // Размер ребра
}
