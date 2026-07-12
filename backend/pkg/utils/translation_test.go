package utils

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

// --- Test structs (no emailExists to avoid needing userRepo) ---

type requiredInput struct {
	Name  string `validate:"required"`
	Email string `validate:"required"`
}

type integerInput struct {
	Age string `validate:"required,integer"`
}

type mixedInput struct {
	Name string `validate:"required"`
	Age  string `validate:"required,integer"`
}

type noValidateTags struct {
	Nickname string
}

// --- Tests ---

func TestTranslateError_AllRequiredFieldsEmpty(t *testing.T) {
	input := requiredInput{Name: "", Email: ""}
	errs := TranslateError(input)

	assert.Len(t, errs, 2)

	fields := []string{errs[0].Field, errs[1].Field}
	assert.Contains(t, fields, "name")
	assert.Contains(t, fields, "email")

	for _, e := range errs {
		assert.True(t, strings.HasSuffix(e.Message, "is required"))
	}
}

func TestTranslateError_SingleRequiredFieldEmpty(t *testing.T) {
	input := requiredInput{Name: "John", Email: ""}
	errs := TranslateError(input)

	assert.Len(t, errs, 1)
	assert.Equal(t, "email", errs[0].Field)
	assert.Equal(t, "Email is required", errs[0].Message)
}

func TestTranslateError_AllRequiredFieldsProvided(t *testing.T) {
	input := requiredInput{Name: "John", Email: "john@test.com"}
	errs := TranslateError(input)

	assert.Nil(t, errs)
}

func TestTranslateError_IntegerValid(t *testing.T) {
	input := integerInput{Age: "25"}
	errs := TranslateError(input)

	assert.Nil(t, errs)
}

func TestTranslateError_IntegerEmpty(t *testing.T) {
	// required triggers first on empty string, integer is not reached
	input := integerInput{Age: ""}
	errs := TranslateError(input)

	assert.Len(t, errs, 1)
	assert.Equal(t, "age", errs[0].Field)
	assert.True(t, strings.Contains(errs[0].Message, "is required"))
}

func TestTranslateError_MixedValidInput(t *testing.T) {
	input := mixedInput{Name: "Alice", Age: "30"}
	errs := TranslateError(input)

	assert.Nil(t, errs)
}

func TestTranslateError_MixedEmptyRequired(t *testing.T) {
	input := mixedInput{Name: "", Age: ""}
	errs := TranslateError(input)

	// Both fields are empty, so "required" fires on both
	assert.Len(t, errs, 2)
	fields := []string{errs[0].Field, errs[1].Field}
	assert.Contains(t, fields, "name")
	assert.Contains(t, fields, "age")
}

func TestTranslateError_NoValidationTags(t *testing.T) {
	input := noValidateTags{Nickname: ""}
	errs := TranslateError(input)

	assert.Nil(t, errs)
}

func TestTranslateError_FieldNamesAreLowercase(t *testing.T) {
	input := requiredInput{Name: "", Email: ""}
	errs := TranslateError(input)

	for _, e := range errs {
		assert.Equal(t, strings.ToLower(e.Field), e.Field)
	}
}
