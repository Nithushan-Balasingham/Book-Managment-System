import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import UserDetail from './UserDetail';
import NewBook from './NewBook';
import AllBooks from './AllBooks';
import AdminView from './AdminView';
import UpdateBook from './UpdateBook';
import OwnBook from './OwnBook';
import UpdateUser from './UpdateUser';

const PrivateRoutes = () => {
  const isAdmin = window.localStorage.getItem('Permission') === 'true';
  const isLoggedIn = window.localStorage.getItem('loggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace={true} />;
  }

  if (isAdmin) {
    return <Outlet />;
  } else {
    return (
      <Routes>
        <Route path="/details" element={<UserDetail />} />
        <Route path='/addBook' element={<NewBook/>}/>
        <Route path='/allbooks' element={<AllBooks/>}/>
        <Route path='/admin' element={<AdminView/>}/>
        <Route path='/addBook' element={<NewBook/>}/>
        <Route path='/allbooks' element={<AllBooks/>}/>
        <Route path='/admin' element={<AdminView/>}/>
        <Route path='/ownbook' element={<OwnBook/>}/>
        <Route path='users/update/:id' element={<UpdateBook/>}/>
        <Route path='ownbook/update/:id' element={<UpdateBook/>}/>
        <Route path='/update/user/:id' element={<UpdateUser/>}/>
        <Route path='allbooks/update/:id' element={<UpdateBook/>}/>
        <Route path="/test" element={<Navigate to="/details" replace={true} />} />
        <Route element={<Navigate to="/details" replace={true} />} />
      </Routes>
    );
  }
};

export default PrivateRoutes;
