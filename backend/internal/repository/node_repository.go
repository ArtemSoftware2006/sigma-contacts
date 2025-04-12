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

type NodeRepository struct {
	dbTimeout time.Duration
	config    config.AppConfig
	db        *mongo.Database
}

func NewNodeRepository(client *mongo.Client, dbName string, dbTimeout int) *NodeRepository {
	return &NodeRepository{
		dbTimeout: time.Duration(dbTimeout) * time.Second,
		db:        client.Database(dbName),
		config:    *config.GetAppConfig(),
	}
}

func (nr *NodeRepository) Add(req *dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), nr.dbTimeout)
	defer cancel()

	collection := nr.db.Collection("graphs")

	// Создаем фильтр для поиска документа, который нужно обновить
	objectID, err := primitive.ObjectIDFromHex(req.GraphId)
	if err != nil {
		return nil, fmt.Errorf("неверный формат GraphId: %v", err)
	}

	// Теперь фильтр будет работать
	filter := bson.M{"_id": objectID}

	newNodeID := "n" + uuid.New().String()[:4] // Пример: "n1a2b3c4"

	// Создаем новый узел с сгенерированным ID
	newNode := bson.M{
		"id":        newNodeID,
		"label":     req.Node.Label,     // предполагается, что label приходит в запросе
		"x":         req.Node.X,         // координата X
		"y":         req.Node.Y,         // координата Y
		"size":      req.Node.Size,      // размер узла
		"color":     req.Node.Color,     // цвет
		"type":      req.Node.Type,      // тип (например, "circle")
		"isSpecial": req.Node.IsSpecial, // флаг
		"parentId":  req.Node.ParentID,  // ID родителя (если есть)
	}

	// Создаем обновление - добавляем новый узел в массив nodes
	update := bson.M{
		"$push": bson.M{
			"nodes": newNode, // Предполагается, что в req есть Node - новый узел
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
	return &dto_response.AddNodeResponse{IdNode: newNodeID}, nil
}

func (nr *NodeRepository) Change(graphId string, req *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), nr.dbTimeout)
	defer cancel()

	collection := nr.db.Collection("graphs")

	objID, err := primitive.ObjectIDFromHex(graphId)
	if err != nil {
		log.Error("Ошибка обновления документа (Неверный формат ObjectId):", err)
		return nil, err
	}

	// Создаем фильтр для поиска документа и конкретного узла
	filter := bson.M{
		"_id":      objID,
		"nodes.id": req.Id,
	}

	// Создаем обновление для замены узла
	update := bson.M{
		"$set": bson.M{
			"nodes.$": req, // Позиционный оператор $ заменяет найденный элемент
		},
	}

	// Выполняем обновление
	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Error("Ошибка обновления документа:", err)
		return nil, err
	}

	if result.MatchedCount == 0 {
		log.Error("Ошибка обновления документа: (result.MatchedCount == 0)", err)
		return nil, err
	}

	return &dto_response.ChangeNodeResponse{}, nil
}

func (nr *NodeRepository) Delete(graphId string, nodeId string) error {
	ctx, cancel := context.WithTimeout(context.Background(), nr.dbTimeout)
	defer cancel()

	collection := nr.db.Collection("graphs")

	objID, err := primitive.ObjectIDFromHex(graphId)
	if err != nil {
		log.Error("Ошибка удаления узла (неверный ObjectId):", err)
		return err
	}

	// Удаляем узел с указанным id из массива nodes
	filter := bson.M{"_id": objID}
	update := bson.M{
		"$pull": bson.M{
			"nodes": bson.M{"id": nodeId},
		},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Error("Ошибка при удалении узла из графа:", err)
		return err
	}

	if result.ModifiedCount == 0 {
		log.Warn("Узел не найден или уже удалён (ModifiedCount == 0)")
		return fmt.Errorf("узел с id %s не найден в графе %s", nodeId, graphId)
	}

	log.Info("Узел успешно удалён")
	return nil
}
