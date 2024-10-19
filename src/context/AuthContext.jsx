// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../services';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [loading, setloading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate('/'); // If token exists, navigate to home
            setloading(false);
        } else {
            navigate('/login'); // If no token, navigate to login
            setloading(false);
        }
    }, [navigate]);

    const login = (data) => {
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token)
        localStorage.setItem('userData', JSON.stringify(data.user))
        setAccessToken(data.access_token);
        const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        localStorage.setItem('tokenExpiry', tokenExpiry);
        navigate('/'); // After login, navigate to home
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiry');
        setAccessToken(null);
        navigate('/login'); // After logout, navigate to login
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {loading ? "Loading..." : children}
        </AuthContext.Provider>
    );
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
