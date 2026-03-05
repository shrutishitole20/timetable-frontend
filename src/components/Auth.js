import React, { useState } from 'react';
import logo from '../assets/logo.png';

const Auth = ({ setPage }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage('dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src={logo} alt="Timetable Logo" className="project-logo" />
        <h1 className="project-name">Timetabler</h1>
        <div className="nav-buttons">
          <button 
            className={`nav-btn login`} 
            style={{ opacity: isLogin ? 1 : 0.7 }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`nav-btn signup`} 
            style={{ opacity: !isLogin ? 1 : 0.7 }}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </div>
      <div className="auth-right">
        <button className="close-btn">&times;</button>
        <h2 className="form-title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input type="text" placeholder="Enter Username" required />
                </div>
              </div>
              <div className="form-group">
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input type="password" placeholder="Enter Password" required />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Username</label>
                <input type="text" placeholder="Enter Username" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter Email" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter Password" required />
              </div>
            </>
          )}
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
