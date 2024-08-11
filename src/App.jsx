import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import ProtectedRoute from './ProtectedRoute';
import axios from 'axios';

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