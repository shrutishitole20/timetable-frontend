import React, { useState, useEffect } from 'react';
import './Rooms.css';
import api from '../../api';
import { showToast } from '../Toast/Toast';

const Rooms = ({ isAdmin }) => {
    const [roomData, setRoomData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        room_no: '',
        capacity: '',
        name: ''
    });
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await api.get('rooms/');
            setRoomData(res.data);
        } catch (err) {
            console.error("Error fetching rooms:", err);
            showToast("Failed to fetch rooms", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrUpdate = async () => {
        if (!formData.room_no || !formData.capacity) {
            showToast("Room number and capacity are required", "error");
            return;
        }

        try {
            if (selectedId) {
                await api.put(`rooms/${selectedId}/`, formData);
                showToast("Room updated successfully!", "success");
            } else {
                await api.post('rooms/', formData);
                showToast("Room added successfully!", "success");
            }
            fetchRooms();
            resetForm();
        } catch (err) {
            showToast("Error saving room.", "error");
        }
    };

    const handleEdit = (room) => {
        setSelectedId(room.id);
        setFormData({
            room_no: room.room_no,
            capacity: room.capacity,
            name: room.name || ''
        });
        showToast(`Editing Room ${room.room_no}`, "info");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`rooms/${id}/`);
            showToast("Room deleted successfully", "success");
            fetchRooms();
            if (selectedId === id) resetForm();
        } catch (err) {
            showToast("Error deleting room.", "error");
        }
    };

    const resetForm = () => {
        setSelectedId(null);
        setFormData({ room_no: '', capacity: '', name: '' });
    };

    const filteredRooms = roomData.filter(room =>
        room.room_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.name && room.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="rooms-container fade-in">
            <div className="rooms-header-bar">
                Lecture Rooms Inventory
            </div>

            <div className="rooms-content">
                {/* Left Side: Form */}
                {isAdmin && (
                    <div className="room-form-section">
                        <h3 className="form-title">{selectedId ? 'Edit Room' : 'Add New Room'}</h3>
                        <div className="form-row">
                            <label>Room no. :</label>
                            <input name="room_no" value={formData.room_no} onChange={handleInputChange} type="text" placeholder="e.g. R101" />
                        </div>
                        <div className="form-row">
                            <label>Capacity:</label>
                            <input name="capacity" value={formData.capacity} onChange={handleInputChange} type="number" placeholder="e.g. 50" />
                        </div>
                        <div className="form-row">
                            <label>Room Name (Optional):</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Lab 1" />
                        </div>

                        <div className="buttons-group">
                            <button className="btn-add" onClick={handleAddOrUpdate}>
                                {selectedId ? '💾 UPDATE ROOM' : '➕ ADD ROOM'}
                            </button>
                            {selectedId && (
                                <button className="btn-action" onClick={resetForm} style={{ backgroundColor: '#999' }}>✖ CANCEL</button>
                            )}
                        </div>
                    </div>
                )}

                {/* Right Side: Table */}
                <div className="room-table-section" style={{ width: isAdmin ? undefined : '100%' }}>
                    <div className="table-controls">
                        <div className="search-box">
                            <i>🔍</i>
                            <input
                                type="text"
                                placeholder="Search by number or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <span className="results-count">Total: {filteredRooms.length} rooms</span>
                    </div>

                    <div className="table-wrapper">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading rooms...</p>
                            </div>
                        ) : (
                            <table className="room-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Room No</th>
                                        <th>Capacity</th>
                                        <th>Room Name</th>
                                        {isAdmin && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRooms.length > 0 ? (
                                        filteredRooms.map((room) => (
                                            <tr key={room.id}>
                                                <td>#{room.id}</td>
                                                <td><span className="code-badge">{room.room_no}</span></td>
                                                <td><strong>{room.capacity}</strong> seats</td>
                                                <td>{room.name || '---'}</td>
                                                {isAdmin && (
                                                    <td>
                                                        <div className="action-btns">
                                                            <button className="btn-table-edit" title="Edit" onClick={() => handleEdit(room)}>✏️</button>
                                                            <button className="btn-table-delete" title="Delete" onClick={() => handleDelete(room.id)}>🗑️</button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={isAdmin ? "5" : "4"} className="empty-row">No rooms found</td></tr>
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

export default Rooms;
