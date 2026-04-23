#!/usr/bin/env bash

# Simple topic manager
TOPICS_FILE="/Users/rave/.openclaw/workspace/memory/fun_topics.txt"

case "$1" in
  suggest)
    if [ -f "$TOPICS_FILE" ]; then
      cat "$TOPICS_FILE" | sort -R | head -n 1
    else
      echo "No topics found. Add some first!"
    fi
    ;;
  list)
    [ -f "$TOPICS_FILE" ] && cat "$TOPICS_FILE" || echo "No topics saved."
    ;;
  add)
    echo "$2" >> "$TOPICS_FILE"
    echo "Added: $2"
    ;;
  create)
    # Interactive creation logic
    read -p "Enter Group ID: " GROUP_ID
    read -p "Enter Topic Name: " TOPIC_NAME
    read -p "Enter Agent Name: " AGENT_NAME

    echo "Would proceed with: Group ID=$GROUP_ID, Topic=$TOPIC_NAME, Agent=$AGENT_NAME"
    ;;
  *)
    echo "Usage: ttopic_skill {suggest|list|add [topic]|create}"
    ;;
esac
