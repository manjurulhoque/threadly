package utils

import (
	"reflect"
	"testing"
)

func TestExtractMentions(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected []string
	}{
		{
			name:     "no mentions",
			input:    "hello world",
			expected: nil,
		},
		{
			name:     "single mention",
			input:    "hello @[user1](1)",
			expected: []string{"user1"},
		},
		{
			name:     "multiple mentions",
			input:    "hello @[user1](1) and @[user2](2)",
			expected: []string{"user1", "user2"},
		},
		{
			name:     "mention with special characters",
			input:    "hello @[user_1](1) and @[user_2](2)",
			expected: []string{"user_1", "user_2"},
		},
		{
			name:     "mention with numbers",
			input:    "hello @[user123](1)",
			expected: []string{"user123"},
		},
		{
			name:     "mention with mixed case",
			input:    "hello @[UserName](1)",
			expected: []string{"UserName"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ExtractMentions(tt.input)

			if !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("ExtractMentions() = %v, want %v", result, tt.expected)
			}
		})
	}
}
