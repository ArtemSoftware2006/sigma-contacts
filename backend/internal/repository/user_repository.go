package repository

import (
	"context"
	"fmt"
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

func (ur *UserRepository) Get(user *dto_request.UserGetRequest) (*dto_response.UserInfoResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), ur.dbTimeout)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(user.Id)
	if err != nil {
		log.Error("Ошибка преобразования _id. ", err)
		return nil, err
	}

	collection := ur.db.Collection("users")

	var response dto_response.UserInfoResponse
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

func (ur *UserRepository) FindByNickname(nickname string) (*dto_response.UserGetResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), ur.dbTimeout)
	defer cancel()

	collection := ur.db.Collection("users")

	var response dto_response.UserGetResponse
	err := collection.FindOne(ctx, bson.M{"nickname": nickname}).Decode(&response)

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

func (ur *UserRepository) ExistsByNickname(nickname string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), ur.dbTimeout)
	defer cancel()

	collection := ur.db.Collection("users")

	count, err := collection.CountDocuments(ctx, bson.M{"nickname": nickname})
	return count > 0, err
}

func (ur *UserRepository) Update(user *dto_request.UserUpdateRequest) (*dto_response.UserUpdateResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), ur.dbTimeout)
	defer cancel()

	collection := ur.db.Collection("users")

	userId, err := primitive.ObjectIDFromHex(user.Id)
	if err != nil {
		log.Error("Ошибка обновления документа (Неверный формат ObjectId):", err)
		return nil, err
	}

	// Создаем фильтр для поиска документа и конкретного узла
	filter := bson.M{
		"_id": userId,
	}

	// Создаем обновление для замены узла
	update := bson.M{
		"$set": bson.M{
			"name":    user.Name,
			"surname": user.Surname,
		},
	}

	// Выполняем обновление
	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Error("Ошибка обновления документа:", err)
		return nil, err
	}

	return &dto_response.UserUpdateResponse{
		BaseResponse: dto_response.BaseResponse{
			Message: fmt.Sprintf("Изменено документов: %d", result.UpsertedCount),
		},
	}, nil
}

func (ur *UserRepository) GetAll() ([]*dto_response.UserInfoResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), ur.dbTimeout)
	defer cancel()

	collection := ur.db.Collection("users")

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Error("Ошибка при получении всех пользователей: ", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []*dto_response.UserInfoResponse
	for cursor.Next(ctx) {
		var user dto_response.UserInfoResponse
		if err := cursor.Decode(&user); err != nil {
			log.Error("Ошибка декодирования пользователя: ", err)
			continue
		}
		users = append(users, &user)
	}

	if err := cursor.Err(); err != nil {
		log.Error("Ошибка при итерации курсора: ", err)
		return nil, err
	}

	return users, nil
}
