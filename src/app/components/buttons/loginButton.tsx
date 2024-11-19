'use client'
import React, { useState } from 'react';
import { signIn } from 'next-auth/react'; // Import signIn from NextAuth
import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  email: string;
  password: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ email, password }) => {
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const router = useRouter(); // Next.js router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation (optional)
    if (!email || !password) {
      alert('Please fill out both fields.');
      return;
    }

    setIsLoading(true); // Set loading to true when submitting

    // Use the NextAuth signIn function with the credentials provider
    try {
      const res = await signIn('credentials', {
        redirect: false, // Prevent automatic redirection
        email, // Pass email and password to the credentials provider
        password,
      });

      // Check the response and handle redirection or error
      if (res?.error) {
        alert('Invalid credentials. Please try again.');
      } else if (res?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false); // Set loading to false when the operation is complete
    }
  };

  return (
    <button
      type="submit"
      className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 relative"
      onClick={handleSubmit} // Trigger handleSubmit on button click
      disabled={isLoading} // Disable the button while loading
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin border-t-2 border-b-2 border-white rounded-full w-6 h-6"></div> {/* Spinner */}
        </div>
      ) : (
        'Login'
      )}
    </button>
  );
};

export default LoginButton;
