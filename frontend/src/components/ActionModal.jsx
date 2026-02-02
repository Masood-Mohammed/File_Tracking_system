import React, { useState } from 'react';

export default function ActionModal({ isOpen, onClose, onSubmit, users, file }) {
    const [toUser, setToUser] = useState('');
    const [remarks, setRemarks] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Forward File #{file?.id}</h2>

                <div className="input-group">
                    <label>Assign To</label>
                    <select value={toUser} onChange={(e) => setToUser(e.target.value)}>
                        <option value="">Select Officer</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label>Remarks</label>
                    <textarea
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add remarks..."
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn" style={{ flex: 1, background: '#e2e8f0' }} onClick={onClose}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => onSubmit(toUser, remarks)}
                        disabled={!toUser}
                    >
                        Forward
                    </button>
                </div>
            </div>
        </div>
    );
}
