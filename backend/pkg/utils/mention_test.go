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

func TestFormatThreadContent(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "no mentions or hashtags",
			input:    "hello world",
			expected: "hello world",
		},
		{
			name:     "single mention",
			input:    "hello @[user1](1)",
			expected: `hello <a href="/profile/1" class="mention" target='_blank'>@user1</a>`,
		},
		{
			name:     "multiple mentions and hashtags",
			input:    "hello @[user1](1) and #hashtag1 and @[user2](2)",
			expected: `hello <a href="/profile/1" class="mention" target='_blank'>@user1</a> and <a href="/hashtag/hashtag1" class="hashtag" target='_blank'>#hashtag1</a> and <a href="/profile/2" class="mention" target='_blank'>@user2</a>`,
		},
		{
			name:     "mention with special characters",
			input:    "hello @[user_1](1) and #hashtag_1",
			expected: `hello <a href="/profile/1" class="mention" target='_blank'>@user_1</a> and <a href="/hashtag/hashtag_1" class="hashtag" target='_blank'>#hashtag_1</a>`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := FormatThreadContent(tt.input)

			if result != tt.expected {
				t.Errorf("FormatThreadContent() = %v, want %v", result, tt.expected)
			}
		})
	}
}
