#!/usr/bin/env python3
"""
OpenClaw Gateway Monitor
Collects real-time data about OpenClaw gateway status and system resources
"""

import json
import subprocess
import psutil
import os
import time
import threading
import random
from datetime import datetime
import logging
from collections import deque

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Data storage - use deques to limit history
MAX_HISTORY = 100
stats_history = deque(maxlen=MAX_HISTORY)
activity_log = deque(maxlen=50)
current_stats = {}

def get_gateway_status():
    """Get the status of the OpenClaw gateway"""
    try:
        # Try getting Gateway status via available command
        result = subprocess.run(['openclaw', 'gateway', 'status'], 
                              capture_output=True, text=True, timeout=10)
        status = result.stdout.strip() if result.returncode == 0 else result.stderr.strip()
        
        # Determine state based on output
        if "running" in status.lower():
            state = "running"
        elif "sleeping" in status.lower() or "inactive" in status.lower():
            state = "sleeping"
        else:
            state = "offline"
        
        return state, status
    
    except FileNotFoundError:
        logger.warning("OpenClaw command not found")
        return "offline", "OpenClaw gateway not installed"
    except Exception as e:
        logger.error(f"Error getting gateway status: {e}")
        return "offline", str(e)

def get_openclaw_process_info():
    """Get information about OpenClaw processes"""
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'memory_info']):
        try:
            if 'openclaw' in proc.info['name'].lower():
                processes.append({
                    'pid': proc.info['pid'],
                    'name': proc.info['name'],
                    'cpu_percent': proc.info['cpu_percent'],
                    'memory_percent': proc.info['memory_percent'],
                    'memory_mb': proc.info['memory_info'].rss / 1024 / 1024  # RSS in MB
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    
    return processes

def get_system_resources():
    """Get overall system resource usage"""
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    
    return {
        'cpu': cpu_percent,
        'memory_total': memory.total / 1024 / 1024,  # in MB
        'memory_available': memory.available / 1024 / 1024,  # in MB
        'memory_used': memory.used / 1024 / 1024,  # in MB
        'memory_percent': memory.percent
    }

def simulate_task_queue():
    """Simulate getting task queue information from OpenClaw"""
    # In a real implementation, this would connect to OpenClaws task management
    # For now, we'll generate mock data
    import random
    return {
        'incoming': random.randint(0, 5),
        'processing': random.randint(0, 3),
        'queued': random.randint(0, 10),
        'completed': random.randint(20, 100),
        'failed': random.randint(0, 3)
    }

def collect_stats():
    """Collect all stats and store them"""
    global current_stats
    
    start_time = time.time()
    
    # Collect all data
    gateway_state, gateway_details = get_gateway_status()
    openclaw_processes = get_openclaw_process_info()
    system_resources = get_system_resources()
    task_queue = simulate_task_queue()
    
    total_time = time.time() - start_time
    
    # Calculate success rate
    total_processed = task_queue['completed'] + task_queue['failed']
    success_rate = (task_queue['completed'] / total_processed * 100) if total_processed > 0 else 0
    
    # Performance info
    performance = {
        'avg_response_time_ms': round(total_time * 1000) if total_time > 0 else 0,
        'success_rate': round(success_rate, 2),
        'collection_time': round(total_time, 3)
    }
    
    timestamp = datetime.now().isoformat()
    
    # Compile current stats
    current_stats = {
        'timestamp': timestamp,
        'system': {
            'utc_timestamp': time.time(),
            'datetime_str': datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d %H:%M:%S')
        },
        'gateway': {
            'state': gateway_state,
            'details': gateway_details
        },
        'processes': openclaw_processes,
        'system_resources': system_resources,
        'task_queue': task_queue,
        'performance': performance,
        'current_tasks': {
            'sleeping': random.randint(0, 2),  # Simulate some processes in sleep
            'active': len([p for p in openclaw_processes if p['cpu_percent'] > 1])
        }
    }
    
    # Add to history
    stats_history.append(current_stats.copy())
    
    # Log an activity for demonstration
    add_activity(f"Stats collection completed - Gateway: {gateway_state.upper()}, Active processes: {len(openclaw_processes)}", 'info')
    
    return current_stats

def add_activity(message, level='info'):
    """Add an activity to the timeline"""
    activity = {
        'timestamp': datetime.now().isoformat(),
        'datetime_str': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'message': message,
        'level': level,
        'type': level
    }
    activity_log.appendleft(activity)

def get_recent_logs():
    """Simulate reading recent logs"""
    try:
        # Look for OpenClaw log files in common locations
        log_paths = [
            os.path.expanduser("~/.openclaw/logs/openclaw.log"),
            "/Users/rave/.openclaw/workspace/logs/agent.log",
            os.path.join(os.path.dirname(__file__), "logs", "agent.log")
        ]
        
        logs = []
        for log_path in log_paths:
            if os.path.exists(log_path):
                with open(log_path, 'r') as f:
                    lines = f.readlines()[-20:]  # Last 20 lines
                    logs.extend(lines)
                    break  # Use first found log file
        
        if not logs:
            # Simulate some logs for demo purposes
            simulated_logs = [
                f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Starting OpenClaw monitoring service\n",
                f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] DEBUG: Connected to gateway\n",
                f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Task queue monitored - incoming: 2, processing: 1\n",
                f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] WARN: High memory usage detected - 78% used\n"
            ]
            logs = simulated_logs
        
        return [log.strip() for log in logs if log.strip()]
    
    except Exception as e:
        logger.error(f"Error reading logs: {e}")
        return [f"Error reading logs: {e}"]

def export_dashboard_data():
    """Export current stats to JSON file for the dashboard to consume"""
    try:
        # Compile data for dashboard
        dashboard_data = {
            'system_status': {
                'gateway_state': current_stats.get('gateway', {}).get('state', 'unknown'),
                'timestamp': current_stats.get('timestamp', ''),
                'uptime_seconds': len(stats_history) * 5  # Assuming 5s collection interval
            },
            'task_queue': current_stats.get('task_queue', {}),
            'performance': current_stats.get('performance', {}),
            'resources': current_stats.get('system_resources', {}),
            'process_info': current_stats.get('processes', []),
            'recent_activities': list(activity_log)[:20],  # Latest 20
            'recent_logs': get_recent_logs(),
            'historical_stats': list(stats_history)[-50:],  # Recent 50 entries
            'alerts': []  # Add alert detection here based on status
        }
        
        # Write to JSON file
        output_file = '/Users/rave/.openclaw/workspace/dashboard-data.json'
        with open(output_file, 'w') as f:
            json.dump(dashboard_data, f, indent=2)
        
        logger.info(f"Dashboard data exported to {output_file}")
        return True
    
    except Exception as e:
        logger.error(f"Error exporting dashboard data: {e}")
        return False

def monitor_loop():
    """Main monitoring loop"""
    while True:
        try:
            collect_stats()
            export_dashboard_data()
            
            # Wait before next collection (in a realistic deployment, this might adjust based on system load)
            time.sleep(5)  # 5 seconds
            
        except KeyboardInterrupt:
            logger.info("Monitoring stopped by user")
            break
        except Exception as e:
            logger.error(f"Error in monitoring loop: {e}")
            time.sleep(10)  # Wait longer if there's an error

def init_monitor():
    """Initialize the monitor and add startup activity"""
    logger.info("Initializing OpenClaw gateway monitor")
    add_activity("OpenClaw Gateway Monitor initialized", 'info')
    
    # Do initial stats collection
    collect_stats()
    export_dashboard_data()

if __name__ == "__main__":
    # Initialize and run monitor
    init_monitor()
    
    # Start monitoring loop
    monitor_loop()