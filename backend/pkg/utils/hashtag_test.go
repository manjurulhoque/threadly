package utils

import (
	"reflect"
	"testing"
)

func TestExtractHashtags(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected []string
	}{
		{
			name:     "no hashtags",
			input:    "hello world",
			expected: nil,
		},
		{
			name:     "single hashtag",
			input:    "hello #world",
			expected: []string{"world"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ExtractHashtags(tt.input)

			if !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("ExtractHashtags() = %v, want %v", result, tt.expected)
			}
		})
	}
}
