// /src/pages/BlogPost.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

// --- UI Component: Comment Card ---
const CommentCard = ({ comment, onDelete, currentUser }) => {
    const isAuthor = currentUser?._id === comment.author?._id;
    const isAdmin = currentUser?.isAdmin;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 py-4 border-b border-gray-100"
        >
            <img 
                src={comment.author?.profilePictureUrl ? `http://localhost:5000${comment.author.profilePictureUrl}` : '/default-avatar.png'}
                alt={comment.author?.name || 'User'}
                className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-dark">{comment.author?.name || 'Anonymous'}</p>
                    {(isAuthor || isAdmin) && (
                        <button onClick={() => onDelete(comment._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    )}
                </div>
                <p className="text-sm text-gray-500 mb-2">{new Date(comment.createdAt).toLocaleString()}</p>
                <p className="text-gray-700">{comment.text}</p>
            </div>
        </motion.div>
    );
};

function BlogPost() {
    const { id: postId } = useParams();
    const { userInfo } = useAuth();
    
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentError, setCommentError] = useState('');

    const fetchPostAndComments = async () => {
        try {
            setLoading(true);
            const postPromise = axios.get(`http://localhost:5000/api/blog/posts/${postId}`);
            const commentsPromise = axios.get(`http://localhost:5000/api/blog/posts/${postId}/comments`);
            
            const [postRes, commentsRes] = await Promise.all([postPromise, commentsPromise]);
            
            setPost(postRes.data);
            setComments(commentsRes.data);
        } catch (err) {
            setError('Could not load the blog post. It may have been removed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostAndComments();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data: createdComment } = await axios.post(
                `http://localhost:5000/api/blog/posts/${postId}/comments`,
                { text: newComment },
                config
            );
            // Add the new comment to the top of the list instantly
            setComments([createdComment, ...comments]);
            setNewComment('');
        } catch (err) {
            setCommentError('Could not post comment. Please try again.');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/blog/posts/comments/${commentId}`, config);
                // Remove the comment from the list instantly
                setComments(comments.filter(c => c._id !== commentId));
            } catch (err) {
                setCommentError('Failed to delete comment.');
            }
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><p>Loading post...</p></div>;
    if (error) return <div className="flex h-screen items-center justify-center"><p className="text-red-500">{error}</p></div>;

    return (
        <div className="bg-light-gray min-h-screen">
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
                <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
                    <Link to="/blog" className="font-bold text-gray-600 hover:text-primary transition-colors">← Back to Blog</Link>
                </div>
            </header>

            {post && (
                <main className="py-12">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <p className="text-primary font-semibold">{post.category}</p>
                            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-dark mt-2">{post.title}</h1>
                            <div className="flex items-center gap-4 mt-4 text-gray-500">
                                <p>By {post.author?.name || 'Learn-x-AI Team'}</p>
                                <span>•</span>
                                <p>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="my-8 h-80 rounded-2xl overflow-hidden shadow-xl">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="prose lg:prose-xl max-w-none bg-white p-8 rounded-xl shadow-md">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 bg-white p-8 rounded-xl shadow-md">
                            <h2 className="text-2xl font-bold text-dark mb-4">{comments.length} Comments</h2>
                            {userInfo ? (
                                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 mb-8">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full border-2 border-gray-200 rounded-lg p-3"
                                        rows="3"
                                    />
                                    <button type="submit" className="self-end bg-primary text-white font-semibold py-2 px-6 rounded-lg">Post Comment</button>
                                </form>
                            ) : (
                                <p className="text-center bg-gray-100 p-4 rounded-lg">
                                    <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link> to post a comment.
                                </p>
                            )}
                            {commentError && <p className="text-red-500 mb-4">{commentError}</p>}
                            <div className="space-y-4">
                                {comments.map(comment => <CommentCard key={comment._id} comment={comment} onDelete={handleCommentDelete} currentUser={userInfo} />)}
                            </div>
                        </motion.div>
                    </div>
                </main>
            )}
        </div>
    );
}

export default BlogPost;