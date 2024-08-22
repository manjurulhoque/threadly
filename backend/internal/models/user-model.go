package models

type User struct {
	BaseModel
	Email     string `json:"email" gorm:"unique;not null"`
	Name      string `json:"name" gorm:"not null"`
	Username  string `json:"username" gorm:"unique;not null"`
	Password  string `json:"-" gorm:"not null"`
	IsAdmin   bool   `json:"is_admin"`
	Image     string `json:"image"`
	Bio       string `json:"bio"`
	Onboarded bool   `json:"onboarded"`
}

func (u *User) TableName() string {
	return "users"
}

type PublicUser struct {
	Id        uint   `json:"id"`
	Name      string `json:"name"`
	Username  string `json:"username"`
	Image     string `json:"image"`
	Bio       string `json:"bio"`
	Onboarded bool   `json:"onboarded"`
}

func (u *PublicUser) TableName() string {
	return "users"
}

type ThreadUser struct {
	Id       uint   `json:"id"`
	Name     string `json:"name"`
	Username string `json:"username"`
	Image    string `json:"image"`
	Bio      string `json:"bio"`
}

func (u *ThreadUser) TableName() string {
	return "users"
}
