import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Lectures from '../Lectures/Lectures';
import Tutors from '../Tutors/Tutors';
import Rooms from '../Rooms/Rooms';
import Courses from '../Courses/Courses';
import Timetables from '../Timetables/Timetables';
import Settings from '../Settings/Settings';
import Profile from '../Profile/Profile';
import Chatbot from '../Chatbot/Chatbot';
import api from '../../api';

const Dashboard = ({ setPage, user }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({
        lectures: 0,
        tutors: 0,
        rooms: 0,
        courses: 0
    });

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    useEffect(() => {
        if (activeTab === 'Dashboard') {
            fetchStats();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const [lec, tut, rom, cou] = await Promise.all([
                api.get('lectures/'),
                api.get('tutors/'),
                api.get('rooms/'),
                api.get('courses/')
            ]);
            setStats({
                lectures: lec.data.length,
                tutors: tut.data.length,
                rooms: rom.data.length,
                courses: cou.data.length
            });
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const isAdmin = user === 'admin' || user === 'Administrator';

    const renderContent = () => {
        switch (activeTab) {
            case 'Lectures': return <Lectures isAdmin={isAdmin} />;
            case 'Tutors': return <Tutors isAdmin={isAdmin} />;
            case 'Rooms': return <Rooms isAdmin={isAdmin} />;
            case 'Courses': return <Courses isAdmin={isAdmin} />;
            case 'Timetables': return <Timetables isAdmin={isAdmin} />;
            case 'Settings': return <Settings isAdmin={isAdmin} />;
            case 'Profile': return <Profile user={user} />;
            case 'Dashboard':
            default:
                return (
                    <div className="content-inner fade-in">
                        <div className="dashboard-welcome">
                            <h2>{getTimeGreeting()}, {user || 'Administrator'}! 👋</h2>
                            <p>Here's a quick overview of your academic system and management controls.</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card" onClick={() => setActiveTab('Lectures')}>
                                <div className="stat-icon">📚</div>
                                <div className="stat-details">
                                    <span className="stat-num">{stats.lectures}</span>
                                    <span className="stat-label">Total Lectures</span>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('Tutors')}>
                                <div className="stat-icon">👨‍🏫</div>
                                <div className="stat-details">
                                    <span className="stat-num">{stats.tutors}</span>
                                    <span className="stat-label">Active Tutors</span>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('Rooms')}>
                                <div className="stat-icon">🏫</div>
                                <div className="stat-details">
                                    <span className="stat-num">{stats.rooms}</span>
                                    <span className="stat-label">Available Rooms</span>
                                </div>
                            </div>
                            <div className="stat-card" onClick={() => setActiveTab('Courses')}>
                                <div className="stat-icon">📖</div>
                                <div className="stat-details">
                                    <span className="stat-num">{stats.courses}</span>
                                    <span className="stat-label">Courses</span>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions-section">
                            <h3>Quick Management Actions</h3>
                            <div className="action-cards">
                                <div className="card profile-card" onClick={() => setActiveTab('Profile')}>
                                    <span className="card-icon">👤</span>
                                    <span className="card-text">Update Profile</span>
                                </div>
                                <div className="card timetable-card" onClick={() => setActiveTab('Timetables')}>
                                    <span className="card-icon">📅</span>
                                    <span className="card-text">Generate Schedule</span>
                                </div>
                                <div className="card settings-card" onClick={() => setActiveTab('Settings')}>
                                    <span className="card-icon">⚙️</span>
                                    <span className="card-text">System Settings</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <button
                className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>

            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="user-profile">
                    <div className="profile-avatar">👤</div>
                    <p>{user || 'Admin'}</p>
                </div>
                <nav className="side-nav">
                    <div className={`nav-link ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('Dashboard'); setIsMobileMenuOpen(false); }}>Dashboard</div>
                    <div className={`nav-link ${activeTab === 'Lectures' ? 'active' : ''}`} onClick={() => { setActiveTab('Lectures'); setIsMobileMenuOpen(false); }}>Lectures</div>
                    <div className={`nav-link ${activeTab === 'Tutors' ? 'active' : ''}`} onClick={() => { setActiveTab('Tutors'); setIsMobileMenuOpen(false); }}>Tutors</div>
                    <div className={`nav-link ${activeTab === 'Rooms' ? 'active' : ''}`} onClick={() => { setActiveTab('Rooms'); setIsMobileMenuOpen(false); }}>Rooms</div>
                    <div className={`nav-link ${activeTab === 'Courses' ? 'active' : ''}`} onClick={() => { setActiveTab('Courses'); setIsMobileMenuOpen(false); }}>Courses</div>
                    <div className={`nav-link ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => { setActiveTab('Settings'); setIsMobileMenuOpen(false); }}>Settings</div>
                    <div className={`nav-link ${activeTab === 'Timetables' ? 'active' : ''}`} onClick={() => { setActiveTab('Timetables'); setIsMobileMenuOpen(false); }}>Timetables</div>
                </nav>
                <div className="bottom-actions">
                    <button className="logout-link" onClick={() => setPage('auth')}>Sign Out</button>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Timetabler Admin Dashboard</h1>
                </div>
                {renderContent()}
            </main>
            <Chatbot />
        </div>
    );
};

export default Dashboard;
