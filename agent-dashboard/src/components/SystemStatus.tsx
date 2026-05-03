import React, { useState } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { FaCheck, FaExclamationTriangle, FaTimes, FaRedo, FaDesktop } from 'react-icons/fa';

const SystemStatus: React.FC = () => {
  const { services, updateServiceStatus } = useGlobal();
  const [checking, setChecking] = useState(false);

  const getIndicatorColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 dark:text-green-400';
      case 'stopped': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'running': return <FaCheck className="text-green-600 dark:text-green-400 mr-2" />;
      case 'stopped': return <FaTimes className="text-red-600 dark:text-red-400 mr-2" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 mr-2" />;
      case 'error': return <FaTimes className="text-red-600 dark:text-red-400 mr-2" />;
      default: return <FaDesktop className="text-gray-600 dark:text-gray-400 mr-2" />;
    }
  };

  const checkOpenClawStatus = async () => {
    setChecking(true);
    
    // Simulate checking OpenClaw status
    // In a real implementation, this would make an API call to check the actual service status
    setTimeout(() => {
      // Randomly determine status for demo purposes
      // In reality, we'd attempt to connect to the OpenClaw API/service
      const statuses: Array<'running' | 'stopped' | 'warning' | 'error'> = ['running', 'stopped', 'warning', 'error'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      let details = '';
      if (randomStatus === 'running') {
        details = 'Service operational and connected.';
      } else if (randomStatus === 'stopped') {
        details = 'Service is not running. May be affected by Sleep/Hibernation.';
      } else if (randomStatus === 'warning') {
        details = 'Service connectivity intermittent. Check Mac Sleep Settings.';
      } else {
        details = 'Failed to contact service. Check Mac Sleep Settings.';
      }
      
      updateServiceStatus('OpenClaw', randomStatus, details);
      setChecking(false);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
          <FaDesktop className="mr-2 text-primary-500" /> System Status
        </h2>
        <button
          onClick={checkOpenClawStatus}
          disabled={checking}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
            checking 
              ? 'bg-gray-200 dark:bg-dark-700 text-gray-500 cursor-not-allowed' 
              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50'
          } transition-colors`}
        >
          <FaRedo className={`mr-1 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      <div className="space-y-4">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border-l-4 ${
              service.status === 'running' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
              service.status === 'stopped' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
              service.status === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
              'border-red-600 bg-red-100 dark:bg-red-900/20'
            }`}
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${getIndicatorColor(service.status)}`}></div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{service.name}</h3>
              </div>
              <span className={`text-sm font-medium ${getTextColor(service.status)}`}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>
            
            <div className="mt-2 ml-6">
              {service.details && (
                <p className="text-sm text-gray-600 dark:text-gray-300">{service.details}</p>
              )}
              
              {service.name === 'OpenClaw' && (
                <div className="mt-3 text-sm">
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Mac Sleep Issue:</div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                    <li>iOS/macOS computers often hibernate, causing OpenClaw connections to fail</li>
                    <li>If having connection issues, check System Preferences → Energy Saver settings</li>
                    <li>Consider adjusting power management settings to prevent deep sleep</li>
                    <li>To check connection: <code className="bg-gray-100 dark:bg-dark-700 px-1 rounded">openclaw gateway status</code></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;