import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Index from './jsx/router/index';
import ProtectedRoute from './middleware/ProtectedRoute';
import PublicRoute from './middleware/PublicRoute';


// Styles
import "./assets/css/style.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Loading from './jsx/components/utilComponents/Loading';

// Lazy pages
const Login = lazy(() =>
  new Promise(resolve => {
    setTimeout(() => resolve(import('./jsx/pages/authentication/Login')), 500);
  })
);

const VerifyOtp = lazy(() =>
  new Promise(resolve => {
    setTimeout(() => resolve(import('./jsx/pages/authentication/VerifyOtp')), 500);
  })
);

const Loader = () => (
  <Loading fullscreen/>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <div className="vh-100">
                <Login />
              </div>
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <div className="vh-100">
                <VerifyOtp />
              </div>
            </PublicRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
