# Makefile for auth_app

# Node.js commands
install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

test:
	npm run test

# Docker commands
docker-build:
	npm run docker:build

docker-run:
	npm run docker:run

# Clean up node_modules and dist
clean:
	rm -rf node_modules dist

# Reinstall dependencies
reinstall: clean install
