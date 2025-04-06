package config

import "os"

type DataBaseConfig struct {
	DatabaseHost string
	DatabasePort string
	DatabaseName string
}

type JwtConfig struct {
	JwtSecret string
}

type AppConfig struct {
	DataBaseConfig
	JwtConfig
}

func GetAppConfig() *AppConfig {
	return &AppConfig{
		DataBaseConfig: DataBaseConfig{
			DatabaseHost: getEnv("DB_HOST", "mongodb://localhost"),
			DatabasePort: getEnv("DB_PORT", "27017"),
			DatabaseName: getEnv("DATABASE_NAME", "sigma-contacts"),
		},
		JwtConfig: JwtConfig{
			JwtSecret: getEnv("JWT_SECRET", "secret"),
		},
	}
}

func getEnv(key string, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultVal
}
