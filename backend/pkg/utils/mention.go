package utils

import (
	"fmt"
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

// FormatThreadContent parses thread content and replaces mentions with clickable links
func FormatThreadContent(content string) string {
	re := regexp.MustCompile(`@\[(\w+)\]\((\d+)\)`) // Match @[username](id)

	// Replace mentions with clickable links
	formattedContent := re.ReplaceAllStringFunc(content, func(match string) string {
		subMatches := re.FindStringSubmatch(match)
		if len(subMatches) < 3 {
			return match // Return the original match if parsing fails
		}
		username := subMatches[1] // Extract username
		userID := subMatches[2]   // Extract user ID
		return fmt.Sprintf(`<a href="/profile/%s" class="mention" target='_blank'>@%s</a>`, userID, username)
	})

	return formattedContent
}
