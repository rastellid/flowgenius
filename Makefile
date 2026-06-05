.DEFAULT_GOAL := help
.SILENT:

## Colors
COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

PLATFORM_ROOT=/srv
PLATFORM_RUNTIME_ROOT=${PLATFORM_ROOT}

args = $(filter-out $@,$(MAKECMDGOALS))
PHP_SERVICE=app

## Help
help:
	printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	printf " make [target]\n\n"
	printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	awk '/^[a-zA-Z\-\_0-9\.@]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			commands[NR] = helpCommand; \
			messages[NR] = helpMessage; \
			if (length(helpCommand) > maxLen) maxLen = length(helpCommand); \
		} \
	} \
	{ lastLine = $$0 } \
	END { \
		for (i in commands) { \
			printf " ${COLOR_INFO}%-*s${COLOR_RESET} %s\n", maxLen + 2, commands[i], messages[i]; \
		} \
	}' $(MAKEFILE_LIST)

## Start project
up:
	docker compose up -d

## login to php container
php-shell:
	docker compose exec -it -e XDEBUG_MODE=off ${PHP_SERVICE} bash
