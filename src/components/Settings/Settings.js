import React, { useState, useEffect } from 'react';
import './Settings.css';
import api from '../../api';
import { showToast } from '../Toast/Toast';

const Settings = ({ isAdmin }) => {
    const [settings, setSettings] = useState({
        lecture_duration: 1,
        break_times: '13:00-14:00'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('settings/');
            setSettings(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching settings:", err);
            showToast("Failed to load settings", "error");
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('settings/save_settings/', settings);
            showToast("Settings updated successfully!", "success");
        } catch (err) {
            console.error("Error saving settings:", err);
            showToast("Failed to save settings.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="settings-section-container fade-in">
            <div className="settings-header-bar">System Settings</div>
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading configuration...</p>
            </div>
        </div>
    );

    return (
        <div className="settings-section-container fade-in">
            <div className="settings-header-bar">
                System Configuration
            </div>

            <div className="settings-content">
                <div className="settings-card-welcome">
                    <h3>General Preferences</h3>
                    <p>Configure the global parameters for the timetable generation algorithm.</p>
                </div>

                <div className="settings-group">
                    <label>Default Lecture Duration</label>
                    <div className="input-row">
                        <select
                            className="settings-select"
                            value={settings.lecture_duration}
                            disabled={!isAdmin}
                            onChange={(e) => setSettings({ ...settings, lecture_duration: parseInt(e.target.value) })}
                        >
                            <option value="1">1 Hour</option>
                            <option value="2">2 Hours</option>
                            <option value="3">3 Hours</option>
                            <option value="4">4 Hours</option>
                        </select>
                        <span className="unit-text">Recommended: 1 or 2 hours</span>
                    </div>
                </div>

                <div className="settings-group">
                    <label>Global Break Interval</label>
                    <div className="input-row">
                        <input
                            type="text"
                            className="settings-input"
                            placeholder="e.g. 13:00-14:00"
                            value={settings.break_times}
                            disabled={!isAdmin}
                            onChange={(e) => setSettings({ ...settings, break_times: e.target.value })}
                        />
                    </div>
                    <small className="help-text">Format: HH:MM-HH:MM (24-hour clock)</small>
                </div>

                {isAdmin && (
                    <button
                        className="btn-save-settings"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : '💾 Save All Changes'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Settings;
