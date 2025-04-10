package repository

import (
	"context"
	"fmt"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"time"

	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type EdgeRepository struct {
	dbTimeout time.Duration
	config    config.AppConfig
	db        *mongo.Database
}

func NewEdgeRepository(client *mongo.Client, dbName string, dbTimeout int) *EdgeRepository {
	return &EdgeRepository{
		dbTimeout: time.Duration(dbTimeout) * time.Second,
		db:        client.Database(dbName),
		config:    *config.GetAppConfig(),
	}
}

func (er *EdgeRepository) Add(targetNodeId string, req *dto_request.AddEdgeRequest) (*dto_response.AddEdgeResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), er.dbTimeout)
	defer cancel()

	collection := er.db.Collection("graphs")

	// Создаем фильтр для поиска документа, который нужно обновить
	objectID, err := primitive.ObjectIDFromHex(req.GraphId)
	if err != nil {
		return nil, fmt.Errorf("неверный формат GraphId: %v", err)
	}

	// Теперь фильтр будет работать
	filter := bson.M{"_id": objectID}

	newEdgeID := "e" + uuid.New().String()[:4] // Пример: "n1a2b3c4"

	// Создаем новый узел с сгенерированным ID
	newEdge := bson.M{
		"id":     newEdgeID,
		"label":  req.Edge.Label,  // предполагается, что label приходит в запросе
		"source": req.Edge.Source, // Откуда
		"target": targetNodeId,    // Куда
		"size":   req.Edge.Size,   // размер узла
		"color":  req.Edge.Color,  // цвет

	}

	// Создаем обновление - добавляем новый узел в массив nodes
	update := bson.M{
		"$push": bson.M{
			"edges": newEdge, // Предполагается, что в req есть Node - новый узел
		},
	}

	// Выполняем обновление
	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Error("Ошибка обновления документа:", err)
		return nil, err
	}

	if result.MatchedCount == 0 {
		return nil, fmt.Errorf("документ не найден")
	}

	log.Info("Обновлено документов:", result.ModifiedCount)

	// Возвращаем ответ, возможно с ID нового узла
	return &dto_response.AddEdgeResponse{IdEdge: newEdgeID}, nil
}
