package dto_request

type AddNodeDto struct {
	Label     string  `bson:"label" json:"label"`
	X         float64 `bson:"x" json:"x"`
	Y         float64 `bson:"y" json:"y"`
	Size      float64 `bson:"size" json:"size"`
	Color     string  `bson:"color" json:"color"`
	Type      string  `bson:"type" json:"type"`
	IsSpecial bool    `bson:"isSpecial" json:"isSpecial"`
	// Children  []string `bson:"children,omitempty" json:"children,omitempty"`
	ParentID string `bson:"parentId" json:"parentId"`
}
type AddNodeRequest struct {
	GraphId string     `json:"graphId"`
	Node    AddNodeDto `json:"node"`
}

type ChangeNodeRequest struct {
	Id        string   `bson:"id"`
	Label     string   `bson:"label" json:"label"`
	X         float64  `bson:"x" json:"x"`
	Y         float64  `bson:"y" json:"y"`
	Size      float64  `bson:"size" json:"size"`
	Color     string   `bson:"color" json:"color"`
	Type      string   `bson:"type" json:"type"`
	IsSpecial bool     `bson:"isSpecial,omitempty" json:"isSpecial,omitempty"`
	Children  []string `bson:"children,omitempty" json:"children,omitempty"`
	ParentID  *string  `bson:"parentId,omitempty" json:"parentId,omitempty"`
}
