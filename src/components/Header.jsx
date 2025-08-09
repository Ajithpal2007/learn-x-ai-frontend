// /src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header({ title = "Dashboard", onToggleSidebar }) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between z-30 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
        </button>
        <h1 id="page-title" className="text-xl font-bold text-dark">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
            <img 
              src={userInfo?.profilePictureUrl ? `${import.meta.env.VITE_API_URL}${userInfo.profilePictureUrl}` : '/default-avatar.png'} 

              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <span className="hidden md:block font-semibold text-gray-700">
              {userInfo ? userInfo.name : 'User'}
            </span>
          </button>
          
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border">
              <Link to="/my-profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-light-gray">My Profile</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;