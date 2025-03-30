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

type UserRepository struct {
	dbTimeout time.Duration
	config    config.AppConfig
	db        *mongo.Database
}

func NewUserRepository(client *mongo.Client, dbName string, dbTimeout int) *UserRepository {
	return &UserRepository{
		dbTimeout: time.Duration(dbTimeout) * time.Second,
		db:        client.Database(dbName),
		config:    *config.GetAppConfig(),
	}
}

func (ur *UserRepository) Create(user *dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), ur.dbTimeout)
	defer cancel()

	collection := ur.db.Collection("users")

	result, err := collection.InsertOne(ctx, user)
	if err != nil {
		log.Error("Ошибка вставки документа:", err)
		return nil, err
	}
	log.Info("Вставленный ID:", result.InsertedID)

	return &dto_response.UserCreateResponse{}, nil
}

func (ur *UserRepository) Get(user *dto_request.UserGetRequest) (*dto_response.UserGet, error) {
	ctx, cancel := context.WithTimeout(context.Background(), ur.dbTimeout)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(user.Id)
	if err != nil {
		log.Error("Ошибка преобразования _id. ", err)
		return nil, err
	}

	collection := ur.db.Collection("users")

	var response dto_response.UserGet
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
