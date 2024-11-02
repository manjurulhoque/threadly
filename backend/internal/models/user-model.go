package models

type User struct {
	BaseModel
	Email     string `json:"email" gorm:"unique;not null"`
	Name      string `json:"name" gorm:"not null"`
	Password  string `json:"-" gorm:"not null"`
	IsAdmin   bool   `json:"is_admin"`
	Image     string `json:"image"`
	Bio       string `json:"bio"`
	Onboarded bool   `json:"onboarded"`
}
