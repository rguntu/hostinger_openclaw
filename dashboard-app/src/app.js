// Agent Management Dashboard App
document.addEventListener('DOMContentLoaded', function() {
    // Sample agent data
    let agents = [
        { 
            id: '1', 
            name: 'iOS Coder Agent', 
            status: 'running', 
            type: 'Coding Assistant',
            lastUpdated: new Date(Date.now() - 5 * 60000),
            runtime: '15m 20s', 
            metrics: {
                tasksCompleted: 24,
                errors: 2,
                accuracy: '98%',
                efficiency: '92%'
            }
        },
        { 
            id: '2', 
            name: 'Data Analyzer', 
            status: 'running', 
            type: 'Analytical Bot',
            lastUpdated: new Date(Date.now() - 12 * 60000),
            runtime: '32m 10s', 
            metrics: {
                tasksCompleted: 56,
                errors: 1,
                accuracy: '99.2%',
                efficiency: '86%'
            }
        },
        { 
            id: '3', 
            name: 'Web Scraper', 
            status: 'stopped', 
            type: 'Data Collection',
            lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            runtime: '2d 6h 15m', 
            metrics: {
                tasksCompleted: 128,
                errors: 5,
                accuracy: '94%',
                efficiency: '78%'
            }
        },
        { 
            id: '4', 
            name: 'Image Processor', 
            status: 'running', 
            type: 'Image Recognition',
            lastUpdated: new Date(Date.now() - 3 * 60000),
            runtime: '8m 45s', 
            metrics: {
                tasksCompleted: 12,
                errors: 0,
                accuracy: '99.8%',
                efficiency: '95%'
            }
        },
        { 
            id: '5', 
            name: 'Report Generator', 
            status: 'completed', 
            type: 'Documentation',
            lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            runtime: '2h 15m', 
            metrics: {
                tasksCompleted: 1,
                errors: 0,
                accuracy: '100%',
                efficiency: 'N/A'
            }
        },
        { 
            id: '6', 
            name: 'API Controller', 
            status: 'error', 
            type: 'System Interface',
            lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
            runtime: '15m 30s', 
            metrics: {
                tasksCompleted: 8,
                errors: 12,
                accuracy: '67%',
                efficiency: '45%'
            }
        }
    ];

    // Initialize agent state chart
    const chartCtx = document.getElementById('agentStatesChart').getContext('2d');
    let agentStatesChart;
    
    function initAgentStatesChart() {
        const agentsByStatus = {
            running: agents.filter(a => a.status === 'running').length,
            stopped: agents.filter(a => a.status === 'stopped').length,
            completed: agents.filter(a => a.status === 'completed').length,
            error: agents.filter(a => a.status === 'error').length
        };
        
        if (agentStatesChart) {
            agentStatesChart.destroy();
        }
        
        agentStatesChart = new Chart(chartCtx, {
            type: 'bar',
            data: {
                labels: ['Running', 'Stopped', 'Completed', 'Error'],
                datasets: [{
                    label: 'Agent Count',
                    data: [
                        agentsByStatus.running, 
                        agentsByStatus.stopped, 
                        agentsByStatus.completed, 
                        agentsByStatus.error
                    ],
                    backgroundColor: [
                        'var(--running-color)',
                        'var(--stopped-color)', 
                        'var(--completed-color)',
                        'var(--error-color)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        padding: 12,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                }
            }
        });
    }

    // Populate agent table
    function populateAgentTable(filter = 'all') {
        const tbody = document.getElementById('agents-table-body');
        tbody.innerHTML = '';

        let filteredAgents = agents;
        if (filter === 'running') {
            filteredAgents = agents.filter(agent => agent.status === 'running');
        } else if (filter === 'stopped') {
            filteredAgents = agents.filter(agent => agent.status === 'stopped');
        }

        filteredAgents.forEach(agent => {
            const row = document.createElement('tr');
            
            // Format last updated time
            const timeDiff = Math.floor((Date.now() - agent.lastUpdated.getTime()) / 1000);
            let timeLabel;
            if (timeDiff < 60) {
                timeLabel = `${timeDiff}s ago`;
            } else if (timeDiff < 3600) {
                timeLabel = `${Math.floor(timeDiff / 60)}m ago`;
            } else if (timeDiff < 86400) {
                timeLabel = `${Math.floor(timeDiff / 3600)}h ago`;
            } else {
                timeLabel = `${Math.floor(timeDiff / 86400)}d ago`;
            }

            row.innerHTML = `
                <td>${agent.name}</td>
                <td><span class="status-badge status-${agent.status}">${agent.status}</span></td>
                <td>${agent.type}</td>
                <td>${timeLabel}</td>
                <td>${agent.metrics.tasksCompleted} tasks</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-details" data-agent-id="${agent.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${agent.status === 'running' 
                          ? `<button class="btn-action btn-stop" data-agent-id="${agent.id}">
                                <i class="fas fa-stop"></i> Stop
                             </button>` 
                          : agent.status === 'stopped' 
                            ? `<button class="btn-action btn-start" data-agent-id="${agent.id}">
                                 <i class="fas fa-play"></i> Start
                               </button>`
                            : ''}
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const agentId = e.target.closest('.btn-details').dataset.agentId;
                showAgentDetails(agentId);
            });
        });

        document.querySelectorAll('.btn-start').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const agentId = e.target.closest('.btn-start').dataset.agentId;
                startAgent(agentId);
            });
        });

        document.querySelectorAll('.btn-stop').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const agentId = e.target.closest('.btn-stop').dataset.agentId;
                stopAgent(agentId);
            });
        });
    }

    // Update dashboard summary cards
    function updateSummaryCards() {
        const runningCount = agents.filter(a => a.status === 'running').length;
        const activeCount = agents.length;
        const tasksCount = agents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0);
        const avgRuntime = calculateAvgRuntime();

        document.getElementById('active-agents-count').textContent = activeCount;
        document.getElementById('running-agents-count').textContent = runningCount;
        document.getElementById('tasks-count').textContent = tasksCount;
        document.getElementById('avg-runtime').textContent = avgRuntime;

        // Update status breakdown
        document.getElementById('running-count').textContent = runningCount;
        document.getElementById('stopped-count').textContent = agents.filter(a => a.status === 'stopped').length;
        document.getElementById('completed-count').textContent = agents.filter(a => a.status === 'completed').length;
        document.getElementById('error-count').textContent = agents.filter(a => a.status === 'error').length;
    }

    // Calculate average runtime
    function calculateAvgRuntime() {
        if (agents.length === 0) return '0m';
        
        // For demo purposes, let's calculate based on a simplified approach
        const totalMinutes = agents.reduce((sum, agent) => {
            if (agent.runtime) {
                const parts = agent.runtime.split(' ');
                let minutes = 0;
                
                for (const part of parts) {
                    if (part.includes('h')) {
                        minutes += parseInt(part.replace('h', '')) * 60;
                    } else if (part.includes('m')) {
                        minutes += parseInt(part.replace('m', ''));
                    } else if (part.includes('s')) {
                        minutes += parseInt(part.replace('s', '')) / 60;
                    }
                }
                
                return sum + minutes;
            }
            return sum;
        }, 0);
        
        const avgMinutes = Math.round(totalMinutes / agents.length);
        if (avgMinutes >= 60) {
            const hours = Math.floor(avgMinutes / 60);
            const mins = avgMinutes % 60;
            return `${hours}h ${mins}m`;
        }
        return `${avgMinutes}m`;
    }

    // Show agent details modal
    function showAgentDetails(agentId) {
        const agent = agents.find(a => a.id === agentId);
        if (!agent) return;

        document.getElementById('modal-agent-name').textContent = agent.name;
        document.getElementById('modal-agent-status').textContent = agent.status;
        document.getElementById('modal-agent-type').textContent = agent.type;
        
        // Format last updated time for modal
        const timeDiff = Math.floor((Date.now() - agent.lastUpdated.getTime()) / 1000);
        let timeLabel;
        if (timeDiff < 60) {
            timeLabel = `${timeDiff} seconds ago`;
        } else if (timeDiff < 3600) {
            timeLabel = `${Math.floor(timeDiff / 60)} minutes ago`;
        } else if (timeDiff < 86400) {
            timeLabel = `${Math.floor(timeDiff / 60 / 60)} hours ago`;
        } else {
            timeLabel = `${Math.floor(timeDiff / 86400)} days ago`;
        }
        
        document.getElementById('modal-agent-updated').textContent = timeLabel;
        document.getElementById('modal-agent-runtime').textContent = agent.runtime;

        // Populate metrics
        const metricsContainer = document.getElementById('modal-agent-metrics');
        metricsContainer.innerHTML = '';
        
        Object.entries(agent.metrics).forEach(([key, value]) => {
            const metricCard = document.createElement('div');
            metricCard.className = 'metric-card';
            metricCard.innerHTML = `
                <div class="metric-value">${value}</div>
                <div class="metric-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
            `;
            metricsContainer.appendChild(metricCard);
        });

        // Update button visibility based on status
        const startBtn = document.getElementById('start-agent-btn');
        const stopBtn = document.getElementById('stop-agent-btn');
        
        if (agent.status === 'running') {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
        } else if (agent.status === 'stopped') {
            startBtn.style.display = 'inline-block';
            stopBtn.style.display = 'none';
        } else {
            startBtn.style.display = 'inline-block';
            stopBtn.style.display = 'inline-block';
        }

        // Set data attribute for later use
        document.body.setAttribute('data-current-agent-id', agentId);

        // Show modal
        document.getElementById('agent-detail-modal').classList.add('active');
    }

    // Start an agent
    function startAgent(agentId) {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = 'running';
            agent.lastUpdated = new Date();
            
            // Update the UI
            updateSummaryCards();
            updateAgentTableBasedOnFilter();
            initAgentStatesChart();
            
            console.log(`Started agent: ${agent.name}`);
            alert(`Started agent: ${agent.name}`);
        }
    }

    // Stop an agent
    function stopAgent(agentId) {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = 'stopped';
            agent.lastUpdated = new Date();
            
            // Update the UI
            updateSummaryCards();
            updateAgentTableBasedOnFilter();
            initAgentStatesChart();
            
            console.log(`Stopped agent: ${agent.name}`);
            alert(`Stopped agent: ${agent.name}`);
        }
    }

    // Start all stopped agents
    function startAllAgents() {
        agents.forEach(agent => {
            if (agent.status === 'stopped' || agent.status === 'completed') {
                agent.status = 'running';
                agent.lastUpdated = new Date();
            }
        });
        
        updateSummaryCards();
        populateAgentTable();
        initAgentStatesChart();
        
        console.log('Started all stopped agents');
        alert('Started all stopped agents');
    }

    // Get current table filter
    function getCurrentFilter() {
        if (document.querySelector('#filter-running.active')) return 'running';
        if (document.querySelector('#filter-stopped.active')) return 'stopped';
        return 'all';
    }

    // Update agent table based on current filter
    function updateAgentTableBasedOnFilter() {
        const currentFilter = getCurrentFilter();
        populateAgentTable(currentFilter);
    }

    // Event Listeners
    document.getElementById('refresh-agents-btn')?.addEventListener('click', () => {
        // In a real app, this would fetch updated data
        updateSummaryCards();
        updateAgentTableBasedOnFilter();
        initAgentStatesChart();
        console.log('Refreshed agent data');
    });

    document.getElementById('filter-running')?.addEventListener('click', () => {
        document.getElementById('filter-running').classList.add('active');
        document.getElementById('filter-stopped').classList.remove('active');
        populateAgentTable('running');
    });

    document.getElementById('filter-stopped')?.addEventListener('click', () => {
        document.getElementById('filter-stopped').classList.add('active');
        document.getElementById('filter-running').classList.remove('active');
        populateAgentTable('stopped');
    });

    document.getElementById('close-modal')?.addEventListener('click', () => {
        document.getElementById('agent-detail-modal').classList.remove('active');
    });

    // Click outside modal to close it
    document.getElementById('agent-detail-modal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            document.getElementById('agent-detail-modal').classList.remove('active');
        }
    });

    document.getElementById('start-agent-btn')?.addEventListener('click', () => {
        const agentId = document.body.getAttribute('data-current-agent-id');
        startAgent(agentId);
    });

    document.getElementById('stop-agent-btn')?.addEventListener('click', () => {
        const agentId = document.body.getAttribute('data-current-agent-id');
        stopAgent(agentId);
    });

    // Tab navigation for charts
    document.getElementById('week-tab')?.addEventListener('click', () => {
        document.getElementById('week-tab').classList.add('active');
        document.getElementById('month-tab').classList.remove('active');
        document.getElementById('year-tab').classList.remove('active');
    });

    document.getElementById('month-tab')?.addEventListener('click', () => {
        document.getElementById('month-tab').classList.add('active');
        document.getElementById('week-tab').classList.remove('active');
        document.getElementById('year-tab').classList.remove('active');
    });

    document.getElementById('year-tab')?.addEventListener('click', () => {
        document.getElementById('year-tab').classList.add('active');
        document.getElementById('week-tab').classList.remove('active');
        document.getElementById('month-tab').classList.remove('active');
    });

    // Search functionality
    document.getElementById('agent-search')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tbody = document.getElementById('agents-table-body');
        const rows = tbody.getElementsByTagName('tr');
        
        for (let row of rows) {
            const nameCell = row.cells[0].textContent.toLowerCase();
            if (nameCell.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });

    // Initialize the dashboard
    initAgentStatesChart();
    populateAgentTable();
    updateSummaryCards();

    console.log('Agent Management Dashboard initialized');
});

// Theme switching functionality (dark/light mode)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme based on user preference or system setting
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    }
});