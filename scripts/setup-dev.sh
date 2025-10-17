#!/bin/bash

# EduProPyth Development Environment Setup Script
# This script sets up the complete development environment

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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    local missing_deps=()

    if ! command_exists python3; then
        missing_deps+=("python3")
    fi

    if ! command_exists node; then
        missing_deps+=("nodejs")
    fi

    if ! command_exists git; then
        missing_deps+=("git")
    fi

    if ! command_exists npm; then
        missing_deps+=("npm")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        echo "Please install them and run this script again."
        exit 1
    fi

    # Check Python version
    python_version=$(python3 --version | cut -d' ' -f2)
    if [ "$(printf '%s\n' "3.11" "$python_version" | sort -V | head -n1)" != "3.11" ]; then
        print_warning "Python 3.11+ recommended, found $python_version"
    fi

    # Check Node version
    node_version=$(node --version | sed 's/v//')
    if [ "$(printf '%s\n' "20.0.0" "$node_version" | sort -V | head -n1)" != "20.0.0" ]; then
        print_warning "Node.js 20+ recommended, found $node_version"
    fi

    print_success "Prerequisites check completed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."

    cd backend

    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi

    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate

    # Upgrade pip
    print_status "Upgrading pip..."
    python -m pip install --upgrade pip

    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements/dev.txt

    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating backend .env file..."
        cat > .env << 'EOF'
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
DB_NAME=edupropyth
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# OAuth Configurations (add your own)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
EOF
        print_warning "Backend .env created with default values. Please update with your configurations."
    fi

    # Run migrations
    print_status "Running database migrations..."
    python manage.py migrate

    # Create superuser if requested
    read -p "Do you want to create a superuser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        python manage.py createsuperuser
    fi

    cd ..
    print_success "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."

    cd frontend

    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install

    # Create .env.local file if it doesn't exist
    if [ ! -f ".env.local" ]; then
        print_status "Creating frontend .env.local file..."
        cat > .env.local << 'EOF'
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
EOF
        print_warning "Frontend .env.local created with default values. Please update with your configurations."
    fi

    cd ..
    print_success "Frontend setup completed"
}

# Setup pre-commit hooks
setup_pre_commit() {
    print_status "Setting up pre-commit hooks..."

    cd backend
    source venv/bin/activate

    if command_exists pre-commit; then
        # Install pre-commit hooks
        cd ..
        pre-commit install
        pre-commit install --hook-type commit-msg
        print_success "Pre-commit hooks installed"
    else
        print_warning "pre-commit not available. Install it with: pip install pre-commit"
    fi

    cd backend
    deactivate
    cd ..
}

# Run quality checks
run_quality_checks() {
    print_status "Running quality checks..."

    cd backend
    source venv/bin/activate

    print_status "Running flake8..."
    if flake8 .; then
        print_success "flake8 passed"
    else
        print_error "flake8 failed"
        return 1
    fi

    print_status "Running black check..."
    if black --check .; then
        print_success "black check passed"
    else
        print_warning "Code formatting issues found. Run 'make format' to fix."
    fi

    print_status "Running isort check..."
    if isort --check-only .; then
        print_success "isort check passed"
    else
        print_warning "Import sorting issues found. Run 'make format' to fix."
    fi

    deactivate
    cd ..

    # Frontend checks
    print_status "Running frontend checks..."
    cd frontend

    if npm run lint; then
        print_success "ESLint passed"
    else
        print_warning "ESLint issues found. Run 'npm run lint:fix' to fix."
    fi

    if npm run type-check; then
        print_success "TypeScript check passed"
    else
        print_error "TypeScript check failed"
    fi

    cd ..
}

# Setup Docker (optional)
setup_docker() {
    if command_exists docker && command_exists docker-compose; then
        read -p "Do you want to build Docker images? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Building Docker images..."
            docker-compose build
            print_success "Docker images built successfully"
        fi
    else
        print_warning "Docker not available. Skipping Docker setup."
    fi
}

# Print final instructions
print_instructions() {
    print_success "Development environment setup completed!"
    echo
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Update .env files with your configurations"
    echo "2. Start the development servers:"
    echo "   Backend:  cd backend && source venv/bin/activate && python manage.py runserver"
    echo "   Frontend: cd frontend && npm run dev"
    echo
    echo -e "${BLUE}Useful commands:${NC}"
    echo "   Backend:  cd backend && make help"
    echo "   Frontend: cd frontend && npm run --help"
    echo
    echo -e "${YELLOW}Access URLs:${NC}"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend:  http://localhost:8000"
    echo "   API Docs: http://localhost:8000/api/docs/"
    echo "   Admin:    http://localhost:8000/admin/"
    echo
    if [ -f "backend/.env" ]; then
        echo -e "${RED}IMPORTANT:${NC} Update backend/.env with your database and OAuth configurations!"
    fi
    if [ -f "frontend/.env.local" ]; then
        echo -e "${RED}IMPORTANT:${NC} Update frontend/.env.local with your API configurations!"
    fi
}

# Main execution
main() {
    echo -e "${GREEN}EduProPyth Development Environment Setup${NC}"
    echo "========================================"
    echo

    # Check if we're in the right directory
    if [ ! -f "docker-compose.yml" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "This script must be run from the project root directory"
        exit 1
    fi

    check_prerequisites
    setup_backend
    setup_frontend
    setup_pre_commit

    # Ask if user wants to run quality checks
    read -p "Do you want to run quality checks? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        run_quality_checks
    fi

    setup_docker
    print_instructions
}

# Run main function
main "$@"
