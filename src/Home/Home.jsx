import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();

        localStorage.removeItem('token');
        navigate('/');
    }

  return (
    <div>
        Home
        <button onClick={handleLogout}>
            Logout
        </button>
    </div>
  )
}

export default Home