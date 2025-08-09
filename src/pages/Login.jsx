// /src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, userInfo } = useAuth();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isSignup && !name) {
        setError('Please enter your full name.');
        return;
    }
    setError('');
    setLoading(true);

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const endpoint = isSignup ? '/api/users/register' : '/api/users/login';
      const payload = isSignup ? { name, email, password } : { email, password };
      
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload, config);
      
      login(data); // This will update the state and localStorage automatically.
      
      setLoading(false);
      navigate('/dashboard'); // Redirect to dashboard on success
      
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-light-gray flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-white grid lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Branding Panel */}
        <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-center p-12 bg-primary text-white text-center"
        >
            <Link to="/" className="font-heading text-3xl font-bold flex items-center gap-2 mb-6">
                Learn-x-AI
            </Link>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-4xl font-bold mb-4">Unlock Your Future</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-blue-100 max-w-sm">Your AI-powered career counselor is waiting to guide you.</motion.p>
        </motion.div>
        
        {/* Right Form Panel */}
        <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
                <motion.h2 
                    key={isSignup ? 'signup' : 'login'}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-3xl font-bold text-dark mb-2"
                >
                    {isSignup ? 'Create an Account' : 'Welcome Back!'}
                </motion.h2>
            </AnimatePresence>
            
            <p className="text-gray-500 mb-6">
                {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                    onClick={() => { setIsSignup(!isSignup); setError(''); }} 
                    className="font-semibold text-primary hover:underline"
                >
                    {isSignup ? 'Log In' : 'Sign Up'}
                </button>
            </p>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-semibold">{error}</div>}

            <form onSubmit={submitHandler} className="space-y-4">
                <AnimatePresence>
                    {isSignup && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" required />
                
                <button type="submit" disabled={loading} className="w-full text-center bg-primary text-white font-bold py-3.5 rounded-lg shadow-lg hover:bg-primary-dark disabled:bg-gray-400 transition-all transform hover:-translate-y-0.5">
                    {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Log In')}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Login;