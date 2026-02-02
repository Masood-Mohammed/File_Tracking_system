import React from 'react';

export default function HistoryModal({ isOpen, onClose, history, file }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="card" style={{ maxWidth: '600px' }}>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>File History #{file?.id}</h2>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {history.length === 0 ? (
                        <p>No movements recorded.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {history.map((move, idx) => (
                                <div key={idx} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem', position: 'relative' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(move.timestamp).toLocaleString()}</div>
                                    <div style={{ fontWeight: 600 }}>
                                        {move.from_officer} → {move.to_officer}
                                    </div>
                                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: '#334155' }}>
                                        "{move.remarks || 'No remarks'}"
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                    <button className="btn" style={{ background: '#e2e8f0' }} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
