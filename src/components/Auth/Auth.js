import React, { useState } from 'react';
import './Auth.css';
import logo from '../../assets/images/logo.png';
import api from '../../api';

const Auth = ({ onLoginSuccess }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleToggle = (tab) => {
        setActiveTab(tab);
        setError('');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (activeTab === 'login') {
                const response = await api.post('login/', {
                    username: formData.username,
                    password: formData.password
                });
                if (response.data.status === 'success') {
                    onLoginSuccess(response.data.user);
                }
            } else {
                const response = await api.post('signup/', formData);
                if (response.data.status === 'success') {
                    alert('Registration successful! Please login.');
                    setActiveTab('login');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-sidebar">
                <img src={logo} alt="Project Logo" className="logo" />
                <h1 className="project-title">Timetabler</h1>
                <p>Smart scheduling for modern academia.</p>
                <div className="nav-btns">
                    <button
                        className={`nav-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => handleToggle('login')}
                    >
                        Sign In
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => handleToggle('signup')}
                    >
                        Create Account
                    </button>
                </div>
            </div>

            <div className="auth-main">
                <h2 className="form-header">
                    {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                </h2>

                {error && <div className="error-message-pop" style={{ color: '#ef4444', background: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', border: '1px solid #fee2e2' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {activeTab === 'login' ? (
                        <>
                            <div className="form-group">
                                <label>Username</label>
                                <div className="input-with-icon">
                                    <span>👤</span>
                                    <input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-with-icon">
                                    <span>🔒</span>
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Username</label>
                                <div className="input-with-icon">
                                    <span>🆔</span>
                                    <input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        type="text"
                                        placeholder="johndoe"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <span>📧</span>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-with-icon">
                                    <span>🔒</span>
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <button type="submit" className="submit-btn">
                        {activeTab === 'login' ? 'Sign In' : 'Register Now'}
                    </button>
                    <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                        {activeTab === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <span
                            onClick={() => handleToggle(activeTab === 'login' ? 'signup' : 'login')}
                            style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer', marginLeft: '5px' }}
                        >
                            {activeTab === 'login' ? 'Sign up' : 'Login'}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Auth;
