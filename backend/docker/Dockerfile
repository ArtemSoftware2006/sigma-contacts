# Build stage
FROM golang:alpine AS builder

WORKDIR /app

# Установка зависимостей для сборки
RUN apk add --no-cache git make gcc musl-dev

# Копируем файлы модулей
COPY go.mod go.sum ./
RUN go mod download

# Копируем весь проект
COPY . .

# Собираем приложение
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/bin/api ./cmd/app/main.go

# Runtime stage
FROM alpine:3.18

WORKDIR /app

# Установка runtime зависимостей
RUN apk add --no-cache ca-certificates tzdata

# Копируем бинарник
COPY --from=builder /app/bin/api .
COPY --from=builder /app/.env .
# Копируем конфиги (если нужно)
COPY --from=builder /app/internal/config ./internal/config

# Порт приложения
EXPOSE 8080

# Команда запуска
CMD ["./api"]