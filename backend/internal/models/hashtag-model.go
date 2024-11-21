package models

type HashTag struct {
	BaseModel
	Name string `json:"name"`

	Threads []Thread `json:"threads" gorm:"many2many:thread_hash_tags;"`
}

func (h *HashTag) TableName() string {
	return "hash_tags"
}
