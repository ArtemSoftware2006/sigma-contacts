package config

import "os"

type DataBaseConfig struct {
	DatabaseHost string
	DatabasePort string
	DatabaseName string
}

type AppConfig struct {
	DataBaseConfig
}

func GetAppConfig() *AppConfig {
	return &AppConfig{
		DataBaseConfig: DataBaseConfig{
			DatabaseHost: getEnv("DB_HOST", "mongodb://localhost"),
			DatabasePort: getEnv("DB_PORT", "27017"),
			DatabaseName: getEnv("DATABASE_NAME", "sigma-contacts"),
		},
	}
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultVal
}
