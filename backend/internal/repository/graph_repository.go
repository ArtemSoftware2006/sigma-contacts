package repository

import (
	"context"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"time"

	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type GraphRepository struct {
	dbTimeout time.Duration
	config    config.AppConfig
	db        *mongo.Database
}

func NewGraphRepository(client *mongo.Client, dbName string, dbTimeout int) *GraphRepository {
	return &GraphRepository{
		dbTimeout: time.Duration(dbTimeout) * time.Second,
		db:        client.Database(dbName),
		config:    *config.GetAppConfig(),
	}
}

func (gr *GraphRepository) Create(graph *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), gr.dbTimeout)
	defer cancel()

	collection := gr.db.Collection("graphs")

	result, err := collection.InsertOne(ctx, graph)

	log.Println("GraphRepository, result : ", result)

	if err != nil {
		log.Error("Ошибка вставки документа:", err)
		return nil, err
	}

	return &dto_response.CreateGraphResponse{}, nil
}
func (gr *GraphRepository) Get(graph *dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), gr.dbTimeout)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(graph.ID)
	if err != nil {
		log.Error("Ошибка преобразования _id. ", err)
		return nil, err
	}

	collection := gr.db.Collection("graphs")

	var response dto_response.GetGraphResponse
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&response)

	log.Println(response)
	log.Println(graph.ID)
	log.Println(objectID)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Warn("Документ не найден. ", err)
			return nil, err
		}
		log.Error("Ошибка поиска документа. ", err)
		return nil, err
	}

	return &response, nil
}
