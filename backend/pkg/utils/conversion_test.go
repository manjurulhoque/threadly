package utils

import (
	"reflect"
	"testing"
)

func TestStringToUint(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected uint
	}{
		{
			name:     "valid uint",
			input:    "123",
			expected: 123,
		},
		{
			name:     "invalid uint",
			input:    "abc",
			expected: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := StringToUint(tt.input)

			if !reflect.DeepEqual(result, tt.expected) {
				t.Errorf("StringToUint() = %v, want %v", result, tt.expected)
			}
		})
	}
}
