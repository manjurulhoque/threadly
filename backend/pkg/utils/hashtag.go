package utils

import (
	"regexp"
)

// ExtractHashtags extracts the hashtags from the content
func ExtractHashtags(content string) []string {
	re := regexp.MustCompile(`#(\w+)`) // Matches #hashtag

	matches := re.FindAllStringSubmatch(content, -1)

	var hashtags []string
	for _, match := range matches {
		if len(match) > 1 {
			hashtags = append(hashtags, match[1]) // Extract the hashtag
		}
	}
	return hashtags
}
