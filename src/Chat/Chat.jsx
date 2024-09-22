import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Chat = ({ user }) => {
    const token = localStorage.getItem('token');
    const { friendId, friendUsername } = useParams();

    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userProfilePic, setUserProfilePic] = useState('');
    const [friendProfilePic, setFriendProfilePic] = useState('');

    const [isFullPicture, setIsFullPicture] = useState(false);
    const [fullPictureUrl, setFullPictureUrl] = useState('');

    const messagesEndRef = useRef(null);
    const [initialScrollDone, setInitialScrollDone] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    }

    const handleClickFullPicture = (imageUrl) => {
        setIsFullPicture(!isFullPicture);
        setFullPictureUrl(imageUrl);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('message', message);
        formData.append('imageUrl', file);
        formData.append('receiver_id', friendId);
        // Get current date and time in ISO format
        const currentDatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        formData.append('datetime', currentDatetime);

        try {
            // Send message to database api
            const response = await axios.post('https://ou-realtime-chat-server.vercel.app/api/protected/chat/message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);

            // Reset input form
            setMessage('');
            setFile(null);

            // Fetch new messages after sending
            const getChat = await axios.get('https://ou-realtime-chat-server.vercel.app/api/protected/chat/message', {
                params: { receiver_id: friendId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessages(getChat.data.messages);

        } catch (error) {
            console.log('Error uploading message and image:', error);
        }
    }

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('https://ou-realtime-chat-server.vercel.app/api/protected/chat/message', {
                    params: { receiver_id: friendId },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setMessages(response.data.messages);
            } catch (error) {
                console.log('Error fetching messages:', error);
            }
        };

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`https://ou-realtime-chat-server.vercel.app/api/auth/users/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUserProfilePic(response.data.result.profile_pic);
                console.log('Profile picture:', response.data.result.profile_pic);
            } catch (error) {
                console.log('Error fetching friend profile:', error);
            }
        };

        const fetchFriendProfile = async () => {
            try {
                const response = await axios.get(`https://ou-realtime-chat-server.vercel.app/api/auth/users/${friendId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setFriendProfilePic(response.data.result.profile_pic);
            } catch (error) {
                console.log('Error fetching friend profile:', error);
            }
        };

        
        fetchUserProfile();
        fetchFriendProfile();

        const interval = setInterval(fetchMessages, 1000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [friendId, token]);

    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };

        // Scroll to bottom only once after messages are fetched
        if (!initialScrollDone || messages.length > 0) {
            scrollToBottom();
            setInitialScrollDone(true); // Set the flag to true after scrolling
        } else {
            // Check if user is at the bottom before scrolling
            const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
            if (isAtBottom) {
                scrollToBottom();
            }
        }
    }, [messages]);

    console.log('Token:', token);
    

  return (
    <div className='flex flex-col min-h-screen'>
        <h1>Chat with User {friendId}</h1>
        
        <div className='flex-1 px-4'>
            <div className='pb-[5rem]'>
                {messages.map((msg, index) => (
                    <div key={index}
                        className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'} mb-2`}
                    >
                            {msg.sender_id === user.id ? (
                                <div className='flex flex-col justify-center items-end max-w-[60%] rounded-xl bg-[#F0EDCF] p-2'>
                                    <p className='font-bold'>{new Date(msg.created_at).toLocaleString()}</p>
                                    <p>
                                        {msg.message}
                                    </p>
                                    {msg.imageUrl && (
                                        <p className='flex justify-end items-center' onClick={() => handleClickFullPicture(msg.imageUrl)}>
                                            <img className='w-[30%] h-[30%] mt-2' src={msg.imageUrl} alt="Chat image" />
                                        </p>
                                    )}
                                    
                                </div>
                            ) : (
                                <div className='flex flex-col items-start justify-center max-w-[60%] rounded-xl bg-[#40A2D8] p-2'>
                                    <p className='font-bold'>{new Date(msg.created_at).toLocaleString()}</p>
                                    <p className='font-bold'>
                                            {msg.sender_id === user.id ? '' : `${friendUsername}`}
                                    </p>
                                    <div className='flex justify-start items-center gap-2'>
                                        <div className='w-[2.5rem] h-[2.5rem] flex-shrink-0'>
                                            <img className='w-full h-full rounded-[50%]' src={msg.sender_id === user.id ? userProfilePic : friendProfilePic}  />
                                        </div>
                                        <div>
                                            {msg.message}
                                        </div>
                                    </div>
                                    {msg.imageUrl && (
                                        <p className='' onClick={() => handleClickFullPicture(msg.imageUrl)}>
                                            <img className='w-[30%] h-[30%] mt-2' src={msg.imageUrl} alt="Chat image" />
                                        </p>
                                    )}
                                </div>
                            )}                    
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>

        {isFullPicture && (
            <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50' onClick={handleClickFullPicture}>
                <div className='relative flex justify-center px-2 md:px-0' >
                    <img src={fullPictureUrl}
                        className='md:w-[60%] md:h-[60%]'
                    />
                </div>
            </div>
        )}

        

        <div className=''>
            <div className='fixed flex justify-center items-center bottom-0 bg-blue-300 w-full h-auto backdrop-blur-sm'>
                <form onSubmit={handleSubmit} 
                    className='relative z-10 bg-white p-2 rounded-xl flex justify-center items-center'
                >
                    <textarea 
                        type="text"
                        value={message}
                        onChange={handleMessageChange}
                        placeholder='Enter your message' 
                        className='w-[50%] h-[3rem] border rounded px-2 py-1'
                    />
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="sr-only" // Hide the input
                    />
                    <label
                        htmlFor="file-upload"
                        className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-xl cursor-pointer"
                    >
                        รูป
                    </label>
                    <button type='submit'
                        className='bg-blue-600 px-3 py-2 rounded-xl text-white ml-2'
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Chat
