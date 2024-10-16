# ==============================================================================
# Makefile for Auth App Frontend (Vite)
# ==============================================================================

# ==============================================================================
# Variables
# ==============================================================================

# General
REPO_NAME ?= auth_app
IMAGE_TAG ?= $(shell git rev-parse --short HEAD)

# Docker
DOCKER_COMPOSE = docker-compose -f ../devops_admin/docker-compose.yml

# Terraform
ENV ?= staging
BACKEND_DIR ?= ./tf
AWS_REGION ?= us-east-1
AWS_ACCOUNT_ID ?= $(AWS_ACCOUNT_ID)
ECR_REPO := $(REPO_NAME)_$(ENV)

# ==============================================================================
# Phony Targets
# ==============================================================================
.PHONY: help install dev build-staging build-production lint lint-fix format test up down build-docker reinstall clean init plan apply destroy ecr-login push

# ==============================================================================
# Help Target
# ==============================================================================
help:
	@echo "Available Make Commands:"
	@echo "  make clean                   Clean up Docker containers, images, and volumes"
	@echo "  make init ENV=dev|prod       Initialize Terraform"
	@echo "  make plan ENV=dev|prod       Run Terraform plan"
	@echo "  make apply ENV=dev|prod      Apply Terraform changes"
	@echo "  make destroy ENV=dev|prod    Destroy Terraform-managed infrastructure"
	@echo "  make install                 Install Node.js dependencies"
	@echo "  make dev                     Run development server"
	@echo "  make build-staging           Build the application for staging"
	@echo "  make build-production        Build the application for production"
	@echo "  make lint                    Lint the code"
	@echo "  make lint-fix                Fix linting issues"
	@echo "  make format                  Format the code"
	@echo "  make test                    Run tests"
	@echo "  make up                      Bring up all Docker services"
	@echo "  make down                    Bring down all Docker services"
	@echo "  make build-docker            Build Docker images"
	@echo "  make docker:build            Build Docker images (alias)"
	@echo "  make docker:run              Run Docker container"
	@echo "  make ecr-login               Authenticate Docker with AWS ECR"
	@echo "  make push                    Push Docker images to ECR"
	@echo "  make reinstall               Clean and reinstall dependencies"

# ==============================================================================
# Node.js Targets
# ==============================================================================
install:
	yarn install

dev:
	yarn dev

build-staging:
	yarn build:staging

build-production:
	yarn build:production

lint:
	yarn lint

lint-fix:
	yarn lint:fix

format:
	yarn format

test:
	yarn test

# ==============================================================================
# Docker Targets
# ==============================================================================
up:
	$(DOCKER_COMPOSE) up --build

down:
	$(DOCKER_COMPOSE) down

build-docker:
	docker build -t $(ECR_REPO):$(IMAGE_TAG) -f Dockerfile.$(ENV) .

# ==============================================================================
# Reinstall Dependencies
# ==============================================================================
reinstall:
	rm -rf node_modules
	npm install --ci

# ==============================================================================
# Clean Targets
# ==============================================================================
clean:
	@echo "Cleaning up Docker containers, images, and volumes..."
	$(DOCKER_COMPOSE) down --rmi all -v --remove-orphans
	@echo "Removing node_modules and build directories..."
	rm -rf node_modules .vite dist coverage
	@echo "Cleanup completed."

# ==============================================================================
# Terraform Targets
# ==============================================================================
init:
	@echo "Initializing Terraform for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform init -var env=$(ENV) -backend-config=backend-$(ENV).tfbackend

plan:
	@echo "Generating Terraform plan for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform plan -out=tfplan -var env=$(ENV) -var image_tag=$(IMAGE_TAG)

apply:
	@echo "Applying Terraform configuration for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform apply tfplan

destroy:
	@echo "Destroying Terraform-managed infrastructure for $(ENV) environment..."
	cd $(BACKEND_DIR) && terraform destroy -var env=$(ENV)

# ==============================================================================
# AWS ECR Targets
# ==============================================================================
ecr-login:
	@echo "Logging into Amazon ECR..."
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

push:
	@echo "Tagging Docker image..."
	docker tag $(ECR_REPO):$(IMAGE_TAG) $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPO):$(IMAGE_TAG)
	@echo "Pushing Docker image to ECR..."
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPO):$(IMAGE_TAG)
