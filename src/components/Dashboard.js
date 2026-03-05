import React from 'react';

const Dashboard = ({ setPage }) => {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="profile-section">
                    <div className="profile-pic">👤</div>
                    <p>Pete</p>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item active">📅 Dashboard</div>
                    <div className="nav-item">📚 Lectures</div>
                    <div className="nav-item">👨‍🏫 Tutors</div>
                    <div className="nav-item">🏫 Rooms</div>
                    <div className="nav-item">📖 Courses</div>
                    <div className="nav-item">⚙️ Settings</div>
                    <div className="nav-item">🕒 Timetables</div>
                </nav>
                <div className="logout-container">
                    <button className="logout-btn" onClick={() => setPage('auth')}>
                        ↩ LOGOUT
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <h1 className="header-title">Time-tabling System</h1>
                <div className="card-grid">
                    <div className="action-card card-profile">
                        <span>👤 Profile</span>
                    </div>
                    <div className="action-card card-courses">
                        <span>📚 Courses</span>
                    </div>
                    <div className="action-card card-timetables">
                        <span>🕒 Timetables</span>
                    </div>
                    <div className="action-card card-settings">
                        <span>⚙️ Settings</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
