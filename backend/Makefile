.PHONY: help install test lint format check migrations migrate shell clean docker-build docker-run

# Default target
help:
	@echo "Available commands:"
	@echo "  install      Install all dependencies"
	@echo "  test         Run tests with coverage"
	@echo "  lint         Run linting checks (flake8)"
	@echo "  format       Format code with black and isort"
	@echo "  check        Run all checks (lint + format check)"
	@echo "  migrations   Create new migrations"
	@echo "  migrate      Apply migrations"
	@echo "  shell        Open Django shell"
	@echo "  clean        Clean cache and temporary files"
	@echo "  docker-build Build Docker image"
	@echo "  docker-run   Run with Docker Compose"

# Install dependencies
install:
	python -m pip install --upgrade pip
	pip install -r requirements/dev.txt

# Run tests with coverage
test:
	python -m pytest --cov=apps --cov=config --cov-report=xml --cov-report=term-missing -v

# Run linting
lint:
	flake8 .
	black --check .
	isort --check-only .

# Format code
format:
	black .
	isort .

# Run all checks
check: lint test

# Create migrations
migrations:
	python manage.py makemigrations

# Apply migrations
migrate:
	python manage.py migrate

# Open Django shell
shell:
	python manage.py shell

# Clean cache and temporary files
clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type f -name ".coverage" -delete
	rm -rf htmlcov/
	rm -rf .pytest_cache/
	rm -rf coverage.xml

# Docker commands
docker-build:
	docker build -t edupropyth-backend .

docker-run:
	cd .. && docker-compose up -d

# Quick development setup
dev-setup: install migrate
	@echo "Development environment ready!"

# Run development server
runserver:
	python manage.py runserver

# Create superuser
superuser:
	python manage.py createsuperuser

# Collect static files
collectstatic:
	python manage.py collectstatic --noinput

# Database reset (for development only)
reset-db:
	python manage.py flush --noinput
	python manage.py migrate

# Run security checks
security:
	safety check -r requirements/base.txt
	bandit -r apps/ config/
