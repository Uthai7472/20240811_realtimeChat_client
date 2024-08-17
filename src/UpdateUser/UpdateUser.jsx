import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const UpdateUser = ({ user }) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(user.password);
    const [permission, setPermission] = useState(user.permission);
    const [profilePic, setProfilePic] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleProfilePicChange = (e) => {
        setProfilePic(e.target.files[0]);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const formData =  new FormData();
        formData.append('id', user.id);
        formData.append('username', username);
        formData.append('email', email);
        
        if (password) formData.append('password', password);
        formData.append('permission', permission);
        if (profilePic) formData.append('profile_pic', profilePic);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('https://ou-realtime-chat-server.vercel.app/api/auth/update_user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data.message);
            navigate('/home');

        } catch (error) {
            console.error('Error updating profile:', error.response?.data?.message || error.message);
            // Handle error, e.g., show an error message
        } finally {
            setLoading(false);
        }

    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="">Username:</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='border-2 border-black rounded-md'
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=''
                />
                <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className='absolute left-[13rem]'
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
            <div>
                <label>Permission:</label>
                <input
                    type="number"
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                />
            </div>
            <div>
                <label>Profile Picture:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                />
            </div>
            <button type="submit">
                {loading ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    </div>
  )
}

export default UpdateUser