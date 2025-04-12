package dto_request

type AddEdgeDto struct {
	Source string `bson:"source"` // Источник (ID узла)
	//Target string  `bson:"target"` // Цель (ID узла)  УБИРАЮ, так как добавляю Node я генерю NodeId (может стоит разделить добавление узла и ребра)
	Label string  `bson:"label"` // Метка ребра
	Color string  `bson:"color"` // Цвет ребра
	Size  float64 `bson:"size"`  // Размер ребра
}
type AddEdgeRequest struct {
	GraphId string     `json:"graphId"`
	Edge    AddEdgeDto `json:"edge"`
}

type ChangeEdgeRequest struct {
	Id     string  `json:"id"`
	Source string  `bson:"source"` // Источник (ID узла)
	Target string  `bson:"target"` // Цель (ID узла)
	Label  string  `bson:"label"`  // Метка ребра
	Color  string  `bson:"color"`  // Цвет ребра
	Size   float64 `bson:"size"`   // Размер ребра
}
