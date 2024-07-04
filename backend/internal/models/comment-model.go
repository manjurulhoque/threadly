package models

type Comment struct {
	BaseModel
	Content  string `json:"content" gorm:"not null"`
	UserId   uint   `json:"user_id" gorm:"not null"`
	ThreadId uint   `json:"thread_id" gorm:"not null;index"`
}

func (c *Comment) TableName() string {
	return "comments"
}
