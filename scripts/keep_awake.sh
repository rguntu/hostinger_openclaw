#!/bin/bash
# OpenClaw Battery & Sleep Monitor
# Created by fig, the Precise Architect

LOG_FILE="/Users/rave/.openclaw/workspace/memory/battery_monitor.log"
THRESHOLD=20 # Notify when battery is below 20%
CHANNEL_ID="1485174866209411122" # Current Discord Channel

# 1. Start Caffienate to prevent idle sleep (background)
# -i: prevent idle sleep, -d: prevent display sleep
caffeinate -id &
CAFF_PID=$!

echo "$(date): Battery monitor started. Caffeinate PID: $CAFF_PID" >> "$LOG_FILE"

while true; do
    # Get battery percentage (more robust grep for macOS)
    BATT_INFO=$(pmset -g batt)
    PERCENT=$(echo "$BATT_INFO" | grep -o "[0-9]\{1,3\}%" | tr -d '%')
    SOURCE=$(echo "$BATT_INFO" | grep -o "AC Power\|Battery Power")

    if [ -n "$PERCENT" ] && [ "$PERCENT" -le "$THRESHOLD" ] && [ "$SOURCE" == "Battery Power" ]; then
        echo "$(date): Low battery alert! ${PERCENT}%" >> "$LOG_FILE"
        
        # 1. Trigger Git Sync-up (Manual call but effective)
        echo "$(date): Low battery - triggering emergency Git backup." >> "$LOG_FILE"
        /Users/rave/.openclaw/workspace/scripts/backup_workspace.sh

        # 2. Send Discord Alert
        openclaw message send --channel discord --target "channel:$CHANNEL_ID" --message "⚠️ **Low Battery Alert!** Your Mac is at **${PERCENT}%** and unplugged. **Emergency Workspace Backup Triggered.** Please connect power soon."
        
        # Wait longer after alert to avoid spamming
        sleep 600 
    fi

    # Check every 5 minutes
    sleep 300
done
