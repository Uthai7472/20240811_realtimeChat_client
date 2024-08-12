import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
    


  return (
    <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/home' element={<ProtectedRoute element={<Home />} />}/>
            </Routes>
    </Router>
  )
}

export default App