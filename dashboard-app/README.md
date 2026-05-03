# Agent Management Dashboard

A sleek, responsive agent management dashboard built with modern web technologies featuring:
- Real-time agent monitoring with status tracking
- Agent lifecycle controls (start/stop)
- Detailed agent information panels
- Performance metrics and statistics
- Responsive design for desktop and mobile
- Clean UI with modern aesthetics
- Interactive navigation components
- Lightweight implementation without frameworks

## Features

- **Agent Monitoring**: Real-time tracking of agent status and health
- **Lifecycle Management**: Start, stop, and control individual agents
- **Detailed Metrics**: Complete performance and efficiency metrics
- **Responsive Layout**: Works on desktops tablets and mobile devices
- **Interactive Charts**: Visual representation of agent states and trends
- **Modern UI**: Clean design with appropriate spacing and typography
- **Fast Performance**: Optimized loading and rendering
- **Dark/Light Mode**: Adapts to system preference

## Technologies Used

- **HTML5**: Semantic markup for the dashboard layout
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: Vanilla ES6 for interactions and chart functionality
- **Chart.js**: Interactive data visualization
- **Font Awesome**: Vector icons for a polished look
- **BEM Methodology**: Organized CSS architecture

## Getting Started

### Installation

1. Clone this repository or copy the dashboard files
2. Make sure you have Node.js installed
3. Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

This will launch the dashboard at http://localhost:8080 with auto-opening of the browser

Or simply serve the `/public` directory using any HTTP server of your choice.

## Project Structure

```
dashboard-app/
├── public/
│   ├── index.html          # Main application file
├── src/
│   ├── app.js              # Main JavaScript functionality
│   ├── styles/
│   │   └── main.css        # CSS stylesheet
├── package.json           # Project configuration
└── README.md              # Documentation file
```

## Key Components

### Dashboard Widgets
- Agent count cards with trend indicators
- Running agents counter 
- Active tasks tracker
- Average runtime metrics

### Agent Management Components
- Agent states dashboard visualizations
- Agent status breakdown graphs
- Interactive agent control table
- Modal detail view for agents
- Lifecycle control buttons (start/stop)
- Search and filtering functionality

### Responsive Design
The dashboard gracefully adapts to different screen sizes:
- Desktop: Full two-column layout
- Tablet: Adjusted grid for medium screens
- Mobile: Stacked elements for optimal viewing

## Extending the Dashboard

The dashboard is designed for easy extensibility. You can add additional widgets, modify the layout, or extend the chart functionality following the existing patterns.

### Adding New Widgets
1. Create new card element in the HTML
2. Apply appropriate CSS classes for styling
3. Add interactive functionality in `app.js`

### Customization Options
- Modify color palette in CSS variables
- Update dashboard datasets in JavaScript
- Customize the agent display layout
- Extend with additional agent types
- Add new metric visualizations
- Integrate with backend APIs
- Add automated actions based on conditions

## Browser Compatibility

The dashboard supports modern browsers (Chrome, Firefox, Safari, Edge) and follows current web standards. It uses CSS Grid and Flexbox which are widely supported in all current browsers.

## Deployment

To deploy:
1. Upload `public/` directory contents to your web server
2. Ensure assets are served correctly
3. Test responsiveness on different devices

Note: This dashboard currently uses mock data. To make it fully functional, connect the JavaScript methods to your actual agent management backend.

No server-side requirements needed for the frontend; can be deployed as static files.

## License

MIT License - feel free to modify and adapt as needed.