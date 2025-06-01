package repository

import (
	"context"
	"fmt"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"sigma-contacts/internal/domain/entities"
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

func (nr *NodeRepository) Add(graphId string, req *dto_request.AddNodeRequest) (*dto_response.AddNodeResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), nr.dbTimeout)
	defer cancel()

	collection := nr.db.Collection("graphs")

	objectID, err := primitive.ObjectIDFromHex(graphId)
	if err != nil {
		log.Println("NodeRepository, GraphId is " + graphId)
		return nil, fmt.Errorf("неверный формат GraphId: %v", err)
	}

	filter := bson.M{"_id": objectID}

	newNodeID := "n" + uuid.New().String()[:4]
	newNode := bson.M{
		"id":       newNodeID,
		"label":    req.Label,    // предполагается, что label приходит в запросе
		"x":        req.X,        // координата X
		"y":        req.Y,        // координата Y
		"size":     req.Size,     // размер узла
		"color":    req.Color,    // цвет
		"type":     req.Type,     // тип (например, "circle")
		"isGroup":  req.IsGroup,  // флаг
		"parentId": req.ParentID, // ID родителя (если есть)
		"contact":  entities.Contact{},
	}

	log.Info("New Node\n" + newNode.String())

	update := bson.M{
		"$push": bson.M{
			"nodes": newNode,
		},
	}

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
	return &dto_response.AddNodeResponse{NodeId: newNodeID}, nil
}

func (nr *NodeRepository) Update(graphId string, req *dto_request.ChangeNodeRequest) (*dto_response.ChangeNodeResponse, error) {
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
