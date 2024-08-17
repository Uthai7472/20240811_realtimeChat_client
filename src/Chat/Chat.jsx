import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Chat = ({ user }) => {
    const token = localStorage.getItem('token');
    const { friendId, friendUsername } = useParams();

    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     socket.on('receiveMessage', (data) => {
    //         if (data.senderId === friendId || data.receiverId === friendId) {
    //             setMessages((prevMessages) => [...prevMessages, data]);
    //         }
    //     });

    //     return () => {
    //         socket.off('receiveMessage'); // Clean up the event listener on unmount
    //     };
    // }, [friendId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
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

        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [friendId, token]);

    console.log('Token:', token);

  return (
    <div className='flex flex-col min-h-screen'>
        <h1>Chat with User {friendId}</h1>
        
        <div className='flex-1 px-4'>
            <div className='pb-[5rem]'>
                {messages.map((msg, index) => (
                    <div key={index}
                        className={`flex ${msg.sender_id === user.id ? 'items-end' : 'items-start'} flex-col`}
                    >
                        <p className='font-bold'>{new Date(msg.created_at).toLocaleString()}</p>
                        <p className=''>
                            {msg.sender_id === user.id ? '' : `${friendUsername} :`} {msg.message}
                        </p>
                        {msg.imageUrl && (
                            <p>
                                <img className='w-[10vw] h-[15vh] object-cover' src={msg.imageUrl} alt="Chat image" />
                            </p>
                        )}
                        
                        <hr />
                    </div>
                ))}
            </div>
        </div>

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