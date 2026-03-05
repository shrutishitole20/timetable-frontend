import React, { useState, useEffect } from 'react';
import './Lectures.css';
import api from '../../api';
import { showToast } from '../Toast/Toast';

const Lectures = () => {
    const [lectureData, setLectureData] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [formData, setFormData] = useState({
        unit_code: '',
        unit_name: '',
        course: '',
        duration: 1,
        tutor: '',
        students: '',
        room: ''
    });
    const [selectedId, setSelectedId] = useState(null);

    // Fetch all data
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            await Promise.all([fetchLectures(), fetchTutors(), fetchRooms(), fetchCourses()]);
            setLoading(false);
        };
        loadAllData();
    }, []);

    const fetchLectures = async () => {
        try {
            const res = await api.get('lectures/');
            setLectureData(res.data);
        } catch (err) {
            console.error("Error fetching lectures:", err);
            showToast("Failed to fetch lectures", "error");
        }
    };

    const fetchTutors = async () => {
        try {
            const res = await api.get('tutors/');
            setTutors(res.data);
        } catch (err) {
            console.error("Error fetching tutors:", err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('courses/');
            setCourses(res.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await api.get('rooms/');
            setRooms(res.data);
        } catch (err) {
            console.error("Error fetching rooms:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrUpdate = async () => {
        if (!formData.unit_code || !formData.unit_name || !formData.tutor || !formData.room || !formData.course) {
            showToast("Please fill all required fields", "error");
            return;
        }

        try {
            if (selectedId) {
                await api.put(`lectures/${selectedId}/`, formData);
                showToast("Lecture updated successfully!", "success");
            } else {
                await api.post('lectures/', formData);
                showToast("Lecture added successfully!", "success");
            }
            fetchLectures();
            resetForm();
        } catch (err) {
            showToast("Error saving lecture. Check if IDs and fields are correct.", "error");
        }
    };

    const handleEdit = (lecture) => {
        setSelectedId(lecture.id);
        setFormData({
            unit_code: lecture.unit_code,
            unit_name: lecture.unit_name,
            course: lecture.course || '',
            duration: lecture.duration,
            tutor: lecture.tutor,
            students: lecture.students,
            room: lecture.room
        });
        showToast(`Editing ${lecture.unit_code}`, "info");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lecture?")) return;
        try {
            await api.delete(`lectures/${id}/`);
            showToast("Lecture deleted successfully", "success");
            fetchLectures();
            if (selectedId === id) resetForm();
        } catch (err) {
            showToast("Error deleting lecture.", "error");
        }
    };

    const resetForm = () => {
        setSelectedId(null);
        setFormData({
            unit_code: '',
            unit_name: '',
            course: '',
            duration: 1,
            tutor: '',
            students: '',
            room: ''
        });
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and Sort lectures
    const filteredLectures = [...lectureData]
        .filter(lec =>
            lec.unit_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lec.unit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lec.tutor_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    return (
        <div className="lectures-container fade-in">
            <div className="lectures-header-bar">
                Lectures Management
            </div>

            <div className="lectures-content">
                {/* Left Side: Form */}
                <div className="lecture-form-section">
                    <h3 className="form-title">{selectedId ? 'Edit Lecture' : 'Add New Lecture'}</h3>
                    <div className="form-row">
                        <label>Unit Code:</label>
                        <input
                            name="unit_code"
                            value={formData.unit_code}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="e.g. CS101"
                        />
                    </div>
                    <div className="form-row">
                        <label>Unit Name:</label>
                        <input
                            name="unit_name"
                            value={formData.unit_name}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="e.g. Intro to CS"
                        />
                    </div>
                    <div className="form-row">
                        <label>Course Name:</label>
                        <select name="course" value={formData.course} onChange={handleInputChange}>
                            <option value="">Select Course</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <label>Duration (Hours):</label>
                        <input
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            type="number"
                        />
                    </div>
                    <div className="form-row">
                        <label>Tutor:</label>
                        <select name="tutor" value={formData.tutor} onChange={handleInputChange}>
                            <option value="">Select Tutor</option>
                            {tutors.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <label>No. of Students:</label>
                        <input
                            name="students"
                            value={formData.students}
                            onChange={handleInputChange}
                            type="number"
                        />
                    </div>
                    <div className="form-row">
                        <label>Room:</label>
                        <select name="room" value={formData.room} onChange={handleInputChange}>
                            <option value="">Select Room</option>
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>{r.room_no} ({r.capacity} seats)</option>
                            ))}
                        </select>
                    </div>

                    <div className="buttons-group">
                        <button className="btn-add" onClick={handleAddOrUpdate}>
                            {selectedId ? '💾 Update' : '➕ Add Lecture'}
                        </button>
                        {selectedId && (
                            <button className="btn-action" onClick={resetForm} style={{ backgroundColor: '#999' }}>
                                ✖ Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Side: Table */}
                <div className="lecture-table-section">
                    <div className="table-controls">
                        <div className="search-box">
                            <i>🔍</i>
                            <input
                                type="text"
                                placeholder="Search unit, name or tutor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <span className="results-count">Showing {filteredLectures.length} records</span>
                    </div>

                    <div className="table-wrapper">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading lectures...</p>
                            </div>
                        ) : (
                            <table className="lecture-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                                            ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('unit_code')} style={{ cursor: 'pointer' }}>
                                            Code {sortConfig.key === 'unit_code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('unit_name')} style={{ cursor: 'pointer' }}>
                                            Unit Name {sortConfig.key === 'unit_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('course_name')} style={{ cursor: 'pointer' }}>
                                            Course {sortConfig.key === 'course_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('duration')} style={{ cursor: 'pointer' }}>
                                            Dur. {sortConfig.key === 'duration' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('tutor_name')} style={{ cursor: 'pointer' }}>
                                            Tutor {sortConfig.key === 'tutor_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th onClick={() => requestSort('room_no')} style={{ cursor: 'pointer' }}>
                                            Room {sortConfig.key === 'room_no' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLectures.length > 0 ? (
                                        filteredLectures.map((item) => (
                                            <tr key={item.id}>
                                                <td>#{item.id}</td>
                                                <td><span className="code-badge">{item.unit_code}</span></td>
                                                <td>{item.unit_name}</td>
                                                <td><span className="course-badge">{item.course_name || 'Unassigned'}</span></td>
                                                <td>{item.duration}h</td>
                                                <td>{item.tutor_name}</td>
                                                <td>{item.room_no}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="btn-table-edit" title="Edit" onClick={() => handleEdit(item)}>✏️</button>
                                                        <button className="btn-table-delete" title="Delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="7" className="empty-row">No matching lectures found</td></tr>
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

export default Lectures;
