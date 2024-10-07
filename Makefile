# Makefile for auth_app


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

build-dev:
	npm run build

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

test:
	npm run test

.PHONY: up down build auth_api auth_service auth_app

# Docker commands
up:
	docker-compose -f ../devops_admin/docker-compose.yml up --build

down:
	docker-compose -f ../devops_admin/docker-compose.yml down

build-docker:
	docker-compose -f ../devops_admin/docker-compose.yml build

auth_api:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_api

auth_service:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_service

auth_app:
	docker-compose -f ../devops_admin/docker-compose.yml up --build auth_app

# Reinstall dependencies
reinstall: clean install

# Makefile

# Variables
ENV ?= staging
BACKEND_DIR ?= ./tf
AWS_REGION ?= us-east-1
IMAGE_TAG ?= $(shell git rev-parse --short HEAD)
AWS_ACCOUNT_ID ?= $(AWS_ACCOUNT_ID)
REPO_NAME ?= auth_app
ECR_REPO := $(REPO_NAME)_$(ENV)

.PHONY: init plan apply build push ecr-login

# Initialize Terraform
init:
	@echo "Initializing Terraform for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform init -var env=$(ENV) -backend-config=backend-$(ENV).tfbackend

# Generate Terraform Plan
plan:
	@echo "Generating Terraform plan for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform plan -out=tfplan -var env=$(ENV) -var image_tag=$(IMAGE_TAG)

# Build Docker Image
build:
	@echo "Building Docker image $(ECR_REPO):$(IMAGE_TAG)..."
	docker build -t $(ECR_REPO):$(IMAGE_TAG) -f Dockerfile.$(ENV) .

# Authenticate Docker to Amazon ECR
ecr-login:
	@echo "Logging into Amazon ECR..."
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

# Push Docker Image to ECR
push: ecr-login build
	@echo "Tagging Docker image..."
	docker tag $(ECR_REPO):$(IMAGE_TAG) $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPO):$(IMAGE_TAG)
	@echo "Pushing Docker image to ECR..."
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPO):$(IMAGE_TAG)
