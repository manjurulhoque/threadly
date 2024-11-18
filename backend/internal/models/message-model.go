package models

import "time"

type Message struct {
	ID         uint      `gorm:"primaryKey"`
	SenderId   uint      `gorm:"not null"` // User who sent the message
	ReceiverId uint      `gorm:"not null"` // User or Group receiving the message
	Content    string    `gorm:"not null"` // Message content
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	IsRead     bool      `gorm:"default:false"` // Read status
}

func (m *Message) TableName() string {
	return "messages"
}
