# Agent Dashboard

A modern React dashboard application for monitoring and managing agent instances with TypeScript, Tailwind CSS, and Chart.js.

## Features

- **Real-time Monitoring**: View agent status, performance metrics, and activity
- **Interactive Charts**: Visualize agent data with beautiful charts using Chart.js
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes based on preference
- **Agent Management**: Start/stop agents directly from the dashboard
- **Detailed Views**: View comprehensive details for individual agents
- **Modern UI**: Clean, professional dashboard design with aesthetic appeal

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Chart.js (via react-chartjs-2)
- React Icons

## Getting Started

### Prerequisites

- Node.js version 16 or higher
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open your browser to [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (irreversible)

## Folder Structure

- `src/components/` - React components for the dashboard
- `src/contexts/` - React context providers (e.g., theme context)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions and helpers
- `public/` - Static assets such as HTML files

## Components

### Dashboard
The main dashboard view showing aggregate agent statistics and visualizations.

### AgentTable
Displays a table of all agents with filtering, sorting, and action capabilities.

### AgentCharts
Interactive charts visualizing agent data including status distribution, performance metrics, and task processing.

### AgentDetailsModal
A modal providing detailed information about a selected agent.

### Header
Application header with controls for refresh and theme switching.

## Design Elements

- Responsive grid layouts that adapt to screen size
- Card-based UI for organized content presentation
- Interactive charts with tooltips and legends
- Consistent color palette with accessibility considerations
- Dark/light mode with smooth transitions
- Loading states and empty states for better UX

## Customization

You can customize the appearance by modifying:
- Tailwind configuration in `tailwind.config.js`
- Colors and spacing in the theme context
- Typography and styles in component files

## License

This project is open-source and available under the MIT License.