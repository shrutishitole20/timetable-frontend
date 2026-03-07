import React, { useState, useEffect } from 'react';
import './Courses.css';
import api from '../../api';
import { showToast } from '../Toast/Toast';

const Courses = ({ isAdmin }) => {
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        department: '',
        year: ''
    });
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get('courses/');
            setCourseData(res.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
            showToast("Failed to fetch courses", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrUpdate = async () => {
        if (!formData.code || !formData.name) {
            showToast("Course code and name are required", "error");
            return;
        }

        try {
            if (selectedId) {
                await api.put(`courses/${selectedId}/`, formData);
                showToast("Course updated successfully!", "success");
            } else {
                await api.post('courses/', formData);
                showToast("Course added successfully!", "success");
            }
            fetchCourses();
            resetForm();
        } catch (err) {
            showToast("Error saving course. Code must be unique.", "error");
        }
    };

    const handleEdit = (course) => {
        setSelectedId(course.id);
        setFormData({
            code: course.code,
            name: course.name,
            department: course.department,
            year: course.year
        });
        showToast(`Editing ${course.code}`, "info");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`courses/${id}/`);
            showToast("Course deleted successfully", "success");
            fetchCourses();
            if (selectedId === id) resetForm();
        } catch (err) {
            showToast("Error deleting course.", "error");
        }
    };

    const resetForm = () => {
        setSelectedId(null);
        setFormData({ code: '', name: '', department: '', year: '' });
    };

    const filteredCourses = courseData.filter(course =>
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.department && course.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="courses-section-container fade-in">
            <div className="courses-header-bar">
                Academic Courses
            </div>

            <div className="courses-content">
                {/* Left Side: Form */}
                {isAdmin && (
                    <div className="course-form-section">
                        <h3 className="form-title">{selectedId ? 'Edit Course' : 'Add New Course'}</h3>
                        <div className="form-row">
                            <label>Course Code:</label>
                            <input name="code" value={formData.code} onChange={handleInputChange} type="text" placeholder="e.g. CS2025" />
                        </div>
                        <div className="form-row">
                            <label>Course Name:</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. B.Tech CS" />
                        </div>
                        <div className="form-row">
                            <label>Department:</label>
                            <input name="department" value={formData.department} onChange={handleInputChange} type="text" placeholder="e.g. Engineering" />
                        </div>
                        <div className="form-row">
                            <label>Year / Duration:</label>
                            <input name="year" value={formData.year} onChange={handleInputChange} type="text" placeholder="e.g. 2nd Year" />
                        </div>

                        <div className="buttons-group">
                            <button className="btn-add" onClick={handleAddOrUpdate}>
                                {selectedId ? '💾 UPDATE COURSE' : '➕ ADD COURSE'}
                            </button>
                            {selectedId && (
                                <button className="btn-action" onClick={resetForm} style={{ backgroundColor: '#999' }}>✖ CANCEL</button>
                            )}
                        </div>
                    </div>
                )}

                {/* Right Side: Table */}
                <div className="course-table-section" style={{ width: isAdmin ? undefined : '100%' }}>
                    <div className="table-controls">
                        <div className="search-box">
                            <i>🔍</i>
                            <input
                                type="text"
                                placeholder="Search by code, name or dept..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <span className="results-count">Total: {filteredCourses.length} courses</span>
                    </div>

                    <div className="table-wrapper">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading courses...</p>
                            </div>
                        ) : (
                            <table className="course-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Code</th>
                                        <th>Course Name</th>
                                        <th>Department</th>
                                        <th>Year</th>
                                        {isAdmin && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.length > 0 ? (
                                        filteredCourses.map((course) => (
                                            <tr key={course.id}>
                                                <td>#{course.id}</td>
                                                <td><span className="code-badge">{course.code}</span></td>
                                                <td><strong>{course.name}</strong></td>
                                                <td>{course.department}</td>
                                                <td>{course.year}</td>
                                                {isAdmin && (
                                                    <td>
                                                        <div className="action-btns">
                                                            <button className="btn-table-edit" title="Edit" onClick={() => handleEdit(course)}>✏️</button>
                                                            <button className="btn-table-delete" title="Delete" onClick={() => handleDelete(course.id)}>🗑️</button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={isAdmin ? "6" : "5"} className="empty-row">No courses found</td></tr>
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

export default Courses;
