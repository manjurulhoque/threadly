package models

type Thread struct {
	BaseModel
	Content     string `json:"content" gorm:"not null"`
	UserID      uint   `json:"user_id" gorm:"column:user_id;not null"`
	CommunityId uint   `json:"community_id" gorm:"column:community_id;null"`
	ParentId    *uint  `json:"parent_id" gorm:"column:parent_id,index"` //Adding an index to the ParentID field (gorm:"index") can improve query performance when retrieving child threads.

	Children []Thread   `json:"children" gorm:"foreignKey:ParentId"`
	User     ThreadUser `json:"user" gorm:"foreignKey:UserID"`
}

// TableName overrides the table name
func (t *Thread) TableName() string {
	return "threads"
}
