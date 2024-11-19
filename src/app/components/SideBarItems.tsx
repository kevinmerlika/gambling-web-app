interface SidebarItemProps {
    icon: JSX.Element;
    label: string;
    path: string;
    isOpen: boolean;
    isActive: boolean; // New prop to check if the item is active
    handleNavigation: (e: React.MouseEvent, path: string) => void;
  }
  
  const SidebarItem: React.FC<SidebarItemProps> = ({
    icon,
    label,
    path,
    isOpen,
    isActive,
    handleNavigation,
  }) => {
    return (
      <li>
        <a
          href={path}
          onClick={(e) => handleNavigation(e, path)}
          className={`flex items-center px-4 py-2 text-sm rounded-md ${
            isActive ? 'bg-green-500' : 'hover:bg-gray-700'
          }`}
        >
          {icon}
          {isOpen && <span className="ml-3">{label}</span>}
        </a>
      </li>
    );
  };
  
  export default SidebarItem;
  