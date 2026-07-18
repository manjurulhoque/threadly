package models

type Follow struct {
	BaseModel
	FollowerID uint `json:"follower_id" gorm:"not null"` // The user who follows
	FolloweeID uint `json:"followee_id" gorm:"not null"` // The user being followed

	// Constraints
	Follower User `json:"follower" gorm:"foreignKey:FollowerID;constraint:OnDelete:CASCADE"`
	Followee User `json:"followee" gorm:"foreignKey:FolloweeID;constraint:OnDelete:CASCADE"`
}

func (f *Follow) TableName() string {
	return "follows"
}
