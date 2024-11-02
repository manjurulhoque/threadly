package models

type Thread struct {
	BaseModel
	Text        string `json:"text"`
	UserID      uint   `json:"user_id"`
	CommunityId uint   `json:"community_id" gorm:"column:community_id;not null"`
	ParentId    *uint  `json:"parent_id" gorm:"column:parent_id,index"` //Adding an index to the ParentID field (gorm:"index") can improve query performance when retrieving child threads.

	Children []Thread `json:"children" gorm:"foreignKey:ParentId"`
}

// TableName overrides the table name
func (t *Thread) TableName() string {
	return "threads"
}
