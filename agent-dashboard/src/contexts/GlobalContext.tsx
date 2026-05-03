import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Service {
  name: string;
  status: 'running' | 'stopped' | 'warning' | 'error';
  lastChecked: Date;
  details?: string;
  requiresAttention?: boolean;
}

interface GlobalContextType {
  services: Service[];
  updateServiceStatus: (serviceName: string, status: Service['status'], details?: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([
    {
      name: 'OpenClaw',
      status: 'warning', // Default to warning to prompt user to check status
      lastChecked: new Date(),
      details: 'Not yet checked. May be affected by Sleep/Hibernation.',
      requiresAttention: true
    }
  ]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference and saved preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme class to document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const updateServiceStatus = (serviceName: string, status: Service['status'], details?: string) => {
    setServices(prev => 
      prev.map(service => {
        if (service.name === serviceName) {
          return {
            ...service,
            status,
            lastChecked: new Date(),
            details,
            requiresAttention: status === 'error' || status === 'warning'
          };
        }
        return service;
      })
    );
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <GlobalContext.Provider value={{ services, updateServiceStatus, theme, toggleTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};