---
summary: "Workspace template for HEARTBEAT.md"
read_when:
  - Bootstrapping a workspace manually
---

# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Periodic Tasks

- Weekly backup check (Daily backup: cron; Heartbeat: verify & retry if missed for >24h)
  ```bash
  /usr/bin/find /Users/rave/.openclaw/workspace/memory/last_backup -mmin +1440 -exec /Users/rave/.openclaw/workspace/scripts/backup_workspace.sh \;
  ```

# Add tasks below when you want the agent to check something periodically.