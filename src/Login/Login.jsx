import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(username, password);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: username,
                password: password
            });
    
            console.log(response.data.message);
    
            // Optionally, save the token to localStorage or state
            localStorage.setItem('token', response.data.token);

            console.log(localStorage.getItem('token'));
            navigate('/home');

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.log('Login failed:', error.response?.data?.message || error.message);

            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

  return (
    <div className='grid grid-rows-[40vh_60vh] md:grid-cols-[40%_60%]'>
        <div className='min-h-[40vh] md:min-h-screen bg-[#758694] flex justify-center items-center md:border-[#FFF] md:border-r-[0.3rem] shadow-2xl'>
            {/* Topic */}
            <div className='flex flex-col justify-center items-center mt-3'>
                <div className='md:flex md:gap-2'>                            
                    <p className='flex justify-center items-center text-[#F7E7DC] 
                        font-bold text-[1.4rem] md:text-[2.8rem]'>Login</p>
                    <p className='flex justify-center items-center text-[#405D72] 
                        font-bold text-[1.4rem] md:text-[2.8rem]'>Realtime Chat</p>
                </div>
                <div>
                    <form 
                        onSubmit={handleSubmit} 
                        className='md:w-[24rem] flex flex-col gap-3'>
                        <input 
                            className='px-2 py-1 rounded-md text-[#405D72] font-bold mt-3 md:mt-14 md:text-[1.5rem]'
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input 
                            className='px-2 py-1 rounded-md text-[#405D72] font-bold mt-3 md:mt-14 md:text-[1.5rem]'
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type='submit'
                            className='w-40flex justify-center items-center-[10rem] bg-[#F7E7DC] text-[#405D72]
                            font-bold text-[1.2rem] md:text-[2.2rem] py-3 rounded-xl mb-4'>
                            Login
                        </button>
                    </form>
                </div>

                {error && (
                    <div className='mt-3 px-3 py-1 flex justify-center items-center bg-red-500 text-white rounded-md'>
                        {error}
                    </div>
                )}
            </div>

        </div>
        <div className='min-h-[60vh] md:min-h-screen bg-[#FFF8F3]'>
            {/* <img className='h-[100vh] w-screen' src="\pictures\candy1.jpg" alt="" /> */}
        </div>
    </div>
  )
}

export default Login