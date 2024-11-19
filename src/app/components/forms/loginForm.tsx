'use client'
import React, { useState } from 'react';
import LoginButton from '../buttons/loginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-700">
      <div className="bg-darkGreen p-10 rounded-3xl shadow-2xl w-full sm:w-96 transform transition-all hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-lightGreen mb-8">Login to Play</h2>
        
        <form className="space-y-6">
          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="absolute -top-4 left-4 text-sm font-semibold text-lightGreen transition-all">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 mt-2 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-lightGreen transition duration-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="absolute -top-4 left-4 text-sm font-semibold text-lightGreen transition-all">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 mt-2 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-lightGreen transition duration-200"
              placeholder="Enter your password"
            />
          </div>

          {/* Login Button */}
          <div>
            <LoginButton email={email} password={password} />
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <a href="/register" className="text-lightGreen hover:text-teal-300 font-semibold text-lg transition-all">
            Don't have an account? <span className="underline">Register here</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
