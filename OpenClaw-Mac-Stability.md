# OpenClaw Mac Stability Guide: Managing Sleep Behaviors

This document provides comprehensive recommendations for ensuring OpenClaw remains consistently available on macOS systems, even when the device enters sleep modes.

## Current Configuration Analysis

Your OpenClaw gateway is currently managed by launchd with a proper plist configuration located at:

`~/Library/LaunchAgents/ai.openclaw.gateway.plist`

Key attributes identified:
- ✓ Proper `KeepAlive = true` setting
- ✓ `RunAtLoad = true` enabled 
- ✓ Proper logging configured
- ✓ Program correctly points to your Node installation
- ✓ Gateway service is currently running (PID 46060)

## Sleep Impact on OpenClaw Services

MacOS sleep modes can affect different aspects of OpenClaw in several ways:

1. **System Sleep**: May cause network connections to drop temporarily
2. **Display Sleep**: Usually doesn't affect daemon processes
3. **Idle Sleep**: Can interrupt network communications if power management is aggressive
4. **Power Nap**: May allow brief awakening but can still interrupt services

## Multi-Layer Approach for Maximum Availability

### 1. Plist Configuration Review and Enhancement

Your current configuration is good, but consider these enhancements:

#### Enhanced Plist with Additional Power Management Keys

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>ai.openclaw.gateway</string>
    
    <key>Comment</key>
    <string>OpenClaw Gateway (v2026.4.2)</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>ThrottleInterval</key>
    <integer>1</integer>
    <key>Umask</key>
    <integer>63</integer>
    
    <!-- Enhanced power management -->
    <key>LowPriorityIO</key>
    <true/>
    <key>ProcessType</key>
    <string>Background</string>
    
    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/node</string>
      <string>/Users/rave/.nvm/versions/node/v22.17.0/lib/node_modules/openclaw/dist/index.js</string>
      <string>gateway</string>
      <string>--port</string>
      <string>18789</string>
    </array>
    
    <key>StandardOutPath</key>
    <string>/Users/rave/.openclaw/logs/gateway.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/rave/.openclaw/logs/gateway.err.log</string>
    <key>EnvironmentVariables</key>
    <dict>
      <!-- Your current environment variables -->
    </dict>
  </dict>
</plist>
```

### 2. Recommended System-Level Sleep Settings

Configure your Mac to minimize sleep impact on critical services:

```bash
# To disable sleep entirely when connected to power (use with caution):
# sudo pmset -c sleep 0 disksleep 0 displaysleep 0

# Recommended (display sleeps but system remains active):
sudo pmset -c sleep 0 # Prevents computer from sleeping when plugged in
sudo pmset -c womp 1 # Wake on network access (important for remote connections)
sudo pmset -c ttyskeepawake 1 # Keep awake via SSH
```

### 3. Scripted Approach: Sleep/Wake Notifications

Create a script that sends notifications before sleep/wake cycles to gracefully handle connections:

```bash
#!/bin/bash
# Create: ~/scripts/prevent-sleep.sh

# Install sleepwatcher for sleep/wake notifications (install via brew)
# brew install sleepwatcher

sleep_handler() {
  # Called before sleeping
  echo "$(date): Going to sleep" >> ~/.openclaw/logs/sleep-events.log
}

wake_handler() {
  # Called after waking up
  echo "$(date): Woke up from sleep" >> ~/.openclaw/logs/sleep-events.log
  
  # Optionally restart the gateway to ensure connectivity restoration
  # openclaw gateway restart
  
  # Check and restart the launchd service if needed
  launchctl start ai.openclaw.gateway
}

# Make sure sleepwatcher is configured with:
# ~/.sleep: sleep_handler
# ~/.wakeup: wake_handler
```

### 4. Application-Level Keepalive Script

Create a monitoring script that ensures OpenClaw restarts if it becomes unresponsive during sleep/wake cycles:

```bash
#!/bin/zsh
# File: ~/scripts/openclaw-monitor.sh

LOG_FILE="$HOME/.openclaw/logs/monitor.log"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Check gateway status
check_gateway() {
    if openclaw gateway status >/dev/null 2>&1; then
        log_message "Gateway is running"
        return 0
    else
        log_message "Gateway is NOT running"
        return 1
    fi
}

# Restart gateway if not responding
restart_gateway_if_needed() {
    if ! check_gateway; then
        log_message "Attempting to restart gateway..."
        openclaw gateway restart
        sleep 5
        
        if check_gateway; then
            log_message "Gateway restarted successfully"
        else
            log_message "ERROR: Failed to restart gateway"
        fi
    fi
}

# Check and optionally restart
restart_gateway_if_needed

# Verify WebSocket and HTTP endpoints are responsive
verify_connections() {
    # Example: test gateway HTTP endpoint
    if curl -sf http://localhost:18789/status >/dev/null 2>&1; then
        log_message "Gateway endpoint is responsive"
    else
        log_message "WARNING: Gateway endpoint not responding"
    fi
}

# Run verification
verify_connections
```

### 5. Automatic Execution Solutions

#### Option A: Caffeinate for Critical Times
Create a script to keep the system awake during known critical times:

```bash
#!/bin/bash
# ~/scripts/keep-openclaw-active.sh

# Keep the Mac awake while OpenClaw is running
# Use: caffeinate -s -w `pgrep openclaw` # Sleep prevention tied to OpenClaw process

# Or prevent sleep with timeout (in case of hung process):
/usr/bin/caffeinate -s -t 3600 # Keep awake for 1 hour (3600 seconds)
```

#### Option B: Scheduled Monitoring
Add monitoring to crontab or run periodically using launchd:

```
# Add to crontab (crontab -e) to check every 5 minutes
*/5 * * * * PATH=/usr/local/bin:/usr/bin:/bin /bin/bash -c '~/.openclaw/scripts/restart-check.sh' >> ~/.openclaw/logs/cron.log 2>&1
```

### 6. Implementation Steps

1. **Backup your existing configuration:**
   ```bash
   cp ~/Library/LaunchAgents/ai.openclaw.gateway.plist ~/Library/LaunchAgents/ai.openclaw.gateway.plist.backup
   ```

2. **Apply system-level settings as appropriate for your use case:**
   ```bash
   # When on AC power only - prevents system sleep but allows display sleep
   sudo pmset -c sleep 0 disksleep 0 womp 1 ttyskeepawake 1
   
   # Verify settings
   pmset -g
   ```

3. **Update your launchd plist using the enhanced version above**, then reload:
   ```bash
   launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist
   launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
   ```

4. **Create and enable monitoring script:**
   ```bash
   mkdir -p ~/.openclaw/scripts
   chmod +x ~/.openclaw/scripts/openclaw-monitor.sh
   # Test the script manually
   ~/.openclaw/scripts/openclaw-monitor.sh
   ```

5. **Optionally install sleepwatcher for sleep/wake notifications:**
   ```bash
   brew install sleepwatcher
   # Create handler scripts and start daemon
   ```

## Final Recommendations

Since you're running a critical gateway service:

1. **Keep the existing `KeepAlive=true` setting** - this is correct and working well

2. **Consider adding `caffeinate` on demand** when you know you'll be away for extended periods: 
   ```bash
   caffeinate -i -w $(pgrep -f openclaw-gateway) &
   ```
   
3. **Ensure WOMP (Wake On Magic Packet)** is enabled for network accessibility:
   ```bash
   # Check current state
   networksetup -getwakeonnetworkaccess Wi-Fi
   
   # Enable if needed
   sudo networksetup -setwakeonnetworkaccess Wi-Fi on
   ```

4. **Monitor your logs regularly** to understand patterns of service disruption:
   ```bash
   tail -f ~/.openclaw/logs/gateway.log
   tail -f ~/.openclaw/logs/gateway.err.log
   ```

This combination will ensure maximum availability of your OpenClaw services during typical Mac sleep behaviors while staying within reasonable power usage constraints.