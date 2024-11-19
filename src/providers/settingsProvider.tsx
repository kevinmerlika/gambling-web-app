// context/SettingsContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our settings (e.g., language, theme)
type Settings = {
  language: string;
  theme: string;
};

// Set default settings
const defaultSettings: Settings = {
  language: 'en', // Default to English
  theme: 'light', // Default to light theme
};

// Create a context
const SettingsContext = createContext<{
  settings: Settings;
  setLanguage: (lang: string) => void;
  toggleTheme: () => void;
} | undefined>(undefined);

// SettingsProvider Component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Function to change language
  const setLanguage = (lang: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      language: lang,
    }));
  };

  // Function to toggle theme
  const toggleTheme = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      theme: prevSettings.theme === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setLanguage, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
