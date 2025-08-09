// /src/pages/Settings.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To update user info globally

// --- NEW UI Component: Settings Section Card ---
const SettingsSection = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-md"
    >
        <h3 className="text-xl font-bold text-dark mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </motion.div>
);

// --- NEW UI Component: Input Field ---
const InputField = ({ label, type, value, onChange, name }) => (
    <div>
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
        />
    </div>
);

// --- NEW UI Component: Animated Toggle Switch ---
const CustomToggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <p className="font-medium text-gray-800">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    </div>
);


function Settings() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const { userInfo, updateUserInfo } = useAuth(); // Use auth context
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notifications: { email: true, push: false }
    });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    // Fetch user's current settings on page load
    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                notifications: userInfo.settings?.notifications || { email: true, push: false }
            });
            setLoading(false);
        }
    }, [userInfo]);

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleToggleChange = (key) => {
        setFormData(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
        }));
    };

    const handleSaveChanges = async () => {
        setStatus('Saving...');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // We use the my-profile endpoint as it can update everything at once
            const { data: updatedUserData } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/my-profile`, {
                name: formData.name,
                email: formData.email,
                settings: { notifications: formData.notifications }
            }, config);
            
            // Update the global user info
            updateUserInfo(updatedUserData);

            setStatus('Saved successfully!');
            setTimeout(() => setStatus(''), 2000);
        } catch (err) {
            setStatus('Failed to save. Please try again.');
             setTimeout(() => setStatus(''), 2000);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><p>Loading settings...</p></div>;

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Settings" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <h1 className="text-4xl font-bold text-dark mb-8">Settings</h1>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {/* Account Settings */}
                        <SettingsSection title="Account">
                            <InputField label="Full Name" name="name" type="text" value={formData.name} onChange={handleInputChange} />
                            <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                        </SettingsSection>

                        {/* Notification Settings */}
                        <SettingsSection title="Notifications">
                            <CustomToggle 
                                label="Email Notifications" 
                                description="Receive reports, updates, and news."
                                checked={formData.notifications.email}
                                onChange={() => handleToggleChange('email')}
                            />
                             <CustomToggle 
                                label="Push Notifications" 
                                description="Get reminders on your mobile devices."
                                checked={formData.notifications.push}
                                onChange={() => handleToggleChange('push')}
                            />
                        </SettingsSection>
                        
                        {/* Save Button */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-end items-center gap-4">
                           {status && <span className="text-gray-600 font-medium">{status}</span>}
                            <button 
                                onClick={handleSaveChanges} 
                                className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5"
                            >
                                Save Changes
                            </button>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Settings;