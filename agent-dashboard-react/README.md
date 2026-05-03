# Agent Dashboard with OpenClaw Gateway Monitoring

A modern, reactive dashboard for monitoring agents and OpenClaw gateway status with comprehensive metrics and controls.

## Features

### Agent Management
- **Live Agent Status**: Monitor all agents with color-coded status indicators
- **Detailed Agent Information**: View comprehensive agent details including metrics, versions, and performance
- **Control Capabilities**: Start/stop certain agents directly from the dashboard
- **Filtering & Sorting**: Filter agents by status and search by name/type
- **Task Metrics**: Track processed items, success rates, and completion statistics

### OpenClaw Gateway Monitoring
- **Gateway Status**: Real-time gateway status (online, sleeping, offline)
- **Task Tracking**: Monitor current tasks and their completion status
- **Success/Failure Trends**: Visualize success and failure rates over time
- **Performance Monitoring**: Track CPU and memory usage
- **Activity Log**: View activity timeline with timestamps and results
- **Mac Sleep Awareness**: Special indicators for macOS sleep behavior that affects OpenClaw

### UI/UX Features
- **Dark/Light Mode**: Toggle between themes as preferred
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean interface with Tailwind CSS styling
- **Interactive Components**: Intuitive controls and visual feedback
- **Charts**: Time-series charts for performance trend analysis

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Chart.js** with react-chartjs-2 for data visualization
- **Headless UI** for accessible dialogs
- **Heroicons** for icons
- **Vite** for fast bundling and development

## Setup & Installation

### 1. Clone the repository
```bash
cd agent-dashboard-react
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Access the dashboard
Open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal).

## Usage

1. **View Agent Status**: 
   - Check the "Agents" section to see all available agents
   - Green, red, or blue status indicators show running, stopped, or completed status
   - Hover over status dots for detailed hover descriptions

2. **Monitor Gateway Status**:
   - Check OpenClaw Gateway card for current status
   - Monitor tasks, successful completions, and failures
   - Look for macOS sleep awareness indicator if on Mac
   - Click "Refresh" to update gateway information

3. **Analyze Performance**:
   - Review the success/failure trends chart
   - Check agent-specific metrics in the table
   - Use the StatsCards to view summary information quickly

4. **Control Agents**:
   - Click the eye icon to view detailed agent information
   - Use play/stop icons to start or stop controllable agents
   - Apply filters to narrow down the agent list

## Dashboard Structure

- **Header**: Contains dashboard title and theme toggle
- **Gateway Status Card**: Shows OpenClaw gateway status with special Mac sleep awareness
- **Statistics Cards**: Shows key metrics including gateway success rate
- **Trend Charts**: Visualize success and failure rates over time  
- **Agent Table**: Complete listing of agents with search and filter capabilities
- **Agent Detail Modal**: Expands to show detailed agent information

## Special Considerations for Mac Users

This dashboard includes specific detection and awareness of macOS sleep behaviors that can affect OpenClaw operation. When the OpenClaw gateway is detected as "sleeping" (a common occurrence on Mac laptops), the dashboard will:
- Clearly indicate the sleeping state
- Suggest refreshing when needed to wake the gateway
- Continue monitoring other metrics while gateway is sleeping
- Track tasks when the gateway becomes active again

## Customization

The dashboard can be easily customized:

1. **Theme**: Add custom color schemes in `src/tailwind.config.js`
2. **Components**: Modify existing components in `src/components/`
3. **Metrics**: Update monitored fields by editing agent definitions
4. **Integrations**: Connect to your actual gateway and agent APIs instead of mock data

## API Integration Notes

The current dashboard uses mock data. To connect to real endpoints, you would need to:

1. Replace mock API calls in `src/App.tsx`
2. Update the data structures to match your API responses
3. Implement real authentication for dashboard access
4. Configure endpoint URLs in the code

## File Structure

```
src/
├── components/           # React components
│   ├── Header.tsx        # Dashboard header
│   ├── StatsCards.tsx    # Statistics cards
│   ├── AgentDataTable.tsx # Agent listing table
│   ├── AgentDetailModal.tsx # Detailed agent information
│   └── GatewayStatus.tsx  # OpenClaw gateway monitoring
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css          # Global styles
```

## Performance Notes

The dashboard is optimized to:
- Efficiently handle large agent lists with virtualizing or pagination
- Update metrics in real-time without slowing down UI
- Respect browser resources while updating frequently
- Provide smooth transitions and animations

## Security Considerations

- Production deployment requires authentication
- API endpoints need proper authentication/authorization
- Sensitive gateway and agent information requires proper access control
- Client-side data should be protected if it contains sensitive information

## Development

We welcome contributions! To contribute:
1. Fork the repository
2. Create a branch for your changes
3. Submit a pull request with detailed changes