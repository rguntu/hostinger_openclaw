#!/bin/bash

# Management script for OpenClaw Gateway Monitor

SCRIPT_DIR="/Users/rave/.openclaw/workspace"
MONITOR_SCRIPT="$SCRIPT_DIR/gateway_monitor.py"
LOG_FILE="$SCRIPT_DIR/logs/monitor.log"

# Create logs directory if it doesn't exist
mkdir -p "$SCRIPT_DIR/logs"

case "$1" in
    start)
        echo "Starting OpenClaw Gateway Monitor..."
        # Check if already running
        if pgrep -f "gateway_monitor.py" > /dev/null; then
            echo "Monitor is already running"
            exit 0
        fi
        
        nohup python3 "$MONITOR_SCRIPT" >> "$LOG_FILE" 2>&1 &
        PID=$!
        echo "Started OpenClaw Gateway Monitor with PID: $PID"
        echo $PID > "$SCRIPT_DIR/monitor.pid"
        ;;
        
    stop)
        echo "Stopping OpenClaw Gateway Monitor..."
        if pgrep -f "gateway_monitor.py" > /dev/null; then
            pkill -f "gateway_monitor.py"
            rm -f "$SCRIPT_DIR/monitor.pid"
            echo "Monitor stopped"
        else
            echo "Monitor is not running"
        fi
        ;;
        
    restart)
        $0 stop
        sleep 2
        $0 start
        ;;
        
    status)
        if pgrep -f "gateway_monitor.py" > /dev/null; then
            PID=$(pgrep -f "gateway_monitor.py")
            echo "OpenClaw Gateway Monitor is running (PID: $PID)"
            
            # Show recent log entries
            echo "Recent 5 log entries:"
            tail -5 "$LOG_FILE" 2>/dev/null || echo "No log file found"
        else
            echo "OpenClaw Gateway Monitor is not running"
        fi
        ;;
        
    logs)
        echo "Showing recent logs from $LOG_FILE:"
        tail -20 "$LOG_FILE" 2>/dev/null || echo "No log file found or accessible"
        ;;
        
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac

exit 0