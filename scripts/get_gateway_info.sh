#!/bin/zsh

# Script to get OpenClaw gateway information and system stats

echo "=== OpenClaw Gateway Status ==="

# Check OpenClaw gateway status
if command -v openclaw &>/dev/null; then
  GATEWAY_STATUS=$(openclaw gateway status 2>&1)
  echo "$GATEWAY_STATUS"
else
  echo "OpenClaw gateway not installed"
fi

echo ""
echo "=== Process Status ==="

# Check if OpenClaw process is running
OPENCLAW_PID=$(pgrep -f "openclaw.*gateway")
if [ -n "$OPENCLAW_PID" ]; then
  echo "OpenClaw gateway is running (PID: $OPENCLAW_PID)"
  # Show details about the OpenClaw process
  ps -o pid,ppid,user,%cpu,%mem,comm -p $OPENCLAW_PID 2>/dev/null
else
  echo "OpenClaw gateway is not running"
fi

echo ""
echo "=== System Resources ==="

# Get OpenClaw process CPU and memory usage
if [ -n "$OPENCLAW_PID" ]; then
  # Get CPU and memory info for OpenClaw process
  OPENCLAW_PROC_INFO=$(ps -o pid,%cpu,%mem,vsz,rss -p $OPENCLAW_PID 2>/dev/null | tail -1)
  echo "OpenClaw Process Info: $OPENCLAW_PROC_INFO"
  
  # Get overall system memory/usage
  echo "System Memory:"
  vm_stat | grep -E "(Pages free|Pages active|Pages inactive|Pages speculative)"
else
  echo "No OpenClaw process currently running"
fi

echo ""
echo "=== System Resources ==="
# Show overall system resources
echo "CPU Usage: $(top -l 1 | head -n 10 | grep "^CPU")"
echo "Memory: $(top -l 1 | head -n 10 | grep "^PhysMem")"

echo ""
echo "=== Network Connections ==="
# Check any connections related to OpenClaw/netlify (if using)
lsof -i :3000 2>/dev/null || echo "Port 3000 not in use"

echo ""
echo "=== Recent Logs (Last 20 lines) ==="
# Show recent logs from OpenClaw or general logs in the workspace
tail -20 ~/.openclaw/logs/openclaw.log 2>/dev/null || tail -20 /Users/rave/.openclaw/workspace/logs/agent.log 2>/dev/null || echo "No recent OpenClaw logs found"