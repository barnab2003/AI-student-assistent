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
    <div className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
      
      {/* Brutalist Auth Card */}
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)]">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-3 font-black text-3xl tracking-tight text-black mb-2">
            <img 
              src={logo} 
              alt="SmartStudy Logo" 
              className="h-14 w-auto " 
            />
            <span>10x.CS</span>
          </div>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-sm mt-4">
            {isLogin ? 'Welcome back.' : 'Start your journey.'}
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="flex w-full mb-8 bg-gray-100 p-1.5 rounded-2xl border-2 border-black">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all ${
              isLogin 
                ? 'bg-[#B9FF66] text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                : 'text-gray-500 hover:text-black border-2 border-transparent'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all ${
              !isLogin 
                ? 'bg-[#B9FF66] text-black border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                : 'text-gray-500 hover:text-black border-2 border-transparent'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-black rounded-xl text-red-600 font-bold text-sm text-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            {error}
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Field (Only show if signing up) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                required
                placeholder="e.g. CodeNinja99"
                className="w-full p-4 border-2 border-black rounded-xl outline-none focus:ring-4 focus:ring-[#B9FF66] text-black font-medium transition-all"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-black text-black uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full p-4 border-2 border-black rounded-xl outline-none focus:ring-4 focus:ring-[#B9FF66] text-black font-medium transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-black text-black uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 border-2 border-black rounded-xl outline-none focus:ring-4 focus:ring-[#B9FF66] text-black font-medium transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-black text-[#B9FF66] border-2 border-black font-black text-lg py-4 mt-4 rounded-xl shadow-[6px_6px_0px_rgba(185,255,102,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(185,255,102,1)] disabled:bg-gray-800 disabled:shadow-none transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={24} /> : (isLogin ? 'Enter' : 'Create Account')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Auth;