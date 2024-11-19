// SignOut.tsx
'use client'
import { signOut } from "next-auth/react";
import { MouseEventHandler } from "react";

type SignOutProps = {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  handleSignOut: MouseEventHandler<HTMLButtonElement>;
};

const SignOut: React.FC<SignOutProps> = ({ label, icon, isOpen, handleSignOut }) => {
  return (
    <button
      onClick={handleSignOut}
      className="flex items-center py-2 px-4 text-white hover:bg-red-600 rounded transition-colors"
    >
      {icon}
      {isOpen && <span className="ml-2">{label}</span>}
    </button>
  );
};

export default SignOut;
