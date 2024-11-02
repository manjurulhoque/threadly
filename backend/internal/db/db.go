package db

import (
	"fmt"
	"github.com/manjurulhoque/threadly/backend/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log/slog"
)

var DB *gorm.DB

// InitializeDB creates a new GORM DB connection
func InitializeDB() (*gorm.DB, error) {
	conf := config.GetDBConfig()
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		conf.Host, conf.User, conf.Password, conf.DBName, conf.Port, conf.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	DB = db
	return db, nil
}

// CloseDB closes the GORM DB connection
func CloseDB(db *gorm.DB) {
	sqlDB, err := db.DB()
	if err != nil {
		slog.Error("Failed to get DB connection", "error", err.Error())
		return
	}
	if err := sqlDB.Close(); err != nil {
		slog.Error("Failed to close DB connection", "error", err.Error())
	}
}
