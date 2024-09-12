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

# Clean up node_modules and dist
clean:
	rm -rf node_modules dist

.PHONY: up down build auth_api auth_service auth_app

# Bring up all services
up:
	docker-compose -f ../devops_admin/docker-compose.yml up --build

# Bring down all services
down:
	docker-compose -f ../devops_admin/docker-compose.yml down

# Build all services
build:
	docker-compose -f ../devops_admin/docker-compose.yml build

# Bring up auth_api service
auth_api:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_api

# Bring up auth_service service
auth_service:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_service

# Bring up auth_app service
auth_app:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_app

# Reinstall dependencies
reinstall: clean install
