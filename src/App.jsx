import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import ProtectedRoute from './ProtectedRoute';
import UpdateUser from './UpdateUser/UpdateUser';
import AddFriend from './AddFriend/AddFriend';
import Chat from './Chat/Chat';

const App = () => {
    


  return (
    <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/home' element={<ProtectedRoute element={<Home />} />}/>
                <Route path='/home/update_user' element={<ProtectedRoute element={<UpdateUser />}/>} />
                <Route path='/add_friend' element={<ProtectedRoute element={<AddFriend />}/>} />
                <Route path='/chat/:friendId/:friendUsername' element={<ProtectedRoute element={<Chat />}/>} />
            </Routes>
    </Router>
  )
}

export default App