import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
    const [isDropdown, setIsDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
    const [friends, setFriends] = useState([]); // State to hold friends data
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/users/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setUserData(response.data.result);
          console.log("result:", response.data.result);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      const fetchFriends = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/protected/friend/show_friends', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setFriends(response.data.friendsData);
          console.log("Friends data:", response.data.friendsData);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      };

      fetchUserData();
      fetchFriends();

    }, [token, user.id]);

    const handleLogout = (e) => {
        e.preventDefault();

        localStorage.removeItem('token');
        navigate('/');
    }

    const handleDropdown = () => {
      setIsDropdown(!isDropdown);
    }

    const handleDoubleClick = (friendId, friendUsername) => {
      navigate(`/chat/${friendId}/${friendUsername}`);
    }


  return (
    <div>
        <div className='flex justify-start items-center gap-3 pl-5 py-2'>
          {userData ? (
              <>
                <div>
                  <img className='w-[3rem] h-[3rem] rounded-[50%]'
                    src={`${userData.profile_pic}`} alt=""
                    onClick={handleDropdown} 
                />
                </div>
                <div className='font-bold text-[1.3rem]'>
                  {userData.username}
                </div>
              </>
          ) : (
            <div>Loading...</div> // Display a loading indicator while data is being fetched
           )}
        </div>
        { isDropdown && (
          <div className='flex flex-col justify-center rounded-lg w-[10rem]'>
            <div className=' bg-red-300'>
              <Link className='flex justify-center py-1 hover:bg-red-400' to={'/home/update_user'}>
                Update Profile
              </Link>
            </div>
            <div className=' bg-red-300 '>
              <button className='px-[3rem] py-1' onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
        <div>
          Hello
        </div>

        {/* Show friends list */}
        <div className='mt-5'>
          <h2 className='text-xl font-bold'>Your Friends</h2>
          <div className='flex flex-col gap-2'>
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.id} 
                  className='flex items-center gap-3 p-2 border-b hover:cursor-pointer' 
                  onDoubleClick={() => handleDoubleClick(friend.id, friend.username)}

                >
                  <img className='w-[2.5rem] h-[2.5rem] rounded-[50%]' src={`${friend.profile_pic}`} alt={friend.username} />
                  <div className='font-medium'>{friend.username}</div>
                </div>
              ))
            ) : (
              <div>No friends found.</div>
            )}
          </div>
        </div>

        <div className='flex justify-center items-center'>
          <div className='fixed bottom-2'>
            <Link to={'/add_friend'}>
              Add Friend
            </Link>
          </div>
        </div>
    </div>
  )
}

export default Home