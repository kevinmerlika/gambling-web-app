type SidebarHeaderProps = {
  isOpen: boolean;
  handleToggle: () => void;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isOpen, handleToggle }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-700">
      {/* Title: Show only when sidebar is open */}
      <h2 className={`text-lg font-semibold ${isOpen ? 'block' : 'hidden'}`}>
        Menu
      </h2>

      {/* Toggle Button: Inside the sidebar */}
      <button
        onClick={handleToggle}
        className="p-2 bg-darkGreen text-white rounded flex items-center justify-center"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'} // Accessibility improvement
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg> // Close (X) icon for mobile
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg> // Hamburger (Open) icon for mobile
        )}
      </button>
    </div>
  );
};

export default SidebarHeader;
