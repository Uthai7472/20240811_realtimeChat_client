import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                setIsAuthenticated(response.data.valid);
            } catch (error) {
                setIsAuthenticated(false);
                console.log('Token verification failed:', error.response?.data?.message || error.message);
            }
        };

        verifyToken();
    }, []);

  return isAuthenticated;
}

export default useAuth