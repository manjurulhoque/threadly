package models

import "gorm.io/gorm"

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

// AfterCreate hook for incrementing the like count
func (l *Like) AfterCreate(tx *gorm.DB) error {
	return tx.Model(&Thread{}).
		Where("id = ?", l.ThreadId).
		Update("like_count", gorm.Expr("like_count + ?", 1)).Error
}

// AfterDelete hook for decrementing the like count
func (l *Like) AfterDelete(tx *gorm.DB) error {
	return tx.Model(&Thread{}).
		Where("id = ?", l.ThreadId).
		Update("like_count", gorm.Expr("like_count - ?", 1)).Error
}
