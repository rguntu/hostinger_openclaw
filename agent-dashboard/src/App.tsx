import React from 'react';
import { GlobalProvider } from './contexts/GlobalContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <GlobalProvider>
      <div className="App bg-gray-50 dark:bg-dark-900 min-h-screen">
        <Dashboard />
      </div>
    </GlobalProvider>
  );
}

export default App;