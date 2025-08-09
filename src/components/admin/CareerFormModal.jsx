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

function CareerFormModal({ career, onSave, onClose }) {
    const { userInfo } = useAuth();
    const [formData, setFormData] = useState({ name: '', salary: '', growth: 'Medium', cluster: '', rationale: '', traits: '' });
    const isEditing = !!career;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: career.name || '',
                salary: career.salary || '',
                growth: career.growth || 'Medium',
                cluster: career.cluster || '',
                rationale: career.rationale || '',
                traits: Array.isArray(career.traits) ? career.traits.join(', ') : '', // Convert array to comma-separated string for editing
            });
        }
    }, [career]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const dataToSubmit = { ...formData, traits: formData.traits.split(',').map(t => t.trim()) }; // Convert string back to array

        try {
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/careers/${career._id}`, dataToSubmit, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/careers`, dataToSubmit, config);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save career', error);
        }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-light-gray rounded-xl shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b"><h2 className="text-xl font-bold text-dark">{isEditing ? 'Edit Career' : 'Add New Career'}</h2></div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <InputField label="Career Name" name="name" value={formData.name} onChange={handleChange} />
                            <InputField label="Salary Range (e.g., 8-20 LPA)" name="salary" value={formData.salary} onChange={handleChange} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Growth</label>
                                <select name="growth" value={formData.growth} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                    <option>Low</option><option>Medium</option><option>High</option>
                                </select>
                            </div>
                            <InputField label="Cluster (e.g., Technology)" name="cluster" value={formData.cluster} onChange={handleChange} />
                            <InputField label="Traits (comma-separated)" name="traits" value={formData.traits} onChange={handleChange} />
                            <InputField label="Rationale" name="rationale" value={formData.rationale} onChange={handleChange} />
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-xl">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark">{isEditing ? 'Update Career' : 'Save Career'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default CareerFormModal;