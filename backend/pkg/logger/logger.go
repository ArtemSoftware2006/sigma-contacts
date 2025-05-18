package logger

import (
	"io"
	"os"

	"github.com/sirupsen/logrus"
)

func InitLogger(env string) {
	var output io.Writer
	var formatter logrus.Formatter
	var level logrus.Level

	switch env {
	case "dev":
		output = os.Stdout
		formatter = &logrus.TextFormatter{
			DisableTimestamp:       false,
			TimestampFormat:        "2006-01-02 15:04:05",
			DisableColors:          false,
			QuoteEmptyFields:       true,
			DisableLevelTruncation: true,
			PadLevelText:           true,
			FullTimestamp:          false,
		}
		level = logrus.TraceLevel

	case "prod":
		logFile, err := os.OpenFile("logs/api.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err != nil {
			logrus.Fatalf("Не удалось открыть файл для логов: %v", err)
		}
		output = io.MultiWriter(os.Stdout, logFile) // Пишем и в консоль, и в файл
		formatter = &logrus.JSONFormatter{
			TimestampFormat: "2006-01-02 15:04:05",
		}
		level = logrus.TraceLevel

	default:
		logrus.Warnf("Неизвестное окружение: %s. Использую настройки по умолчанию (dev)", env)
		output = os.Stdout
		formatter = &logrus.TextFormatter{}
		level = logrus.DebugLevel
	}

	logrus.SetOutput(output)
	logrus.SetFormatter(formatter)
	logrus.SetLevel(level)
	logrus.SetReportCaller(true)
}
