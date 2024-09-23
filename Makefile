# Makefile for auth_app

TF_DIR = tf
BACKEND_DIR = $(TF_DIR)

# Default environment
ENV ?= staging

# Default target
.PHONY: help
help:
	@echo "  make clean                   Clean up Docker containers and images"
	@echo "  make init ENV=dev|prod       Initialize Terraform"
	@echo "  make plan ENV=dev|prod       Run Terraform plan"
	@echo "  make apply ENV=dev|prod      Apply Terraform changes"
	@echo "  make destroy ENV=dev|prod    Destroy Terraform-managed infrastructure"
	@echo "  make install                 Install Node.js dependencies"
	@echo "  make dev                     Run development server"
	@echo "  make build                   Build the application"
	@echo "  make lint                    Lint the code"
	@echo "  make lint-fix                Fix linting issues"
	@echo "  make format                  Format the code"
	@echo "  make test                    Run tests"
	@echo "  make up                      Bring up all Docker services"
	@echo "  make down                    Bring down all Docker services"
	@echo "  make auth_api                Bring up auth_api service"
	@echo "  make auth_service            Bring up auth_service service"
	@echo "  make auth_app                Bring up auth_app service"
	@echo "  make reinstall               Clean and reinstall dependencies"

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

.PHONY: up down build auth_api auth_service auth_app init plan apply destroy

# Docker commands
up:
	docker-compose -f ../devops_admin/docker-compose.yml up --build

down:
	docker-compose -f ../devops_admin/docker-compose.yml down

build:
	docker-compose -f ../devops_admin/docker-compose.yml build

auth_api:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_api

auth_service:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_service

auth_app:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_app

# Reinstall dependencies
reinstall: clean install

# Terraform Targets
.PHONY: init plan apply destroy

init:
	@echo "Initializing Terraform for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform init -backend-config=backend-$(ENV).tfbackend

plan:
	@echo "Running Terraform plan for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform plan -var env=$(ENV)

apply:
	@echo "Applying Terraform changes for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform apply -var env=$(ENV)

destroy:
	@echo "Destroying Terraform-managed infrastructure for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform destroy -var env=$(ENV)
