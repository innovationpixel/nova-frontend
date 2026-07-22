import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Loading from '../jsx/components/utilComponents/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Loading fullscreen />
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
