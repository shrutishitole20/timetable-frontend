import React, { useState } from 'react';
import './Profile.css';
import api from '../../api';

import { showToast } from '../Toast/Toast';

const Profile = ({ user }) => {
    const [formData, setFormData] = useState({
        username: user || '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Ready for real API call: await api.post('profile/update/', formData);
            showToast('Profile updated successfully!', 'success');
            setMessage('✅ Profile updated successfully!');
        } catch (err) {
            showToast('Failed to update profile.', 'error');
            setMessage('❌ Failed to update profile.');
        }
    };

    return (
        <div className="profile-section-container fade-in">
            <div className="profile-header-bar">
                Admin Profile
            </div>

            <div className="profile-content">
                {/* Left: Profile Card */}
                <div className="profile-card">
                    <div className="profile-avatar-large">👤</div>
                    <h2 className="profile-username">{user || 'Admin'}</h2>
                    <span className="profile-role-badge">Administrator</span>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">50</span>
                            <span className="stat-label">Users</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">3</span>
                            <span className="stat-label">Courses</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">5</span>
                            <span className="stat-label">Tutors</span>
                        </div>
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div className="profile-form-section">
                    <h3 className="form-section-title">Edit Details</h3>

                    {message && (
                        <div className={`profile-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave}>
                        <div className="profile-form-group">
                            <label>Username</label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter new username"
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>New Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter new password"
                            />
                        </div>

                        <button type="submit" className="btn-update-profile">
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
