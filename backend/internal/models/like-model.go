package models

type Like struct {
	BaseModel
	UserID   uint `json:"user_id" gorm:"not null"`   // User who liked
	ThreadID uint `json:"thread_id" gorm:"not null"` // Thread being liked

	// Associations
	User   User   `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Thread Thread `json:"thread" gorm:"foreignKey:ThreadID;constraint:OnDelete:CASCADE"`
}

func (l *Like) TableName() string {
	return "likes"
}
