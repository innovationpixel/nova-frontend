import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
import  ThemeContext  from "./context/ThemeContext"; 
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <BrowserRouter basename='/'>
        <PrimeReactProvider value={{ ripple: true, hideOverlaysOnDocumentScrolling: true }}>
          <AuthProvider>
          <ThemeContext>
            <App />
          </ThemeContext>
          </AuthProvider>
        </PrimeReactProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
