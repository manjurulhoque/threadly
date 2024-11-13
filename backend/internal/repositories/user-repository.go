package repositories

import (
	"github.com/manjurulhoque/threadly/backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *models.User) error
	GetUserById(id uint) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	FindUserByEmail(email string) bool
	UpdateUser(uint, map[string]interface{}) error
	GetSimilarMinds(userId uint) ([]models.PublicUser, error)
	IsFollowing(followeeId, followerId uint) (bool, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db}
}

func (r *userRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetUserById(id uint) (*models.User, error) {
	var user models.User
	err := r.db.Where("id = ?", id).First(&user).Error
	return &user, err
}

func (r *userRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *userRepository) FindUserByEmail(email string) bool {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return err == nil
}

func (r *userRepository) UpdateUser(userId uint, updates map[string]interface{}) error {
	return r.db.Model(&models.User{}).Where("id = ?", userId).Updates(updates).Error
}

// GetSimilarMinds retrieves random users whom the user hasn't followed
func (r *userRepository) GetSimilarMinds(userId uint) ([]models.PublicUser, error) {
	var users []models.PublicUser
	err := r.db.Raw(`
		SELECT id, name, username, image, bio, onboarded
		FROM users
		WHERE id != ? 
		  AND id NOT IN (
		      SELECT followee_id 
		      FROM follows 
		      WHERE follower_id = ?
		  )
		ORDER BY RANDOM()
		LIMIT 5
	`, userId, userId).Scan(&users).Error
	return users, err
}

// IsFollowing checks if the user is following another user
func (r *userRepository) IsFollowing(followeeId, followerId uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Follow{}).Where("followee_id = ? AND follower_id = ?", followeeId, followerId).Count(&count).Error
	return count > 0, err
}
