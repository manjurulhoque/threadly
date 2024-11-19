package models

import "time"

type Message struct {
	Id         uint      `json:"id" gorm:"primaryKey"`
	SenderId   uint      `json:"sender_id" gorm:"not null"` // User who sent the message
	ReceiverId uint      `json:"receiver_id" gorm:"not null"` // User or Group receiving the message
	Content    string    `json:"content" gorm:"not null"` // Message content
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`
	IsRead     bool      `json:"is_read" gorm:"default:false"` // Read status
}

func (m *Message) TableName() string {
	return "messages"
}
