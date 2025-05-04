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

type ContactRepository struct {
	dbTimeout time.Duration
	config    config.AppConfig
	db        *mongo.Database
}

func NewContactRepository(client *mongo.Client, dbName string, dbTimeout int) *ContactRepository {
	return &ContactRepository{
		dbTimeout: time.Duration(dbTimeout) * time.Second,
		db:        client.Database(dbName),
		config:    *config.GetAppConfig(),
	}
}

func (cr *ContactRepository) Add(graphId string, nodeId string, contact *dto_request.AddContactRequest) (*dto_response.AddContactResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), cr.dbTimeout)
	defer cancel()

	collection := cr.db.Collection("graphs")

	graphObjectId, err := primitive.ObjectIDFromHex(graphId)
	if err != nil {
		log.Println("ContactRepository, GraphId is " + graphId)
		return nil, fmt.Errorf("неверный формат GraphId: %v", err)
	}

	log.Info("GraphId: ", graphId, "\nNodeId: ", nodeId)

	filter := bson.M{
		"_id":      graphObjectId,
		"nodes.id": nodeId,
	}

	newContactId := "c" + uuid.New().String()[:4]
	newContact := bson.M{
		"contactId":     newContactId,
		"surname":       contact.Surname,
		"name":          contact.Name,
		"phone":         contact.Name,
		"vkId":          contact.VkId,
		"telegramId":    contact.TelegramId,
		"whatsAppPhone": contact.WhatsAppPhone,
		"github":        contact.Github,
		"comment":       contact.Comment,
	}

	// Создаем операцию обновления для добавления нового контакта
	update := bson.M{
		"$set": bson.M{
			"nodes.$.contact": newContact,
		},
	}

	// Выполняем обновление
	_, err = collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, fmt.Errorf("failed to add contact: %v", err)
	}

	log.Info("New Contact id: ", newContactId)

	return &dto_response.AddContactResponse{
		Id: newContactId,
	}, nil
}
