// /src/components/admin/BlogFormModal.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// --- FIX #1: Linking Labels to Inputs for Accessibility ---
const InputField = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input id={name} type="text" name={name} value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
    </div>
);

function BlogFormModal({ post, onSave, onClose }) {
    const { userInfo } = useAuth();
    const [formData, setFormData] = useState({ title: '', excerpt: '', category: 'Guidance', content: '', image: '' });
    const isEditing = !!post;
    
    // --- FIX #2: State for Handling Errors ---
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setFormData({
                title: post.title || '',
                excerpt: post.excerpt || '',
                category: post.category || 'Guidance',
                content: post.content || '',
                image: post.image || '',
            });
        }
    }, [post]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear previous errors
        
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        try {
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/blog/posts/${post._id}`, formData, config);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/blog/posts`, formData, config);
            }
            onSave(); // This closes the modal and refreshes the list on the parent page
        } catch (err) {
            // --- FIX #2: Displaying the Error to the User ---
            const message = err.response?.data?.message || 'Failed to save the post. Please try again.';
            setError(message);
            console.error('Failed to save post', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-light-gray rounded-xl shadow-xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b"><h2 className="text-xl font-bold text-dark">{isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}</h2></div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <InputField label="Post Title" name="title" value={formData.title} onChange={handleChange} />
                            <TextAreaField label="Excerpt (Short Summary)" name="excerpt" value={formData.excerpt} onChange={handleChange} />
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select id="category" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                                    <option>Guidance</option><option>Career Advice</option><option>Exam Prep</option>
                                </select>
                            </div>
                            <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} />
                            <TextAreaField label="Full Content (Markdown supported)" name="content" value={formData.content} onChange={handleChange} rows={10} />
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-xl">
                            {error && <p className="self-center mr-auto text-red-600 font-semibold">{error}</p>}
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button type="submit" disabled={loading} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                                {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Save Post')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default BlogFormModal;