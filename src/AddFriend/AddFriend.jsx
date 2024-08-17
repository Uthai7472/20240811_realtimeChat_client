import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const AddFriend = ({ user }) => {
    const [lineId, setLineId] = useState('');
    const [friendData, setFriendData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(lineId);
        try {
            const response = await axios.post('http://localhost:5000/api/protected/friend/search_friend', {line_id: lineId}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                }
            );
            setFriendData(response.data);
            setErrorMessage('');
        } catch (error) {
            setFriendData(null);
            setErrorMessage(error.response?.data?.message || 'Error searching for friend');
        }
    }

    const handleAddFriend = async () => {
        try {
            await axios.post('http://localhost:5000/api/protected/friend/add_friend', {user_id: user.id, friend_id: friendData.id}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Friend added successfully');

        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend');
        }
    }


  return (
    <div>
        <div>
            <div className='flex justify-start items-center'>
                Add Friend
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Line_ID
                    </label>
                    <input 
                        type="text"
                        value={lineId}
                        onChange={(e) => setLineId(e.target.value)}
                    />
                    <button type='submit'>
                        Search
                    </button>
                </form>
            </div>
            {errorMessage && <p>{errorMessage}</p>}

            {friendData && (
                <div>
                    <img src={friendData.profile_pic} className='w-[3rem] h-[3rem] rounded-[50%]' />
                    <p>{friendData.username}</p>
                    {friendData.isAlreadyFriend ? (
                        <div>
                                <Link to={`/chat/${friendData.id}`}>Chat</Link>
                        </div>
                    ) : (
                        <div>
                            <button onClick={handleAddFriend}>Add Friend</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  )
}

export default AddFriend