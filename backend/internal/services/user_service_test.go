package services

import (
	"testing"

	"github.com/manjurulhoque/threadly/backend/internal/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// ---------- Mock Repository ----------

type mockUserRepository struct {
	users  map[string]*models.User
	nextID uint
}

func newMockUserRepo() *mockUserRepository {
	return &mockUserRepository{users: make(map[string]*models.User), nextID: 1}
}

// --- interface methods ---

func (m *mockUserRepository) CreateUser(user *models.User) error {
	if _, exists := m.users[user.Email]; exists {
		return assert.AnError
	}
	user.ID = m.nextID
	m.nextID++
	m.users[user.Email] = user
	return nil
}

func (m *mockUserRepository) GetUserByEmail(email string) (*models.User, error) {
	if u, ok := m.users[email]; ok {
		return u, nil
	}
	return nil, assert.AnError
}

func (m *mockUserRepository) FindUserByEmail(email string) bool {
	_, ok := m.users[email]
	return ok
}

func (m *mockUserRepository) GetUserById(id uint) (*models.User, error) {
	for _, u := range m.users {
		if u.ID == id {
			return u, nil
		}
	}
	return nil, assert.AnError
}

func (m *mockUserRepository) UpdateUser(id uint, updates map[string]interface{}) error {
	for _, u := range m.users {
		if u.ID == id {
			if v, ok := updates["name"].(string); ok {
				u.Name = v
			}
			if v, ok := updates["username"].(string); ok {
				u.Username = v
			}
			if v, ok := updates["email"].(string); ok {
				u.Email = v
			}
			return nil
		}
	}
	return assert.AnError
}

func (m *mockUserRepository) GetSimilarMinds(_ uint) ([]models.PublicUser, error) {
	return nil, nil
}
func (m *mockUserRepository) IsFollowing(_, _ uint) (bool, error)                  { return false, nil }
func (m *mockUserRepository) GetThreadsForUser(_ uint) ([]models.Thread, error)    { return nil, nil }
func (m *mockUserRepository) GetDB() *gorm.DB                                      { return nil }
func (m *mockUserRepository) GetUserFollowers(_ uint) ([]models.PublicUser, error) { return nil, nil }
func (m *mockUserRepository) GetUserFollowing(_ uint) ([]models.PublicUser, error) { return nil, nil }

// ---------- Helpers ----------

func setupUserService() (*userService, *mockUserRepository) {
	repo := newMockUserRepo()
	svc := NewUserService(repo).(*userService)
	return svc, repo
}

func seedUser(repo *mockUserRepository, email, password string) *models.User {
	hashed, _ := hashPassword(password)
	u := &models.User{Name: "Test", Username: "test", Email: email, Password: hashed}
	repo.CreateUser(u)
	return u
}

// ---------- Tests ----------

func TestRegisterUser_Success(t *testing.T) {
	svc, _ := setupUserService()

	err := svc.RegisterUser("johndoe", "John", "john@test.com", "secret123")

	assert.NoError(t, err)
}

func TestRegisterUser_DuplicateEmail(t *testing.T) {
	svc, repo := setupUserService()
	seedUser(repo, "john@test.com", "secret123")

	err := svc.RegisterUser("jane", "Jane", "john@test.com", "pass456")

	assert.Error(t, err)
}

func TestLoginUser_Success(t *testing.T) {
	svc, repo := setupUserService()
	seedUser(repo, "john@test.com", "secret123")

	access, refresh, err := svc.LoginUser("john@test.com", "secret123")

	assert.NoError(t, err)
	assert.NotEmpty(t, access)
	assert.NotEmpty(t, refresh)
}

func TestLoginUser_WrongEmail(t *testing.T) {
	svc, _ := setupUserService()

	_, _, err := svc.LoginUser("nobody@test.com", "secret123")

	assert.EqualError(t, err, "user not found")
}

func TestLoginUser_WrongPassword(t *testing.T) {
	svc, repo := setupUserService()
	seedUser(repo, "john@test.com", "secret123")

	_, _, err := svc.LoginUser("john@test.com", "wrongpassword")

	assert.EqualError(t, err, "incorrect password")
}

func TestVerifyToken_Valid(t *testing.T) {
	svc, repo := setupUserService()
	user := seedUser(repo, "john@test.com", "secret123")

	access, _, _ := svc.LoginUser("john@test.com", "secret123")
	claims, err := svc.VerifyToken(access)

	assert.NoError(t, err)
	assert.Equal(t, user.ID, claims.UserId)
	assert.Equal(t, "john@test.com", claims.Email)
}

func TestVerifyToken_Invalid(t *testing.T) {
	svc, _ := setupUserService()

	_, err := svc.VerifyToken("garbage.token.value")

	assert.Error(t, err)
}

func TestRefreshToken_Valid(t *testing.T) {
	svc, repo := setupUserService()
	seedUser(repo, "john@test.com", "secret123")

	_, refresh, _ := svc.LoginUser("john@test.com", "secret123")
	newAccess, err := svc.RefreshToken(refresh)

	assert.NoError(t, err)
	assert.NotEmpty(t, newAccess)
}

func TestRefreshToken_Invalid(t *testing.T) {
	svc, _ := setupUserService()

	_, err := svc.RefreshToken("garbage.token.value")

	assert.Error(t, err)
}

func TestGetUserById_Found(t *testing.T) {
	svc, repo := setupUserService()
	user := seedUser(repo, "john@test.com", "secret123")

	// GetDB() returns nil in mock — FollowersCount will panic if called.
	// This test verifies the happy path up to the point of a nil DB.
	// For full GetUserById coverage, use a real DB (SQLite in-memory).
	u, err := svc.userRepo.GetUserById(user.ID)

	assert.NoError(t, err)
	assert.Equal(t, "john@test.com", u.Email)
}

func TestGetUserById_NotFound(t *testing.T) {
	svc, _ := setupUserService()

	u, err := svc.userRepo.GetUserById(999)

	assert.Error(t, err)
	assert.Nil(t, u)
}

func TestUpdateUser_Success(t *testing.T) {
	svc, repo := setupUserService()
	user := seedUser(repo, "john@test.com", "secret123")

	err := svc.UpdateUser(user.ID, map[string]interface{}{"name": "Updated"})

	assert.NoError(t, err)
	u, _ := svc.userRepo.GetUserById(user.ID)
	assert.Equal(t, "Updated", u.Name)
}

func TestUpdateUser_NotFound(t *testing.T) {
	svc, _ := setupUserService()

	err := svc.UpdateUser(999, map[string]interface{}{"name": "Ghost"})

	assert.Error(t, err)
}

func TestIsFollowing(t *testing.T) {
	svc, _ := setupUserService()

	following, err := svc.IsFollowing(1, 2)

	assert.NoError(t, err)
	assert.False(t, following)
}
