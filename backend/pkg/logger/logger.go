package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

func InitLogger() {
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.TraceLevel)
	logrus.SetReportCaller(true)
	logrus.SetFormatter(&logrus.TextFormatter{
		DisableTimestamp:       false,
		TimestampFormat:        "2006-01-02 15:04:05",
		DisableColors:          false,
		QuoteEmptyFields:       true,
		DisableLevelTruncation: true,
		PadLevelText:           true,
		FullTimestamp:          false,
	})
}
