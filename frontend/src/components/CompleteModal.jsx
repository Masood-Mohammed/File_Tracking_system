import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

const CompleteModal = ({ isOpen, onClose, onSubmit }) => {
    const [outcome, setOutcome] = useState('Completed Successfully');
    const [remarks, setRemarks] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(outcome, remarks);
        setOutcome('Completed Successfully'); // Reset
        setRemarks('');
    };

    return (
        <div className="modal-overlay">
            <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Complete File</h2>
                    <button onClick={onClose} style={{ background: 'transparent', padding: '0.25rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Outcome</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    background: outcome === 'Completed Successfully' ? '#dcfce7' : '#f1f5f9',
                                    color: outcome === 'Completed Successfully' ? '#166534' : '#64748b',
                                    border: outcome === 'Completed Successfully' ? '1px solid #166534' : '1px solid transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                }}
                                onClick={() => setOutcome('Completed Successfully')}
                            >
                                <CheckCircle size={16} /> Successful
                            </button>
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    background: outcome === 'Rejected' ? '#fef2f2' : '#f1f5f9',
                                    color: outcome === 'Rejected' ? '#dc2626' : '#64748b',
                                    border: outcome === 'Rejected' ? '1px solid #dc2626' : '1px solid transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                }}
                                onClick={() => setOutcome('Rejected')}
                            >
                                <XCircle size={16} /> Rejected
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="remarks">Remarks (Optional)</label>
                        <textarea
                            id="remarks"
                            rows="3"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add any finishing comments..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn" style={{ background: '#f1f5f9', flex: 1 }} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            Mark as Complete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteModal;
