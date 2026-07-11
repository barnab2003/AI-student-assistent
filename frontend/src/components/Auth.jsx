import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import axios from 'axios'; // Adjust this if you use standard axios! e.g., import axios from 'axios';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { 
          email: formData.email, 
          password: formData.password 
        });
        
        // Save auth data and redirect
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');

      } else {
        // REGISTER LOGIC
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        });
        
        // Save auth data and redirect
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a2322] p-6 font-mono text-[#bac2de]">
      
      {/* Cyber-Zen Auth Card */}
      <div className="w-full max-w-md bg-[#111818] p-8 sm:p-10 rounded-2xl border border-[#313244] shadow-2xl">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 font-bold text-3xl tracking-tight mb-2">
            <img 
              src={logo} 
              alt="SmartStudy Logo" 
              className="h-14 w-auto opacity-90" 
            />
            <span className="text-[#f38ba8]">10xCS</span>
          </div>
          <p className="text-[#89dceb] font-medium text-sm mt-4 opacity-80">
            {isLogin ? 'Yours for the voyage. Welcome back.' : 'Your own workspace. Get started.'}
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="flex w-full mb-8 bg-[#1a2322] p-1.5 rounded-lg border border-[#313244]">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
              isLogin 
                ? 'bg-[#313244] text-[#f38ba8] shadow-sm' 
                : 'text-[#bac2de] hover:text-[#f38ba8] hover:bg-[#313244]/50'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${
              !isLogin 
                ? 'bg-[#313244] text-[#f38ba8] shadow-sm' 
                : 'text-[#bac2de] hover:text-[#f38ba8] hover:bg-[#313244]/50'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Field (Only show if signing up) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-[#89dceb] uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                required
                placeholder="e.g. root_user"
                className="w-full p-3 bg-[#1a2322] border border-[#313244] rounded-lg outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] text-[#bac2de] transition-all placeholder:text-[#bac2de]/40"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#89dceb] uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@host.local"
              className="w-full p-3 bg-[#1a2322] border border-[#313244] rounded-lg outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] text-[#bac2de] transition-all placeholder:text-[#bac2de]/40"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#89dceb] uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-3 bg-[#1a2322] border border-[#313244] rounded-lg outline-none focus:border-[#f38ba8] focus:ring-1 focus:ring-[#f38ba8] text-[#bac2de] transition-all placeholder:text-[#bac2de]/40"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-[#f38ba8] text-[#111818] font-bold py-3 mt-6 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : (isLogin ? 'Authenticate' : 'Initialize')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Auth;