package models

type NotificationType string

const (
	NotificationTypeLike    NotificationType = "like"
	NotificationTypeComment NotificationType = "comment"
	NotificationTypeFollow  NotificationType = "follow"
)

type Notification struct {
	BaseModel
	UserId    uint             `json:"user_id" gorm:"not null"`  // User ID of the recipient
	ActorId   uint             `json:"actor_id" gorm:"not null"` // User ID of the actor
	Type      NotificationType `json:"type" gorm:"not null"`     // Type of the notification
	ThreadId  *uint            `json:"thread_id"`                // ID of the thread if the notification is related to a thread
	CommentId *uint            `json:"comment_id"`               // ID of the comment if the notification is related to a comment
	IsRead    bool             `json:"is_read" gorm:"default:false"`

	// Relationships
	User  User `json:"-" gorm:"foreignKey:UserId"` // User who received the notification
	Actor User `json:"-" gorm:"foreignKey:ActorId"` // User who sent the notification
}

func (n *Notification) TableName() string {
	return "notifications"
}
