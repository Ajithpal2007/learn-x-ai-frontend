import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const InputField = ({ label, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input type="text" name={name} value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
    </div>
);

function WebinarFormModal({ webinar, onSave, onClose }) {
    const { userInfo } = useAuth();
    const [formData, setFormData] = useState({ title: '', speaker: '', image: '', status: 'Upcoming', recordingUrl: '' });
    const isEditing = !!webinar;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                title: webinar.title || '',
                speaker: webinar.speaker || '',
                image: webinar.image || '',
                status: webinar.status || 'Upcoming',
                recordingUrl: webinar.recordingUrl || ''
            });
        }
    }, [webinar]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        try {
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/webinars/${webinar._id}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/webinars`, formData, config);
            }
            onSave();
        } catch (error) { console.error('Failed to save webinar', error); }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-light-gray rounded-xl shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b"><h2 className="text-xl font-bold text-dark">{isEditing ? 'Edit Webinar' : 'Add New Webinar'}</h2></div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <InputField label="Webinar Title" name="title" value={formData.title} onChange={handleChange} />
                            <InputField label="Speaker Name" name="speaker" value={formData.speaker} onChange={handleChange} />
                            <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                                    <option>Upcoming</option><option>Past</option>
                                </select>
                            </div>
                            <InputField label="Recording URL (if Past)" name="recordingUrl" value={formData.recordingUrl} onChange={handleChange} />
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-xl">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">{isEditing ? 'Update Webinar' : 'Save Webinar'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default WebinarFormModal;