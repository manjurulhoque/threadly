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

type CommentResponse struct {
	ID        uint   `json:"id"`
	Content   string `json:"content"`
	UserId    uint   `json:"user_id"`
	ThreadId  uint   `json:"thread_id"`
	CreatedAt string `json:"created_at"`

	User PublicUser `json:"user"`
}

func (c *CommentResponse) TableName() string {
	return "comments"
}
