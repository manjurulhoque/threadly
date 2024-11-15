package models

type Like struct {
	BaseModel
	UserId   uint `json:"user_id" gorm:"not null"`   // User who liked
	ThreadId uint `json:"thread_id" gorm:"not null"` // Thread being liked

	// Associations
	User   User   `json:"user" gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE"`
	Thread Thread `json:"thread" gorm:"foreignKey:ThreadId;constraint:OnDelete:CASCADE"`
}

func (l *Like) TableName() string {
	return "likes"
}
