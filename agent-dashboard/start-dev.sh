#!/bin/bash
# Wait for npm install to finish
while pgrep -f "npm.*install" > /dev/null; do
    echo "Waiting for npm install to finish..."
    sleep 5
done

echo "Starting the Agent Dashboard application..."
cd /Users/rave/.openclaw/workspace/agent-dashboard
npm start