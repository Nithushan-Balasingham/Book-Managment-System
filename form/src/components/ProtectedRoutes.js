import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import UserDetail from './UserDetail'

const PrivateRoutes = () => {
  // Retrieve the 'isAdmin' and 'isLoggedIn' values from localStorage
  const isAdmin = window.localStorage.getItem('Permission') === 'true';
  const isLoggedIn = window.localStorage.getItem('loggedIn') === 'true';

  if (!isLoggedIn) {
    // If no user is logged in, redirect to the 'sign-in' page or any other appropriate page
    return <Navigate to='/sign-in' replace={true} />;
  }

  if (isAdmin) {
    // If an admin is logged in, allow access to both 'details' and 'testing' pages
    return <Outlet />;
  } else {
    // If a non-admin user is logged in, allow access to only the 'details' page
    return (
      <Routes>
        <Route path="/details" element={<UserDetail/>} />
        {/* Prevent non-admin users from accessing the 'testing' page */}
        <Route path="/test" element={<Navigate to='/details' replace={true} />} />
        {/* Redirect to 'details' page for any other routes */}
        <Route element={<Navigate to="/details" replace={true} />} />
      </Routes>
    );
  }
};

export default PrivateRoutes;
