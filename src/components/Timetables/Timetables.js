import React, { useState, useEffect } from 'react';
import './Timetables.css';
import api from '../../api';
import { showToast } from '../Toast/Toast';

const Timetables = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [timetableSlots, setTimetableSlots] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [loading, setLoading] = useState(true);

    const handlePrint = () => {
        window.print();
    };

    const timeSlots = [
        '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00',
        '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00'
    ];
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const res = await api.get('courses/');
            setCourses(res.data);
            if (res.data.length > 0) {
                setSelectedCourse(res.data[0].id);
            }
        } catch (err) {
            console.error("Error fetching courses", err);
            showToast("Failed to load courses", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCourse) {
            fetchSlots(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchSlots = async (courseId) => {
        try {
            const res = await api.get(`timetable-slots/?course_id=${courseId}`);
            setTimetableSlots(res.data);
        } catch (err) {
            console.error("Error fetching slots", err);
        }
    };

    const handleGenerate = async () => {
        if (!selectedCourse) {
            showToast("Please select a course first.", "info");
            return;
        }
        setGenerating(true);
        showToast("Generating optimal timetable...", "info");
        try {
            await api.post('timetable-slots/generate/', { course_id: selectedCourse });
            await fetchSlots(selectedCourse);
            showToast("Timetable generated successfully!", "success");
        } catch (err) {
            console.error("Error generating timetable:", err);
            showToast("Generation failed. Check for room/tutor conflicts.", "error");
        } finally {
            setGenerating(false);
        }
    };

    const getSlotContent = (day, timeSlot) => {
        const slot = timetableSlots.find(s => s.day === day && s.time_slot === timeSlot);
        if (slot) {
            return (
                <div className="slot-inner">
                    <div className="slot-subject">{slot.lecture_name}</div>
                    <div className="slot-tutor">👨‍🏫 {slot.tutor_name}</div>
                    <div className="slot-room">🏫 {slot.room_name}</div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="timetables-section-container fade-in">
            <div className="timetables-header-bar">
                Dynamic Schedule Planner
            </div>

            <div className="timetables-controls">
                <div className="select-wrapper">
                    <span>Course: </span>
                    <select
                        className="course-select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Select a Course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                        ))}
                    </select>
                </div>

                <div className="control-btns">
                    <button className="btn-print" onClick={handlePrint}>🖨️ Export PDF</button>
                    <button
                        className="btn-generate"
                        onClick={handleGenerate}
                        disabled={generating}
                    >
                        {generating ? '🛠️ Processing...' : '⚡ Generate Schedule'}
                    </button>
                </div>
            </div>

            <div className="timetable-grid-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Fetching schedule data...</p>
                    </div>
                ) : (
                    <table className="timetable-grid">
                        <thead>
                            <tr>
                                <th className="sticky-corner">Time</th>
                                {timeSlots.map(slot => (
                                    <th key={slot}>{slot}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map(day => (
                                <tr key={day}>
                                    <td className="day-cell">{day}</td>
                                    {timeSlots.map((timeSlot) => (
                                        <td key={timeSlot} className={getSlotContent(day, timeSlot) ? 'filled-slot' : 'empty-slot'}>
                                            {getSlotContent(day, timeSlot)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="timetable-legend">
                <span><strong>Legend:</strong> 📘 Lecture Name | 👨‍🏫 Tutor | 🏫 Room Number</span>
            </div>
        </div>
    );
};

export default Timetables;
