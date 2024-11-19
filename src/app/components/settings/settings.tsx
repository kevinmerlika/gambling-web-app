'use client';  // Make this a Client Component
import { useEffect } from 'react';

export default function Configurations() {
  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
    } else {
      document.body.classList.add('light'); // Default theme is light
    }
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.classList.remove(currentTheme);
    document.body.classList.add(newTheme);

    // Save the theme preference in localStorage
    localStorage.setItem('theme', newTheme);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    // Here you can implement the logic to switch languages (e.g., via i18n libraries)
    console.log('Language selected:', selectedLanguage);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      {/* Language Selector */}
      <div className="mb-4">
        <label htmlFor="language" className="block text-sm font-semibold">Language</label>
        <select
          id="language"
          className="mt-1 p-2 border rounded-md"
          onChange={handleLanguageChange} // Add language change handling here
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center space-x-3">
        <label className="text-sm font-semibold">Theme:</label>
        <button
          onClick={toggleTheme} // This is now allowed in a Client Component
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Toggle Light/Dark Theme
        </button>
      </div>
    </div>
  );
}
