package repository

import (
	"context"
	"fmt"
	"log"
	"sigma-contacts/internal/config"
	dto_request "sigma-contacts/internal/domain/dto/request"
	dto_response "sigma-contacts/internal/domain/dto/response"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserRepository struct {
	config config.AppConfig
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		config: *config.GetAppConfig(),
	}
}

func (ur *UserRepository) Create(user dto_request.UserCreateRequest) (*dto_response.UserCreateResponse, error) {
	// TODO: Заменить 10 на константу
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// TODO: ввести в конфиг подключение к MongoDB
	client, err := mongo.Connect(
		ctx,
		options.Client().ApplyURI(fmt.Sprintf("%s:%s", ur.config.DatabaseHost, ur.config.DatabasePort)),
	)

	if err != nil {
		log.Println("Ошибка подключения к MongoDB:", err)
		return nil, err
	}
	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			log.Println(err)
		}
	}()

	// TODO: ввести в конфиг выбор базы данных и коллекцию
	collection := client.Database(ur.config.DatabaseName).Collection("users")

	// Пример вставки документа
	result, err := collection.InsertOne(ctx, user)
	if err != nil {
		log.Println("Ошибка вставки документа:", err)
		return nil, err
	}
	fmt.Println("Вставленный ID:", result.InsertedID)

	// Пример получения документа
	// var retrievedUser bson.M
	// err = collection.FindOne(ctx, bson.M{"name": "John Doe"}).Decode(&retrievedUser)
	// if err != nil {
	// 	log.Fatal("Ошибка получения документа:", err)
	// }
	// fmt.Println("Полученный документ:", retrievedUser)

	return &dto_response.UserCreateResponse{}, nil
}

// func (ur *UserRepository) GetBaseAuth(dto_request.UserGetBaseAuthRequest) (*dto_response.UserGetBaseAuthResponse, error) {

// }
