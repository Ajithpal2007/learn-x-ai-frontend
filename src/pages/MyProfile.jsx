// /src/pages/MyProfile.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import axios from 'axios';

// --- UI Component: Reusable Input Field ---
const InputField = ({ label, name, value, onChange, type = 'text', parent }) => (
    <div>
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value || ''} 
            onChange={(e) => onChange(parent, e)} 
            className="font-semibold w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-3 outline-none focus:border-primary transition-colors"
        />
    </div>
);

// --- UI Component: Reusable Section Card ---
const ProfileSection = ({ title, children, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-md"
    >
        <h3 className="text-xl font-bold text-dark mb-6">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </motion.div>
);


function MyProfile() {
    const { userInfo, updateUserInfo } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState(''); // Can be '', 'Saving...', 'Saved!', 'Failed'
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('/default-avatar.png');
    const fileInputRef = useRef(null);

    // Populate form with user data on load
    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                email: userInfo.email || '',
                personalInfo: userInfo.personalInfo || {},
                educationalInfo: userInfo.educationalInfo || {},
            });
            if (userInfo.profilePictureUrl) {
                setImagePreview(`http://localhost:5000${userInfo.profilePictureUrl}`);
            }
        }
        setLoading(false);
    }, [userInfo]);

    const handleInputChange = (section, e) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(p => ({ ...p, [section]: { ...p[section], [name]: value } }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { 
            setImageFile(file); 
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    const handleSaveChanges = async () => {
        setSaveStatus('Saving...');
        try {
            let dataToSave = { ...formData };
            // 1. If there's a new image, upload it first
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);
                const uploadConfig = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
                const { data: uploadData } = await axios.post('http://localhost:5000/api/upload', uploadFormData, uploadConfig);
                dataToSave.profilePictureUrl = uploadData.image;
            }
            
            // 2. Save all the user data
            const saveConfig = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data: updatedUserData } = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/my-profile`, dataToSave, saveConfig);
            
            // 3. Update the global context and local storage with the latest data
            updateUserInfo(updatedUserData);

            setSaveStatus('Saved!');
        } catch (err) { 
            setSaveStatus('Failed');
        } finally {
            setTimeout(() => setSaveStatus(''), 2500);
        }
    };
  
    if (loading || !formData) return <div className="flex h-screen items-center justify-center"><p>Loading profile...</p></div>;

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="My Profile" onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {/* --- Redesigned Header Section --- */}
                    <motion.section 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-col md:flex-row items-center gap-6"
                    >
                        <div className="relative">
                            <img src={imagePreview} alt="User Avatar" className="w-24 h-24 rounded-full shadow-lg object-cover" />
                            <button onClick={() => fileInputRef.current.click()} className="absolute -bottom-1 -right-1 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow hover:bg-primary-dark transition-all">✏️</button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <input type="text" name="name" value={formData.name} onChange={(e) => handleInputChange(null, e)} className="text-3xl font-bold text-dark w-full bg-transparent focus:outline-none focus:bg-gray-100 rounded p-1" />
                            <p className="text-gray-500">{formData.email}</p>
                        </div>
                        <button onClick={handleSaveChanges} disabled={saveStatus === 'Saving...'} className="bg-primary text-white font-semibold py-2 px-8 rounded-lg hover:bg-primary-dark disabled:bg-gray-400 transition-colors w-full md:w-auto">
                           {saveStatus === 'Saving...' ? 'Saving...' : saveStatus === 'Saved!' ? 'Saved!' : saveStatus === 'Failed' ? 'Retry' : 'Save Changes'}
                        </button>
                    </motion.section>

                    {/* --- Main Content Grid --- */}
                    <div className="space-y-8">
                        <ProfileSection title="Personal Information" delay={0.1}>
                            <InputField type="date" label="Date of Birth" name="dateOfBirth" value={formData.personalInfo.dateOfBirth?.split('T')[0]} onChange={handleInputChange} parent="personalInfo" />
                            <InputField label="Location" name="location" value={formData.personalInfo.location} onChange={handleInputChange} parent="personalInfo" />
                            <InputField label="Contact Number" name="contact" value={formData.personalInfo.contact} onChange={handleInputChange} parent="personalInfo" />
                            <InputField label="Gender" name="gender" value={formData.personalInfo.gender} onChange={handleInputChange} parent="personalInfo" />
                        </ProfileSection>

                        <ProfileSection title="Educational Information" delay={0.2}>
                            <InputField label="Current Grade/Year" name="grade" value={formData.educationalInfo.grade} onChange={handleInputChange} parent="educationalInfo" />
                            <InputField label="Stream/Major" name="stream" value={formData.educationalInfo.stream} onChange={handleInputChange} parent="educationalInfo" />
                            <InputField label="School/College Name" name="school" value={formData.educationalInfo.school} onChange={handleInputChange} parent="educationalInfo" />
                            <InputField label="Board/University" name="board" value={formData.educationalInfo.board} onChange={handleInputChange} parent="educationalInfo" />
                        </ProfileSection>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MyProfile;