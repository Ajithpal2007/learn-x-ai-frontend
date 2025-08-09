import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const InputField = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
    </div>
);

function ScholarshipFormModal({ scholarship, onSave, onClose }) {
    const { userInfo } = useAuth();
    const [formData, setFormData] = useState({ name: '', provider: 'Government', eligibility: '', field: '', amount: '', deadline: '' });
    const isEditing = !!scholarship;

    useEffect(() => {
        if (isEditing) {
            const formattedDeadline = scholarship.deadline ? new Date(scholarship.deadline).toISOString().split('T')[0] : '';
            setFormData({
                name: scholarship.name || '',
                provider: scholarship.provider || 'Government',
                eligibility: scholarship.eligibility || '',
                field: scholarship.field || '',
                amount: scholarship.amount || '',
                deadline: formattedDeadline
            });
        }
    }, [scholarship]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        try {
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/scholarships/${scholarship._id}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/scholarships`, formData, config);
            }
            onSave();
        } catch (error) { console.error('Failed to save scholarship', error); }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-light-gray rounded-xl shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b"><h2 className="text-xl font-bold text-dark">{isEditing ? 'Edit Scholarship' : 'Add New Scholarship'}</h2></div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <InputField label="Scholarship Name" name="name" value={formData.name} onChange={handleChange} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Provider</label>
                                <select name="provider" value={formData.provider} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                                    <option>Government</option><option>Private</option>
                                </select>
                            </div>
                            <InputField label="Eligibility" name="eligibility" value={formData.eligibility} onChange={handleChange} />
                            <InputField label="Field (e.g., Science, All)" name="field" value={formData.field} onChange={handleChange} />
                            <InputField label="Amount" name="amount" value={formData.amount} onChange={handleChange} />
                            <InputField label="Deadline" name="deadline" value={formData.deadline} onChange={handleChange} type="date" />
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-xl">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">{isEditing ? 'Update Scholarship' : 'Save Scholarship'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ScholarshipFormModal;

