package models

type Mention struct {
	BaseModel
	ThreadId uint `json:"thread_id" gorm:"not null"` // The thread where the user is tagged
	UserId   uint `json:"user_id" gorm:"not null"`   // The mentioned user's ID

	Thread Thread `json:"thread" gorm:"foreignKey:ThreadId;constraint:OnDelete:CASCADE"`
	User   User   `json:"user" gorm:"foreignKey:UserId;constraint:OnDelete:CASCADE"`
}

func (t *Mention) TableName() string {
	return "mentions"
}
