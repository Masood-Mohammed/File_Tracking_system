import React from 'react';
import { Clock, Archive, User, FileText, ExternalLink, History } from 'lucide-react';
import { BASE_URL } from '../api';

export default function FileCard({ file, userRole, onForward, onComplete, onViewHistory, onDelete }) {
    const isCompleted = file.status === 'Completed';

    return (
        <div className="file-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', background: '#f8fafc', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    ID: {file.id}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(file.created_at).toLocaleDateString()}</span>
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
                <span className={`tag tag-priority-${file.priority}`}>{file.priority} Priority</span>
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{file.category}</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem', lineHeight: '1.5' }}>
                {file.grievance_summary}
            </p>

            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={14} /> <span>Current: {file.current_officer || "Unassigned"}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Archive size={14} /> <span>Dept: {file.department}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={14} /> <span>Source: {file.source}</span>
                </div>

                {file.file_path && (
                    <div style={{ marginTop: '0.5rem' }}>
                        <a
                            href={`${BASE_URL}${file.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                background: 'var(--primary)',
                                color: 'white',
                                fontSize: '0.85rem',
                                padding: '0.4rem 0.8rem'
                            }}
                        >
                            <ExternalLink size={14} /> View Scanned Document
                        </a>
                    </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', marginTop: '0.5rem' }} onClick={() => onViewHistory(file)}>
                    <History size={14} /> <span style={{ textDecoration: 'underline' }}>View History</span>
                </div>
            </div>

            {!isCompleted && (
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ background: '#f1f5f9', flex: 1 }} onClick={() => onForward(file)}>
                        Forward
                    </button>

                    <button className="btn" style={{ background: '#dcfce7', color: '#166534', flex: 1 }} onClick={() => onComplete(file)}>
                        Complete
                    </button>
                </div>
            )}

            {
                (userRole === 'collector' || userRole === 'secretary') && (
                    <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                        <button className="btn" style={{ background: '#fef2f2', color: '#dc2626', width: '100%', fontSize: '0.85rem' }} onClick={() => onDelete(file)}>
                            Delete Grievance
                        </button>
                    </div>
                )
            }

            {
                isCompleted && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#f0fdf4', color: '#166534', textAlign: 'center', borderRadius: '6px' }}>
                        Completed
                    </div>
                )
            }
        </div >
    );
}
