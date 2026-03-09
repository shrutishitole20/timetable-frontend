import React, { useState } from 'react';
import './index.css';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import Toast from './components/Toast/Toast';

function App() {
  const [page, setPage] = useState('auth');
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => 
  {
    setUser(userData);
    setPage('dashboard');
  };

  return (
    <div className="App">
      <Toast />
      {page === 'auth' ? (
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard setPage={setPage} user={user} />
      )}
    </div>
  );
}

export default App;
