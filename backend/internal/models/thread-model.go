package models

type Thread struct {
	BaseModel
	Content     string `json:"content" gorm:"not null"`
	UserID      uint   `json:"user_id" gorm:"column:user_id;not null"`
	CommunityId uint   `json:"community_id" gorm:"column:community_id;null"`

	User      ThreadUser `json:"user" gorm:"foreignKey:UserID"`
	LikeCount int        `json:"like_count" gorm:"default:0"` // Add like count for efficiency
}

// TableName overrides the table name
func (t *Thread) TableName() string {
	return "threads"
}
