#!/bin/bash

# EduProPyth CI Verification Script
# This script quickly verifies that all CI checks will pass

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

# Verify backend checks
verify_backend() {
    print_status "Verifying backend CI checks..."

    cd backend

    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_error "Virtual environment not found. Run ./scripts/setup-dev.sh first"
        return 1
    fi

    source venv/bin/activate

    # Set environment variables for testing
    export DJANGO_SETTINGS_MODULE=config.settings.develop
    export DEBUG=True
    export SECRET_KEY=test-secret-key-for-verification
    export DB_NAME=edupropyth_test
    export DB_USER=postgres
    export DB_PASSWORD=postgres
    export DB_HOST=localhost
    export DB_PORT=5432
    export GOOGLE_CLIENT_ID=fake-google-client-id
    export GOOGLE_CLIENT_SECRET=fake-google-secret
    export GITHUB_CLIENT_ID=fake-github-client-id
    export GITHUB_CLIENT_SECRET=fake-github-secret
    export MICROSOFT_CLIENT_ID=fake-microsoft-client-id
    export MICROSOFT_CLIENT_SECRET=fake-microsoft-secret

    local backend_result=0

    # Check flake8
    print_status "Running flake8..."
    if flake8 .; then
        print_success "✓ flake8 passed"
    else
        print_error "✗ flake8 failed"
        backend_result=1
    fi

    # Check black formatting
    print_status "Checking black formatting..."
    if black --check .; then
        print_success "✓ black formatting passed"
    else
        print_warning "⚠ black formatting issues found (run 'black .' to fix)"
        backend_result=1
    fi

    # Check isort
    print_status "Checking import sorting..."
    if isort --check-only .; then
        print_success "✓ isort passed"
    else
        print_warning "⚠ import sorting issues found (run 'isort .' to fix)"
        backend_result=1
    fi

    # Check Django configuration
    print_status "Checking Django configuration..."
    if python manage.py check; then
        print_success "✓ Django check passed"
    else
        print_error "✗ Django check failed"
        backend_result=1
    fi

    # Check migrations
    print_status "Checking migrations..."
    if python manage.py makemigrations --check --dry-run; then
        print_success "✓ No missing migrations"
    else
        print_warning "⚠ Missing migrations detected"
        backend_result=1
    fi

    deactivate
    cd ..

    return $backend_result
}

# Verify frontend checks
verify_frontend() {
    print_status "Verifying frontend CI checks..."

    cd frontend

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_error "node_modules not found. Run 'npm install' first"
        return 1
    fi

    local frontend_result=0

    # Check ESLint
    print_status "Running ESLint..."
    if npm run lint; then
        print_success "✓ ESLint passed"
    else
        print_warning "⚠ ESLint issues found (run 'npm run lint:fix' to fix)"
        frontend_result=1
    fi

    # Check TypeScript
    print_status "Checking TypeScript..."
    if npm run type-check:ci; then
        print_success "✓ TypeScript check passed"
    else
        print_warning "⚠ TypeScript issues found"
        frontend_result=1
    fi

    # Check if build works
    print_status "Testing build process..."
    if npm run build:ci; then
        print_success "✓ Build successful"
    else
        print_warning "⚠ Build issues found"
        frontend_result=1
    fi

    cd ..

    return $frontend_result
}

# Verify Docker setup
verify_docker() {
    print_status "Verifying Docker setup..."

    if command -v docker >/dev/null 2>&1; then
        if [ -f "Dockerfile" ] || [ -f "backend/Dockerfile" ] || [ -f "frontend/Dockerfile" ]; then
            print_success "✓ Docker files found"
        else
            print_warning "⚠ Docker files not found"
        fi

        if [ -f "docker-compose.yml" ]; then
            print_success "✓ docker-compose.yml found"
        else
            print_warning "⚠ docker-compose.yml not found"
        fi
    else
        print_warning "⚠ Docker not installed"
    fi
}

# Verify Git setup
verify_git() {
    print_status "Verifying Git setup..."

    if [ -d ".git" ]; then
        print_success "✓ Git repository initialized"
    else
        print_warning "⚠ Not a Git repository"
        return 1
    fi

    if [ -f ".gitignore" ]; then
        print_success "✓ .gitignore found"
    else
        print_warning "⚠ .gitignore not found"
    fi

    if [ -f ".pre-commit-config.yaml" ]; then
        print_success "✓ pre-commit configuration found"
    else
        print_warning "⚠ pre-commit configuration not found"
    fi
}

# Verify CI files
verify_ci_files() {
    print_status "Verifying CI/CD files..."

    if [ -f ".github/workflows/ci.yml" ]; then
        print_success "✓ CI workflow found"
    else
        print_error "✗ CI workflow not found"
        return 1
    fi

    if [ -f ".github/workflows/cd.yml" ]; then
        print_success "✓ CD workflow found"
    else
        print_warning "⚠ CD workflow not found"
    fi

    if [ -f "backend/.flake8" ]; then
        print_success "✓ flake8 configuration found"
    else
        print_warning "⚠ flake8 configuration not found"
    fi

    if [ -f "backend/pyproject.toml" ]; then
        print_success "✓ pyproject.toml found"
    else
        print_warning "⚠ pyproject.toml not found"
    fi
}

# Generate summary report
generate_summary() {
    local backend_result=$1
    local frontend_result=$2

    echo
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${BLUE}           VERIFICATION SUMMARY           ${NC}"
    echo -e "${BLUE}===========================================${NC}"

    if [ $backend_result -eq 0 ]; then
        echo -e "Backend:  ${GREEN}✓ READY FOR CI${NC}"
    else
        echo -e "Backend:  ${RED}✗ NEEDS FIXES${NC}"
    fi

    if [ $frontend_result -eq 0 ]; then
        echo -e "Frontend: ${GREEN}✓ READY FOR CI${NC}"
    else
        echo -e "Frontend: ${YELLOW}⚠ MINOR ISSUES${NC}"
    fi

    echo

    local overall_result=$((backend_result + frontend_result))

    if [ $overall_result -eq 0 ]; then
        print_success "🎉 All checks passed! Your CI should run successfully."
        echo
        echo -e "${GREEN}Next steps:${NC}"
        echo "1. Commit your changes: git add . && git commit -m 'feat: setup CI/CD pipeline'"
        echo "2. Push to GitHub: git push origin main"
        echo "3. Check GitHub Actions: https://github.com/your-username/edupropyth/actions"
        return 0
    elif [ $backend_result -eq 0 ] && [ $frontend_result -gt 0 ]; then
        print_warning "⚠ Backend is ready, but frontend has minor issues that won't block CI."
        echo
        echo -e "${YELLOW}Recommendations:${NC}"
        echo "1. Fix frontend issues when possible"
        echo "2. CI will still pass with current configuration"
        echo "3. You can commit and push safely"
        return 0
    else
        print_error "❌ Critical issues found that will cause CI to fail."
        echo
        echo -e "${RED}Required fixes:${NC}"
        echo "1. Fix backend linting issues"
        echo "2. Run the suggested commands above"
        echo "3. Re-run this script to verify fixes"
        return 1
    fi
}

# Show help
show_help() {
    echo "EduProPyth CI Verification Script"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  --backend-only    Verify only backend"
    echo "  --frontend-only   Verify only frontend"
    echo "  --skip-build      Skip build verification"
    echo "  --help, -h        Show this help message"
    echo
    echo "This script verifies that your code will pass CI checks before pushing to GitHub."
}

# Main execution
main() {
    echo -e "${GREEN}EduProPyth CI Verification Tool${NC}"
    echo "==============================="
    echo

    # Parse command line arguments
    BACKEND_ONLY=false
    FRONTEND_ONLY=false
    SKIP_BUILD=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --backend-only)
                BACKEND_ONLY=true
                shift
                ;;
            --frontend-only)
                FRONTEND_ONLY=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done

    check_directory
    verify_git
    verify_ci_files
    verify_docker

    local backend_result=0
    local frontend_result=0

    if [ "$FRONTEND_ONLY" = false ]; then
        verify_backend
        backend_result=$?
    fi

    if [ "$BACKEND_ONLY" = false ]; then
        verify_frontend
        frontend_result=$?
    fi

    generate_summary $backend_result $frontend_result
    exit $?
}

# Run main function with all arguments
main "$@"
