package config

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitializeDB creates a new GORM DB connection
func InitializeDB() (*gorm.DB, error) {
	config := GetDBConfig()
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		config.Host, config.User, config.Password, config.DBName, config.Port, config.SSLMode)

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
		fmt.Println("Failed to get DB connection")
		return
	}
	sqlDB.Close()
}
