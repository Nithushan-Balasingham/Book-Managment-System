import React, { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link,Navigate } from 'react-router-dom';
import Loginup from './components/Loginup';
import Signup from './components/Signup';
import UserDetail from './components/UserDetail';
import EmailVerfify from './components/EmailVerfify';
import ResetPassword from './components/ResetPassword';
import UpdatePasswordForm from './components/ResetFinal';
import EmailSend from './components/EmailSend';
import Testing from './components/Testing';
import PrivateRoutes from './components/ProtectedRoutes';
import Update from './components/UpdateUser';
import AllBooks from './components/AllBooks';
import OwnBook from './components/OwnBook';
import AdminView from './components/AdminView';
import UpdateBook from './components/UpdateBook';
import NewBook from './components/NewBook';
import Navbar from './components/Navbar';

export const RecoveryContext = createContext();

function App() {
  const isLoggedIn = window.localStorage.getItem('loggedIn');

  const [page, setPage] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');

  return (
    <RecoveryContext.Provider value={{ page, setPage, otp, setOTP, setEmail, email }}>
      <Router>
        <div className="App">
          <div>
            <div>
              <Navbar/>
              <Routes>
                <Route path="/sign-in" element={<Loginup />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/users/:id/verify/:token" element={<EmailVerfify />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/update/:email" element={<UpdatePasswordForm />} />
                <Route path="/otp" element={<EmailSend />} />
                <Route path='/allbooks' element={<AllBooks/>}/>
                <Route path='/ownbook' element={<OwnBook/>}/>
                <Route path='/admin' element={<AdminView/>}/>
                <Route path='allbooks/update/:id' element={<UpdateBook/>}/>
                <Route path='users/update/:id' element={<UpdateBook/>}/>
                <Route path='ownbook/update/:id' element={<UpdateBook/>}/>
                <Route path='/update/user/:id' element={<Update/>}/>
                <Route path='/addBook' element={<NewBook/>}/>


                <Route element={<PrivateRoutes />}>
                  {/* These routes are protected and require authentication */}
                  <Route path="/test" element={<Testing />} />
                  <Route path="/details" element={<UserDetail />} />
                </Route>
                {/* Redirect to the home page if no valid route matches */}
                <Route path="/" element={<Navigate to="/sign-in" replace={true} />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </RecoveryContext.Provider>
  );
}

export default App;
