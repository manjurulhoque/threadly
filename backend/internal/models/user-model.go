package models

import "gorm.io/gorm"

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

// FollowersCount Get the number of followers for a user
func (u *User) FollowersCount(db *gorm.DB) int64 {
	var count int64
	db.Model(&Follow{}).Where("followee_id = ?", u.ID).Count(&count)
	return count
}

// FollowingCount Get the number of users a user is following
func (u *User) FollowingCount(db *gorm.DB) int64 {
	var count int64
	db.Model(&Follow{}).Where("follower_id = ?", u.ID).Count(&count)
	return count
}

type PublicUser struct {
	Id             uint   `json:"id"`
	Name           string `json:"name"`
	Username       string `json:"username"`
	Image          string `json:"image"`
	Bio            string `json:"bio"`
	Onboarded      bool   `json:"onboarded"`
	FollowersCount int64  `json:"followers_count,omitempty"`
	FollowingCount int64  `json:"following_count,omitempty"`
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
