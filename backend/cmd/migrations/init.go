package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"sigma-contacts/internal/domain/entities"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Ошибка загрузки .env файла", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Создаём параметры подключения
	clientOptions := options.Client().ApplyURI(os.Getenv("DB_HOST"))

	if clientOptions.GetURI() == "" {
		log.Fatal("Ошибка подключения к MongoDB: DB_HOST не задан")

	}

	// Подключаемся к MongoDB
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Ошибка подключения к MongoDB:", err)
	}

	// Проверяем подключение с помощью Ping
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Ошибка пинга MongoDB:", err)
	}

	log.Println("Успешное подключение к MongoDB")

	type MigrationGraph struct {
		ID        primitive.ObjectID `bson:"_id,omitempty"` // ID графа (Mongo автоматически генерирует)
		UserID    string             `bson:"userId"`        // ID пользователя, которому принадлежит граф
		Name      string             `bson:"name"`          // Название графа
		CreatedAt time.Time          `bson:"createdAt"`     // Дата создания графа
		Nodes     []entities.Node    `bson:"nodes"`         // Массив узлов графа
		Edges     []entities.Edge    `bson:"edges"`         // Массив рёбер графа
	}

	// Создаем новый граф
	graph := MigrationGraph{
		ID:        primitive.NewObjectID(),
		Name:      "Sample Graph with Subtrees",
		CreatedAt: time.Now(),
		Nodes: []entities.Node{
			{
				ID:        "n1",
				Label:     "Root Node",
				X:         0,
				Y:         0,
				Size:      15,
				Color:     "#FF5733",
				Type:      "circle",
				IsSpecial: true,
				Children:  []string{"n2", "n3"},
			},
			{
				ID:       "n2",
				Label:    "Child Node 1",
				X:        1,
				Y:        1,
				Size:     10,
				Color:    "#33FF57",
				Type:     "circle",
				ParentId: "n1",
			},
			{
				ID:       "n3",
				Label:    "Child Node 2",
				X:        -1,
				Y:        1,
				Size:     10,
				Color:    "#33FF57",
				Type:     "circle",
				ParentId: "n1",
			},
			{
				ID:       "n4",
				Label:    "Leaf Node",
				X:        0,
				Y:        -2,
				Size:     8,
				Color:    "#F033FF",
				Type:     "circle",
				ParentId: "n2",
			},
		},
		Edges: []entities.Edge{
			{
				ID:     "e1",
				Source: "n1",
				Target: "n2",
				Label:  "Parent-Child Relationship 1",
				Color:  "#666",
				Size:   2,
			},
			{
				ID:     "e2",
				Source: "n1",
				Target: "n3",
				Label:  "Parent-Child Relationship 2",
				Color:  "#666",
				Size:   2,
			},
			{
				ID:     "e3",
				Source: "n2",
				Target: "n4",
				Label:  "Child-Leaf Relationship",
				Color:  "#666",
				Size:   1,
			},
		},
	}

	// Вставляем граф в коллекцию
	collection := client.Database("sigma-contacts").Collection("graphs")
	_, err = collection.InsertOne(context.Background(), graph)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Graph inserted successfully!")
}
