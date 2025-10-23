#!/bin/bash

# EduProPyth Database Backup Script
# This script creates backups of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/edupropyth_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check required environment variables
if [ -z "$PGHOST" ] || [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ]; then
    log_error "Required environment variables not set (PGHOST, PGDATABASE, PGUSER)"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
log_info "Starting backup of database: $PGDATABASE"
log_info "Backup file: $BACKUP_FILE"

if pg_dump -h "$PGHOST" -p "${PGPORT:-5432}" -U "$PGUSER" -d "$PGDATABASE" \
    --format=plain --no-owner --no-acl --clean --if-exists | gzip > "$BACKUP_FILE"; then
    log_info "Backup completed successfully"

    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_info "Backup size: $BACKUP_SIZE"
else
    log_error "Backup failed"
    exit 1
fi

# Verify backup file exists and is not empty
if [ ! -s "$BACKUP_FILE" ]; then
    log_error "Backup file is empty or doesn't exist"
    exit 1
fi

# Remove old backups
log_info "Removing backups older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -name "edupropyth_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "edupropyth_backup_*.sql.gz" -type f | wc -l)
log_info "Total backups retained: $BACKUP_COUNT"

# List recent backups
log_info "Recent backups:"
find "$BACKUP_DIR" -name "edupropyth_backup_*.sql.gz" -type f -printf "%T@ %Tc %p\n" | sort -rn | head -5 | cut -d' ' -f2-

log_info "Backup process completed successfully"

exit 0
