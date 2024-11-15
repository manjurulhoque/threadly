package utils

import (
	"regexp"
)

// ExtractMentions extracts the usernames mentioned in the content
func ExtractMentions(content string) []string {
	re := regexp.MustCompile(`@\[(\w+)\]\(\d+\)`) // Matches @[username](id)

	matches := re.FindAllStringSubmatch(content, -1)

	var usernames []string
	for _, match := range matches {
		if len(match) > 1 {
			usernames = append(usernames, match[1]) // Extract the username
		}
	}
	return usernames
}
