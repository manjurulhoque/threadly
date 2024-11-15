package utils

import "regexp"

func ExtractMentions(content string) []string {
	re := regexp.MustCompile(`@(\w+)`)
	matches := re.FindAllStringSubmatch(content, -1)

	var usernames []string
	for _, match := range matches {
		if len(match) > 1 {
			usernames = append(usernames, match[1])
		}
	}
	return usernames
}
