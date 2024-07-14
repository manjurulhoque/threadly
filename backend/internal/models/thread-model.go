package models

type Thread struct {
	BaseModel
	Content     string `json:"content" gorm:"not null"`
	UserID      uint   `json:"user_id" gorm:"column:user_id;not null"`
	CommunityId uint   `json:"community_id" gorm:"column:community_id;null"`

	User ThreadUser `json:"user" gorm:"foreignKey:UserID"`
}

// TableName overrides the table name
func (t *Thread) TableName() string {
	return "threads"
}
