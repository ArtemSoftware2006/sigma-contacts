package entities

import (
	"time"
)

type Graph struct {
	Id        string    `bson:"_id,omitempty"` // ID графа (Mongo автоматически генерирует)
	UserId    string    `bson:"userId"`        // ID пользователя, которому принадлежит граф
	Name      string    `bson:"name"`          // Название графа
	CreatedAt time.Time `bson:"createdAt"`     // Дата создания графа
	Nodes     []Node    `bson:"nodes"`         // Массив узлов графа
	Edges     []Edge    `bson:"edges"`         // Массив рёбер графа

}
