import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Retrieve the 'isAdmin' value from localStorage
  const isLoggedIn = window.localStorage.getItem('loggedIn') === 'true';

  return (
    // Check if the user is authenticated and has admin permission
    isLoggedIn ? <Outlet /> : <Navigate to='/' replace={true} />
  );
};

export default PrivateRoute;
