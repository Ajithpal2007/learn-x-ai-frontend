
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainNavLinks = [
  { to: "/dashboard", icon: "📊", text: "Dashboard" },
  { to: "/learning-dashboard", icon: "📈", text: "My Learning" },
  { to: "/assessments", icon: "📝", text: "Assessments" },
  { to: "/career-matches", icon: "🎯", text: "Career Matches" },
  { to: "/my-roadmap", icon: "🗺️", text: "My Roadmap" },
  { to: "/ai-chatbot", icon: "🤖", text: "AI Chatbot" },
  { to: "/exploration-hub", icon: "🚀", text: "Exploration Hub" },
  { to: "/explore-colleges", icon: "🏛️", text: "Explore Colleges" }, 
  { to: "/saved-items", icon: "⭐", text: "Saved Items" },
  { to: "/skill-building", icon: "🛠️", text: "Skill Building" },
   { to: "/entrepreneurship-hub", icon: "💡", text: "Entrepreneurship" },
   { to: "/vocational-training", icon: "🔧", text: "Vocational" }, 
  { to: "/webinars", icon: "📺", text: "Webinars" }, 
  { to: "/find-a-mentor", icon: "🤝", text: "Find a Mentor" },
  { to: "/resource-library", icon: "📚", text: "Resources" },
  { to: "/entrance-exams", icon: "✍️", text: "Entrance Exams" }, 
  { to: "/board-exam-prep", icon: "📚", text: "Board Prep" }, 
  { to: "/india-databases", icon: "🇮🇳", text: "India Databases" },
  { to: "/ai-tools", icon: "🤖", text: "AI Tools" },
  { to: "/community", icon: "👥", text: "Community" },
  { to: "/blog", icon: "📰", text: "Blog" },

];

const secondaryNavLinks = [
  { to: "/profile-guidance", icon: "👤", text: "Profile Guidance" },
  { to: "/settings", icon: "⚙️", text: "Settings" },
];

function Sidebar({ isOpen }) {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) => 
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-base ${
      isActive 
      ? 'bg-primary/10 text-primary font-bold' 
      : 'text-gray-600 hover:bg-gray-100 font-medium'
    }`;

  return (
    <aside 
      className={`fixed top-0 left-0 w-64 h-full bg-white text-gray-800 flex flex-col shadow-lg z-40 transform transition-transform duration-300 ease-in-out 
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                 lg:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200 flex-shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-extrabold text-xl">A</div>
          <span className="font-heading text-2xl font-bold text-primary">Learn-x-AI</span>
        </Link>
      </div>
      
      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {mainNavLinks.map(link => (
          <NavLink key={link.to} to={link.to} className={navLinkClasses}>
            <span className="text-xl w-6 text-center">{link.icon}</span>
            <span>{link.text}</span>
          </NavLink>
        ))}

        {userInfo && userInfo.isAdmin && (
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
             <h3 className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-gray-500">Admin Panel</h3>
             <NavLink to="/admin/dashboard" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">📊</span>
                <span>Dashboard</span>
             </NavLink>
             <NavLink to="/admin/users" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">👥</span>
                <span>Manage Users</span>
             </NavLink>
             <NavLink to="/admin/colleges" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">🏛️</span>
                <span>Manage Colleges</span>
             </NavLink>
             <NavLink to="/admin/careers" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">💼</span>
                <span>Manage Careers</span>
             </NavLink>
             <NavLink to="/admin/scholarships" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">🏆</span>
                <span>Manage Scholarships</span>
             </NavLink>
             <NavLink to="/admin/webinars" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">📺</span>
                <span>Manage Webinars</span>
             </NavLink>
             <NavLink to="/admin/submissions" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">📨</span>
                <span>Manage Submissions</span>
             </NavLink>
              <span className="text-xl w-6 text-center">📰</span>
             <NavLink to="/admin/blog" className={navLinkClasses}>
                <span className="text-xl w-6 text-center">📰</span>
                <span>Manage Blog</span>
             </NavLink>
          </div>
        )}
      </nav>
      
      {/* Footer Links */}
      <div className="px-4 py-4 mt-auto border-t border-gray-200 space-y-1">
        {secondaryNavLinks.map(link => (
          <NavLink key={link.to} to={link.to} className={navLinkClasses}>
            <span className="text-xl w-6 text-center">{link.icon}</span>
            <span>{link.text}</span>
          </NavLink>
        ))}
        <div className="pt-2">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-500 font-semibold hover:bg-red-50 transition-colors">
                <span className="text-xl w-6 text-center">🚪</span>
                <span>Logout</span>
            </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;