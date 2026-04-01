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
    touch "/Users/rave/.openclaw/workspace/memory/last_backup"
    echo "$(date): Changes backed up successfully." >> "$LOG_FILE"
    # Send Discord notification (adjust channel ID if needed)
    openclaw message send --target "channel:1488695433952886908" --message "✅ Workspace backup completed successfully at $(date)"
fi
