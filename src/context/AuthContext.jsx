// /src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    // On initial app load, check localStorage for existing user info
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const login = (userData) => {
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    // This is the new function that updates the user info everywhere
    const updateUserInfo = (newUserData) => {
        // We only update the parts that can change, keeping the token
        const updatedInfo = { ...userInfo, ...newUserData };
        setUserInfo(updatedInfo);
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout, updateUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily access the context
export const useAuth = () => {
    return useContext(AuthContext);
};