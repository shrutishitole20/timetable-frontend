import React, { useState, useEffect } from 'react';
import './Tutors.css';
import api from '../../api';
import { showToast } from '../Toast/Toast';

const Tutors = ({ isAdmin }) => {
    const [tutorData, setTutorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        phone: '',
        name: '',
        unit_code: ''
    });
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        setLoading(true);
        try {
            const res = await api.get('tutors/');
            setTutorData(res.data);
        } catch (err) {
            console.error("Error fetching tutors:", err);
            showToast("Failed to fetch tutors", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrUpdate = async () => {
        if (!formData.name) {
            showToast("Tutor name is required", "error");
            return;
        }

        try {
            if (selectedId) {
                await api.put(`tutors/${selectedId}/`, formData);
                showToast("Tutor updated successfully!", "success");
            } else {
                await api.post('tutors/', formData);
                showToast("Tutor added successfully!", "success");
            }
            fetchTutors();
            resetForm();
        } catch (err) {
            showToast("Error saving tutor.", "error");
        }
    };

    const handleEdit = (tutor) => {
        setSelectedId(tutor.id);
        setFormData({
            phone: tutor.phone || '',
            name: tutor.name,
            unit_code: tutor.unit_code || ''
        });
        showToast(`Editing ${tutor.name}`, "info");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`tutors/${id}/`);
            showToast("Tutor deleted successfully", "success");
            fetchTutors();
            if (selectedId === id) resetForm();
        } catch (err) {
            showToast("Error deleting tutor.", "error");
        }
    };

    const resetForm = () => {
        setSelectedId(null);
        setFormData({ phone: '', name: '', unit_code: '' });
    };

    const filteredTutors = tutorData.filter(tutor =>
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tutor.unit_code && tutor.unit_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tutor.phone && tutor.phone.includes(searchTerm))
    );

    return (
        <div className="tutors-container fade-in">
            <div className="tutors-header-bar">
                Tutors Directory
            </div>

            <div className="tutors-content">
                {/* Left: Form */}
                {isAdmin && (
                    <div className="tutor-form-section">
                        <h3 className="form-title">{selectedId ? 'Edit Tutor' : 'Add New Tutor'}</h3>
                        <div className="form-row">
                            <label>Name:</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Full Name" />
                        </div>
                        <div className="form-row">
                            <label>Phone no. :</label>
                            <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="+1234567890" />
                        </div>
                        <div className="form-row">
                            <label>Unit Code:</label>
                            <input name="unit_code" value={formData.unit_code} onChange={handleInputChange} type="text" placeholder="e.g. CS101" />
                        </div>

                        <div className="buttons-group">
                            <button className="btn-add" onClick={handleAddOrUpdate}>
                                {selectedId ? '💾 UPDATE' : '➕ ADD TUTOR'}
                            </button>
                            {selectedId && (
                                <button className="btn-action" onClick={resetForm} style={{ backgroundColor: '#999' }}>✖ CANCEL</button>
                            )}
                        </div>
                    </div>
                )}

                {/* Right: Table */}
                <div className="tutor-table-section" style={{ width: isAdmin ? undefined : '100%' }}>
                    <div className="table-controls">
                        <div className="search-box">
                            <i>🔍</i>
                            <input
                                type="text"
                                placeholder="Search by name, code or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <span className="results-count">Total: {filteredTutors.length} tutors</span>
                    </div>

                    <div className="table-wrapper">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading tutors...</p>
                            </div>
                        ) : (
                            <table className="tutor-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Unit Code</th>
                                        {isAdmin && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTutors.length > 0 ? (
                                        filteredTutors.map(tutor => (
                                            <tr key={tutor.id}>
                                                <td>#{tutor.id}</td>
                                                <td><strong>{tutor.name}</strong></td>
                                                <td>{tutor.phone}</td>
                                                <td><span className="code-badge">{tutor.unit_code || 'N/A'}</span></td>
                                                {isAdmin && (
                                                    <td>
                                                        <div className="action-btns">
                                                            <button className="btn-table-edit" title="Edit" onClick={() => handleEdit(tutor)}>✏️</button>
                                                            <button className="btn-table-delete" title="Delete" onClick={() => handleDelete(tutor.id)}>🗑️</button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={isAdmin ? "5" : "4"} className="empty-row">No tutors found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutors;
