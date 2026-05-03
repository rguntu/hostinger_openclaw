#!/bin/zsh
# File: ~/scripts/openclaw-sleep-monitor.sh
# Purpose: Monitor OpenClaw gateway and ensure it recovers after sleep events

LOG_FILE="$HOME/.openclaw/logs/monitor.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
    # Also print if run manually
    if [ -t 0 ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
    fi
}

# Function to check if OpenClaw gateway is running and responsive
check_gateway_responsiveness() {
    # Check if process is running via launchctl
    if launchctl list | grep -q "ai.openclaw.gateway"; then
        log_message "ai.openclaw.gateway service is loaded in launchctl"
        
        # Get PID and check if it's responsive
        PID=$(pgrep -f "openclaw.*gateway")
        if [ -n "$PID" ]; then
            log_message "OpenClaw gateway process running with PID: $PID"
            
            # Check if we can reach the gateway endpoint
            if curl -sf --max-time 10 http://localhost:18789/status >/dev/null 2>&1; then
                log_message "Gateway endpoint at http://localhost:18789/status is responsive"
                return 0
            else
                log_message "WARNING: Gateway endpoint not responding"
                
                # Check process status more thoroughly
                if ps -p "$PID" >/dev/null 2>&1; then
                    log_message "Process $PID exists but endpoint is not responding"
                else
                    log_message "Process $PID not found anymore"
                fi
                return 1
            fi
        else
            log_message "OpenClaw gateway process is not running"
            return 1
        fi
    else
        log_message "ai.openclaw.gateway service is not loaded in launchctl"
        return 1
    fi
}

# Function to restart OpenClaw gateway
restart_gateway_safely() {
    log_message "Attempting to restart OpenClaw gateway..."
    
    # Stop the gateway
    openclaw gateway stop
    
    # Wait a moment
    sleep 3
    
    # Check if it stopped properly
    if pgrep -f "openclaw.*gateway" >/dev/null 2>&1; then
        log_message "Gateway seems to still be running, attempting forced termination..."
        pkill -f "openclaw.*gateway"
        sleep 2
    fi
    
    # Start the gateway
    openclaw gateway start
    
    # Check if it's running now
    sleep 5
    if check_gateway_responsiveness; then
        log_message "Gateway restarted successfully and is functional"
        return 0
    else
        log_message "ERROR: Gateway did not start properly after restart attempt"
        return 1
    fi
}

# Check if we were recently woken from sleep
check_recent_wake() {
    # Look for sleep/wake events in system logs from the last 5 minutes
    recent_sleep_events=$(
        log show --predicate 'eventMessage CONTAINS[c] "Sleep"' \
                 --last 5m 2>/dev/null | \
        grep -i -E "(sleep|waking|wake)" || true
    )
    
    if [ -n "$recent_sleep_events" ]; then
        log_message "Recent sleep/wake events detected in system logs:"
        echo "$recent_sleep_events" >> "$LOG_FILE"
        return 0
    else
        # Check alternatively using pmset log
        recent_pmset_events=$(
            pmset -g log | tail -20 | grep -i -E "(sleep|waking|power)"
        )
        
        if [ -n "$recent_pmset_events" ]; then
            log_message "Recent power management events detected:"
            echo "$recent_pmset_events" >> "$LOG_FILE"
            return 0
        fi
        return 1
    fi
}

# Ensure log directory exists
mkdir -p "$HOME/.openclaw/logs"

# Main execution
log_message "Starting OpenClaw gateway health check"

# Check if we just woke up from sleep
if check_recent_wake; then
    log_message "System appears to have recently woken from sleep, performing immediate recovery check"
    if check_gateway_responsiveness; then
        log_message "Gateway recovered automatically after sleep"
    else
        log_message "Gateway needs manual recovery after sleep event"
        if restart_gateway_safely; then
            log_message "Gateway recovery successful"
        else
            log_message "Gateway recovery failed"
        fi
    fi
else
    # Normal periodic check
    if check_gateway_responsiveness; then
        log_message "Gateway is responsive and healthy"
    else
        log_message "Gateway is not responding, attempting restart..."
        restart_gateway_safely
    fi
fi

log_message "Health check completed"

exit 0