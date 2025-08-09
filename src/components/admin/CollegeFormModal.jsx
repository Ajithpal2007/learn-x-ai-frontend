// /src/components/admin/CollegeFormModal.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const InputField = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
    </div>
);

function CollegeFormModal({ college, onSave, onClose }) {
    const { userInfo } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        stream: '',
        nirf_ranking: '',
        fees: '',
        websiteUrl: ''
    });

    const isEditing = !!college; // Determine if we are editing or creating

    useEffect(() => {
        // If we are editing, populate the form with the college's data
        if (isEditing) {
            setFormData({
                name: college.name || '',
                location: college.location || '',
                stream: college.stream || '',
                nirf_ranking: college.nirf_ranking || '',
                fees: college.fees || '',
                websiteUrl: college.websiteUrl || ''
            });
        } else {
            // If creating, reset the form
            setFormData({ name: '', location: '', stream: '', nirf_ranking: '', fees: '', websiteUrl: '' });
        }
    }, [college]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        try {
            if (isEditing) {
                // Update existing college
                await axios.put(`${import.meta.env.VITE_API_URL}/api/colleges/${college._id}`, formData, config);
            } else {
                // Create new college
                await axios.post(`${import.meta.env.VITE_API_URL}/api/colleges`, formData, config);
            }
            onSave(); // This tells the parent component to refetch data and close the modal
        } catch (error) {
            console.error('Failed to save college', error);
            // Here you could add an error message to the user
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
                onClick={onClose} // Close modal on backdrop click
            >
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-light-gray rounded-xl shadow-xl w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold text-dark">{isEditing ? 'Edit College' : 'Add New College'}</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <InputField label="College Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., IIT Bombay" />
                            <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Mumbai, Maharashtra" />
                            <InputField label="Stream" name="stream" value={formData.stream} onChange={handleChange} placeholder="e.g., Engineering" />
                            <InputField label="NIRF Ranking" name="nirf_ranking" value={formData.nirf_ranking} onChange={handleChange} placeholder="e.g., 3" />
                            <InputField label="Average Fees" name="fees" value={formData.fees} onChange={handleChange} placeholder="e.g., ₹2.2 Lakhs/yr" />
                            <InputField label="Website URL" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="e.g., https://www.iitb.ac.in/" />
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-xl">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">
                                {isEditing ? 'Update College' : 'Save College'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default CollegeFormModal;