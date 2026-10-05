#!/usr/bin/env bash
# ==============================================================================
# Automated World Backup & Prune Script
# Author: Chalmers CS / Homelab Playground
# ==============================================================================
set -euo pipefail

SERVER_DIR="/srv/minecraft/survival"
BACKUP_DIR="/mnt/storage/backups/mc"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/world_${TIMESTAMP}.tar.zst"

echo "[$(date)] Starting backup of ${SERVER_DIR}/world..."
mkdir -p "${BACKUP_DIR}"

# RCON trigger to save-off and save-all if server is running
# mcrcon -p secret "save-off" "save-all"

tar --zstd -cf "${BACKUP_FILE}" -C "${SERVER_DIR}" world world_nether world_the_end

# mcrcon -p secret "save-on"

echo "[$(date)] Backup completed: ${BACKUP_FILE}"
echo "[$(date)] Rotating old archives (keeping last 14 days)..."
find "${BACKUP_DIR}" -name "world_*.tar.zst" -mtime +14 -delete
echo "[$(date)] Backup and rotation done!"
