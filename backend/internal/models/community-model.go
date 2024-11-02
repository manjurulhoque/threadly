package models

type Community struct {
	BaseModel
	Name        string `json:"name" gorm:"unique;not null"`
	Image       string `json:"image"`
	Bio         string `json:"bio"`
	CreatedByID uint   `json:"created_by_id"`
}

// TableName overrides the table name
func (c *Community) TableName() string {
	return "communities"
}
