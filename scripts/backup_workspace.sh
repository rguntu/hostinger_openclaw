#!/bin/bash
# OpenClaw Workspace Backup Script
# Created by fig, the Precise Architect

WORKSPACE_DIR="/Users/rave/.openclaw/workspace"
LOG_FILE="/Users/rave/.openclaw/workspace/memory/backup.log"

cd "$WORKSPACE_DIR" || exit

# Add all changes
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "$(date): No changes to backup." >> "$LOG_FILE"
else
    git commit -m "Auto-backup: $(date)"
    git push origin master
    echo "$(date): Changes backed up successfully." >> "$LOG_FILE"
fi
