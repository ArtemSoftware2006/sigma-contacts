package repository

import (
	"context"
	"errors"
	"fmt"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/domain/entities"
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

func (gr *GraphRepository) Create(req *dto_request.CreateGraphRequest) (*dto_response.CreateGraphResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), gr.dbTimeout)
	defer cancel()

	collection := gr.db.Collection("graphs")

	graph := entities.Graph{
		UserId:    req.UserId,
		Name:      req.Name,
		CreatedAt: time.Now(),
		Nodes:     []entities.Node{},
		Edges:     []entities.Edge{},
	}

	result, err := collection.InsertOne(ctx, graph)

	if err != nil {
		log.Error("Ошибка вставки документа:", err)
		return nil, err
	}

	oid, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		return nil, fmt.Errorf("unexpected inserted ID type: %T", result.InsertedID)
	}

	return &dto_response.CreateGraphResponse{
		GraphId: oid.Hex(),
	}, nil
}
func (gr *GraphRepository) Get(graph *dto_request.GetGraphRequest) (*dto_response.GetGraphResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), gr.dbTimeout)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(graph.Id)
	if err != nil {
		log.Error("Ошибка преобразования _id. ", err)
		return nil, err
	}

	collection := gr.db.Collection("graphs")

	var response dto_response.GetGraphResponse
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&response)

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

func (gr *GraphRepository) GetUserGraph(req *dto_request.GetUserGraphRequest) (*dto_response.GetGraphResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), gr.dbTimeout)
	defer cancel()

	collection := gr.db.Collection("graphs")

	var response dto_response.GetGraphResponse
	err := collection.FindOne(ctx, bson.M{"userId": req.UserId}).Decode(&response)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Warn("Граф пользователя не найден. ", err)
			return nil, err
		}
		log.Error("Ошибка при поиске графа по user_id. ", err)
		return nil, err
	}

	return &response, nil
}

func (gr *GraphRepository) UpdateGraph(userId string, nodes []entities.Node, edges []entities.Edge) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userId}
	update := bson.M{
		"$set": bson.M{
			"nodes": nodes,
			"edges": edges,
		},
	}

	collection := gr.db.Collection("graphs")

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		log.Error("GraphRepository, Error graph not found. userId = ", userId)
		return errors.New("граф для пользователя не найден")
	}

	return nil
}
