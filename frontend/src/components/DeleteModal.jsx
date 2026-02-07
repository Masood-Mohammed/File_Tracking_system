import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(reason);
        setReason('');
    };

    return (
        <div className="modal-overlay">
            <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#dc2626' }}>Delete Grievance</h2>
                    <button onClick={onClose} style={{ background: 'transparent', padding: '0.25rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <p>Are you sure you want to delete this grievance? This action cannot be undone and will be logged.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="reason">Reason for Deletion <span style={{ color: 'red' }}>*</span></label>
                        <textarea
                            id="reason"
                            rows="3"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide a reason..."
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn" style={{ background: '#f1f5f9', flex: 1 }} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn"
                            style={{
                                background: '#dc2626',
                                color: 'white',
                                flex: 1,
                                opacity: reason.trim() ? 1 : 0.6,
                                cursor: reason.trim() ? 'pointer' : 'not-allowed'
                            }}
                            disabled={!reason.trim()}
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteModal;
