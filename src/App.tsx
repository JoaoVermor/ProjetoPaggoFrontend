import React, { useState } from 'react';
import Login from './pages/Login';
import { Register } from './pages/Register';
import Upload from './pages/Upload';
import History from './pages/History';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [page, setPage] = useState<'login' | 'register' | 'upload' | 'history'>('login');
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (jwt: string) => {
    setToken(jwt);
    localStorage.setItem('jwt', jwt);
    setPage('upload');
  };

  const handleRegisterSuccess = () => {
    setPage('login');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('jwt');
    setPage('login');
  };

  if (!token && page === 'login') {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onRegisterClick={() => setPage('register')}
      />
    );
  }

  if (!token && page === 'register') {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onLoginClick={() => setPage('login')}
      />
    );
  }

  if (token && (page === 'upload' || page === 'history')) {
    return (
      <>
        <Navbar onNavigate={setPage} onLogout={handleLogout} currentPage={page} />
        {page === 'upload' && <Upload token={token} />}
        {page === 'history' && <History token={token} />}
      </>
    );
  }

  return null;
};

export default App;
