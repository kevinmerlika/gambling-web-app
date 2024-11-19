import { FaGift } from 'react-icons/fa';

interface SidebarItemProps {
    icon: JSX.Element;
    label: string;
    path: string;
    isOpen: boolean;
    isActive: boolean; // New prop to check if the item is active
    handleNavigation: (e: React.MouseEvent, path: string) => void;
  }
  

const SidebarItemExclusive: React.FC<SidebarItemProps> = ({
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
        className="flex items-center py-2 px-4 text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded transition-all hover:animate-shiny hover:animate-shake"
      >
        {icon}
        <span className={`flex-1 ${isOpen ? 'block' : 'hidden'}`}>{label}</span>
      </a>
    </li>
  );
};

export default SidebarItemExclusive;
