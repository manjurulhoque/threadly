package models

type HashTag struct {
	BaseModel
	Name        string `json:"name"`
	ThreadCount int    `json:"thread_count,omitempty" gorm:"-"` // This field is not stored in the database

	Threads []Thread `json:"threads" gorm:"many2many:thread_hash_tags;"`
}

func (h *HashTag) TableName() string {
	return "hash_tags"
}
