#!/bin/bash

# EduProPyth Local Testing Script
# This script runs all tests locally with proper environment setup

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "docker-compose.yml" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "This script must be run from the project root directory"
        exit 1
    fi
}

# Setup test database
setup_test_db() {
    print_status "Setting up test database..."

    cd backend
    source venv/bin/activate

    # Set testing environment
    export DJANGO_SETTINGS_MODULE=config.settings.develop
    export DEBUG=True
    export SECRET_KEY=test-secret-key-for-local-testing
    export DB_NAME=edupropyth_test
    export DB_USER=postgres
    export DB_PASSWORD=postgres
    export DB_HOST=localhost
    export DB_PORT=5432

    # OAuth fake values
    export GOOGLE_CLIENT_ID=fake-google-client-id-for-testing
    export GOOGLE_CLIENT_SECRET=fake-google-secret-for-testing
    export GITHUB_CLIENT_ID=fake-github-client-id-for-testing
    export GITHUB_CLIENT_SECRET=fake-github-secret-for-testing
    export MICROSOFT_CLIENT_ID=fake-microsoft-client-id-for-testing
    export MICROSOFT_CLIENT_SECRET=fake-microsoft-secret-for-testing

    # Run migrations for test database
    python manage.py migrate --run-syncdb

    deactivate
    cd ..
}

# Run backend tests
test_backend() {
    print_status "Running backend tests..."

    cd backend
    source venv/bin/activate

    # Set environment variables
    export DJANGO_SETTINGS_MODULE=config.settings.develop
    export DEBUG=True
    export SECRET_KEY=test-secret-key-for-local-testing
    export DB_NAME=edupropyth_test
    export DB_USER=postgres
    export DB_PASSWORD=postgres
    export DB_HOST=localhost
    export DB_PORT=5432

    # OAuth fake values
    export GOOGLE_CLIENT_ID=fake-google-client-id-for-testing
    export GOOGLE_CLIENT_SECRET=fake-google-secret-for-testing
    export GITHUB_CLIENT_ID=fake-github-client-id-for-testing
    export GITHUB_CLIENT_SECRET=fake-github-secret-for-testing
    export MICROSOFT_CLIENT_ID=fake-microsoft-client-id-for-testing
    export MICROSOFT_CLIENT_SECRET=fake-microsoft-secret-for-testing

    # Run quality checks first
    print_status "Running backend quality checks..."
    flake8 . || { print_error "flake8 failed"; return 1; }
    black --check . || { print_warning "Code formatting issues found"; }
    isort --check-only . || { print_warning "Import sorting issues found"; }

    # Run security checks
    print_status "Running security checks..."
    safety check -r requirements/base.txt || print_warning "Safety check completed with warnings"
    bandit -r apps/ config/ -f json -o bandit-report.json || print_warning "Bandit scan completed with warnings"

    # Run tests with coverage
    print_status "Running pytest with coverage..."
    pytest --cov=apps --cov=config --cov-report=html --cov-report=term-missing --cov-report=xml

    local test_result=$?

    if [ $test_result -eq 0 ]; then
        print_success "Backend tests passed!"
    else
        print_error "Backend tests failed!"
        return 1
    fi

    deactivate
    cd ..
    return $test_result
}

# Run frontend tests
test_frontend() {
    print_status "Running frontend tests..."

    cd frontend

    # Run quality checks first
    print_status "Running frontend quality checks..."
    npm run lint || { print_error "ESLint failed"; return 1; }
    npm run type-check || { print_error "TypeScript check failed"; return 1; }

    # Run tests with coverage
    print_status "Running frontend tests with coverage..."
    npm run test:coverage

    local test_result=$?

    if [ $test_result -eq 0 ]; then
        print_success "Frontend tests passed!"
    else
        print_error "Frontend tests failed!"
        return 1
    fi

    cd ..
    return $test_result
}

# Run integration tests (if they exist)
test_integration() {
    print_status "Checking for integration tests..."

    if [ -d "tests/integration" ]; then
        print_status "Running integration tests..."
        # Add integration test commands here when implemented
        print_warning "Integration tests not yet implemented"
    else
        print_warning "No integration tests found"
    fi
}

# Generate test reports
generate_reports() {
    print_status "Generating test reports..."

    # Backend coverage report
    if [ -f "backend/htmlcov/index.html" ]; then
        print_success "Backend coverage report: backend/htmlcov/index.html"
    fi

    if [ -f "backend/coverage.xml" ]; then
        print_success "Backend coverage XML: backend/coverage.xml"
    fi

    # Frontend coverage report
    if [ -d "frontend/coverage" ]; then
        print_success "Frontend coverage report: frontend/coverage/index.html"
    fi

    # Security reports
    if [ -f "backend/bandit-report.json" ]; then
        print_success "Security report: backend/bandit-report.json"
    fi
}

# Clean up test artifacts
cleanup() {
    print_status "Cleaning up test artifacts..."

    # Backend cleanup
    cd backend
    find . -name "*.pyc" -delete
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    cd ..

    # Frontend cleanup (if needed)
    cd frontend
    # Add frontend cleanup commands here
    cd ..
}

# Main execution
main() {
    echo -e "${GREEN}EduProPyth Local Test Runner${NC}"
    echo "============================="
    echo

    check_directory

    # Parse command line arguments
    SKIP_SETUP=false
    BACKEND_ONLY=false
    FRONTEND_ONLY=false
    SKIP_QUALITY=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-setup)
                SKIP_SETUP=true
                shift
                ;;
            --backend-only)
                BACKEND_ONLY=true
                shift
                ;;
            --frontend-only)
                FRONTEND_ONLY=true
                shift
                ;;
            --skip-quality)
                SKIP_QUALITY=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-setup    Skip database setup"
                echo "  --backend-only  Run only backend tests"
                echo "  --frontend-only Run only frontend tests"
                echo "  --skip-quality  Skip quality checks"
                echo "  --help, -h      Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done

    # Setup test environment
    if [ "$SKIP_SETUP" = false ]; then
        setup_test_db
    fi

    # Run tests
    local backend_result=0
    local frontend_result=0

    if [ "$FRONTEND_ONLY" = false ]; then
        test_backend
        backend_result=$?
    fi

    if [ "$BACKEND_ONLY" = false ]; then
        test_frontend
        frontend_result=$?
    fi

    # Run integration tests
    test_integration

    # Generate reports
    generate_reports

    # Clean up
    cleanup

    # Final results
    echo
    echo -e "${BLUE}Test Results Summary:${NC}"
    echo "===================="

    if [ "$FRONTEND_ONLY" = false ]; then
        if [ $backend_result -eq 0 ]; then
            echo -e "Backend:  ${GREEN}✓ PASSED${NC}"
        else
            echo -e "Backend:  ${RED}✗ FAILED${NC}"
        fi
    fi

    if [ "$BACKEND_ONLY" = false ]; then
        if [ $frontend_result -eq 0 ]; then
            echo -e "Frontend: ${GREEN}✓ PASSED${NC}"
        else
            echo -e "Frontend: ${RED}✗ FAILED${NC}"
        fi
    fi

    # Overall result
    local overall_result=$((backend_result + frontend_result))

    if [ $overall_result -eq 0 ]; then
        print_success "All tests passed! 🎉"
        exit 0
    else
        print_error "Some tests failed! 😞"
        exit 1
    fi
}

# Run main function with all arguments
main "$@"
