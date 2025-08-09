// /src/pages/admin/AdminBlog.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import BlogFormModal from '../../components/admin/BlogFormModal';

function AdminBlog() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo } = useAuth();
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    // --- FULLY IMPLEMENTED FETCH FUNCTION ---
    const fetchPosts = async () => {
        setLoading(true);
        setError('');
        try {
            // No token needed for public GET, but good practice for admin view
            const { data } = await axios.get('http://localhost:5000/api/blog/posts');
            setPosts(data);
        } catch (error) {
            setError('Failed to fetch blog posts.');
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- FIX: Correctly call fetchPosts when userInfo is available ---
    useEffect(() => {
        // We fetch posts regardless, but checking userInfo is good practice
        // if you were to have protected fetching in the future.
        fetchPosts();
    }, []);

    // --- FULLY IMPLEMENTED DELETE FUNCTION ---
    const handleDelete = async (idToDelete) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/blog/posts/${idToDelete}`, config);
                // On success, refetch the posts to update the list
                fetchPosts();
            } catch (error) {
                setError('Failed to delete post. Please try again.');
                console.error("Delete Error:", error);
            }
        }
    };

    const handleOpenModal = (post = null) => { setEditingPost(post); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingPost(null); setIsModalOpen(false); };
    const handleSave = () => { handleCloseModal(); fetchPosts(); };

    return (
        <div className="flex h-screen bg-light-gray">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <Header title="Admin: Manage Blog" onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-dark">Blog Post Management</h1>
                        <button onClick={() => handleOpenModal()} className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-dark shadow"> + Add New Post </button>
                    </div>
                    {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Title</th>
                                    <th className="p-4 font-semibold text-gray-600">Category</th>
                                    <th className="p-4 font-semibold text-gray-600">Author</th>
                                    <th className="p-4 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr>
                                ) : (
                                    posts.map(post => (
                                        <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4 font-semibold">{post.title}</td>
                                            <td className="p-4">{post.category}</td>
                                            <td className="p-4 text-sm text-gray-600">{post.author?.name || 'N/A'}</td>
                                            <td className="p-4 flex gap-4">
                                                <button onClick={() => handleOpenModal(post)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                                                <button onClick={() => handleDelete(post._id)} className="text-red-600 font-semibold hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            {isModalOpen && <BlogFormModal post={editingPost} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
}

export default AdminBlog;