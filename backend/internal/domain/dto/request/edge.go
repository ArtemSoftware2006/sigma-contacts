package dto_request

type AddEdgeRequest struct {
	Source string  `json:"source" bson:"source"`
	Label  string  `json:"label" bson:"label"`
	Color  string  `json:"color" bson:"color"`
	Size   float64 `json:"size" bson:"size"`
	Type   string  `json:"type" bson:"type"`
	Weight int     `json:"weight" bson:"weight"`
}

type ChangeEdgeRequest struct {
	Id     string  `json:"edgeId" bson:"edgeId"`
	Source string  `json:"source" bson:"source"`
	Target string  `json:"target" bson:"target"`
	Label  string  `json:"label" bson:"label"`
	Color  string  `json:"color" bson:"color"`
	Size   float64 `json:"size" bson:"size"`
	Type   string  `json:"type" bson:"type"`
	Weight int     `json:"weight" bson:"weight"`
}
