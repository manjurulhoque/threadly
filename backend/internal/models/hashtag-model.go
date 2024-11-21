package models

type HashTag struct {
	BaseModel
	Id   int    `json:"id"`
	Name string `json:"name"`

	Threads []Thread `json:"threads" gorm:"many2many:thread_tags;"`
}

func (h *HashTag) TableName() string {
	return "hash_tags"
}
