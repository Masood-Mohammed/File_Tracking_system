import React, { useState, useEffect } from 'react';
import { getFiles, getDeletedFiles } from '../api';
import { Search, Calendar } from 'lucide-react';

export default function Registers({ user }) {
    const [activeTab, setActiveTab] = useState('inward'); // 'inward' | 'outward' | 'deleted'
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Date Filters (Default to Last 30 Days)
    const today = new Date();
    const last30Days = new Date(new Date().setDate(today.getDate() - 30));

    const [startDate, setStartDate] = useState(last30Days.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            let data = [];
            if (activeTab === 'deleted') {
                data = await getDeletedFiles();
            } else {
                // Inward: All files created in range. 
                // Outward: Completed files in range.
                const status = activeTab === 'outward' ? 'Completed' : '';
                data = await getFiles(user.role, user.id, status, startDate, endDate);
            }
            setFiles(data);
        } catch (error) {
            console.error("Failed to fetch registers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, startDate, endDate, user]);

    // Filter by search query (Client-side for now as per requirement "Add a search bar to filter records")
    const filteredFiles = files.filter(file => {
        const lowerQ = searchQuery.toLowerCase();

        if (activeTab === 'deleted') {
            return (
                file.original_file_id?.toString().includes(lowerQ) ||
                file.grievance_summary?.toLowerCase().includes(lowerQ) ||
                file.deletion_reason?.toLowerCase().includes(lowerQ) ||
                file.category?.toLowerCase().includes(lowerQ)
            );
        }

        return (
            file.id.toString().includes(lowerQ) ||
            file.grievance_summary?.toLowerCase().includes(lowerQ) ||
            file.source?.toLowerCase().includes(lowerQ) ||
            file.category?.toLowerCase().includes(lowerQ)
        );
    });

    return (
        <div className="card" style={{ maxWidth: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Registers</h2>

                {/* Tabs */}
                <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
                    <button
                        className="btn"
                        style={{
                            background: activeTab === 'inward' ? 'white' : 'transparent',
                            color: activeTab === 'inward' ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: activeTab === 'inward' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onClick={() => setActiveTab('inward')}
                    >
                        Inward Register
                    </button>
                    <button
                        className="btn"
                        style={{
                            background: activeTab === 'outward' ? 'white' : 'transparent',
                            color: activeTab === 'outward' ? 'var(--primary)' : 'var(--text-muted)',
                            boxShadow: activeTab === 'outward' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onClick={() => setActiveTab('outward')}
                    >
                        Outward Register
                    </button>
                    <button
                        className="btn"
                        style={{
                            background: activeTab === 'deleted' ? 'white' : 'transparent',
                            color: activeTab === 'deleted' ? '#dc2626' : 'var(--text-muted)',
                            boxShadow: activeTab === 'deleted' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                        }}
                        onClick={() => setActiveTab('deleted')}
                    >
                        Deleted
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem 1rem', flex: 1 }}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder={activeTab === 'deleted' ? "Search deleted records..." : "Search by ID, keyword..."}
                        style={{ border: 'none', outline: 'none', width: '100%' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {activeTab !== 'deleted' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem' }}>
                            <Calendar size={16} color="#64748b" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>From:</span>
                            <input
                                type="date"
                                style={{ border: 'none', outline: 'none', fontFamily: 'inherit' }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem' }}>
                            <Calendar size={16} color="#64748b" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>To:</span>
                            <input
                                type="date"
                                style={{ border: 'none', outline: 'none', fontFamily: 'inherit' }}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                            {activeTab === 'deleted' ? (
                                <>
                                    <th style={{ padding: '0.75rem' }}>Original ID</th>
                                    <th style={{ padding: '0.75rem' }}>Deleted Date</th>
                                    <th style={{ padding: '0.75rem' }}>Category</th>
                                    <th style={{ padding: '0.75rem' }}>Summary</th>
                                    <th style={{ padding: '0.75rem' }}>Reason for Deletion</th>
                                </>
                            ) : (
                                <>
                                    <th style={{ padding: '0.75rem' }}>File ID</th>
                                    <th style={{ padding: '0.75rem' }}>Date</th>
                                    <th style={{ padding: '0.75rem' }}>Source</th>
                                    <th style={{ padding: '0.75rem' }}>Category</th>
                                    <th style={{ padding: '0.75rem' }}>Summary</th>
                                    {activeTab === 'inward' && <th style={{ padding: '0.75rem' }}>Current Status</th>}
                                    {activeTab === 'outward' && <th style={{ padding: '0.75rem' }}>Completed By</th>}
                                    {activeTab === 'outward' && <th style={{ padding: '0.75rem' }}>Outcome</th>}
                                    {activeTab === 'outward' && <th style={{ padding: '0.75rem' }}>Remarks</th>}
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
                        ) : filteredFiles.length === 0 ? (
                            <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No records found.</td></tr>
                        ) : (
                            filteredFiles.map(file => (
                                <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {activeTab === 'deleted' ? (
                                        <>
                                            <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>#{file.original_file_id}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {file.deleted_at ? new Date(file.deleted_at).toLocaleString() : 'N/A'}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span className={`tag tag-priority-${file.priority}`}>{file.category}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.grievance_summary}>
                                                {file.grievance_summary}
                                            </td>
                                            <td style={{ padding: '0.75rem', color: '#dc2626', fontWeight: 500 }}>
                                                {file.deletion_reason}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>#{file.id}</td>
                                            <td style={{ padding: '0.75rem' }}>{new Date(file.created_at).toLocaleDateString()}</td>
                                            <td style={{ padding: '0.75rem' }}>{file.source}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span className={`tag tag-priority-${file.priority}`}>{file.category}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.grievance_summary}>
                                                {file.grievance_summary}
                                            </td>

                                            {activeTab === 'inward' && (
                                                <td style={{ padding: '0.75rem' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 500 }}>{file.status}</span>
                                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Owner: {file.current_officer || 'Unassigned'}</span>
                                                    </div>
                                                </td>
                                            )}

                                            {activeTab === 'outward' && (
                                                <>
                                                    <td style={{ padding: '0.75rem' }}>{file.current_officer}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            color: file.outcome === 'Rejected' ? '#dc2626' : '#166534',
                                                            background: file.outcome === 'Rejected' ? '#fef2f2' : '#dcfce7',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 500
                                                        }}>
                                                            {file.outcome || file.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                                                        {file.closing_remarks || '-'}
                                                    </td>
                                                </>
                                            )}
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
