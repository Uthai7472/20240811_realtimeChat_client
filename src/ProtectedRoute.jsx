import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/auth/verify', {token});
                console.log('Valid:', response.data.valid);
                console.log('User:', response.data.user);
                setIsAuthenticated(response.data.valid);
            } catch (error) {
                setIsAuthenticated(false);
                console.log('Token verification failed:', error.response?.data?.message || error.message);
            }
        };

        verifyToken();
    }, []);

    if (isAuthenticated === null) {
        // Show a loading indicator while the token is being verified
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        console.log('Home');
        return element;
    } else {
        return <Navigate to="/" replace />
    }
}

export default ProtectedRoute