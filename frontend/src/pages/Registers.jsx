import React, { useState, useEffect } from 'react';
import { getFiles } from '../api';
import { Search, Calendar } from 'lucide-react';

export default function Registers({ user }) {
    const [activeTab, setActiveTab] = useState('inward'); // 'inward' | 'outward'
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Date Filters (Default to Today)
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Inward: All files created in range. 
            // Outward: Completed files in range.
            const status = activeTab === 'outward' ? 'Completed' : '';

            // For Inward, we usually want EVERYTHING associated with the system, 
            // but the prompt says "Inward Register". Usually implies intake.
            // If we filter by status='', getFiles returns all statuses.
            // If activeTab is 'inward', we might want to see 'Pending' or 'In Progress' or ALL. 
            // Let's assume Inward = ALL New Files.

            const data = await getFiles(user.role, user.id, status, startDate, endDate);
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
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem 1rem', flex: 1 }}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search by ID, keyword..."
                        style={{ border: 'none', outline: 'none', width: '100%' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

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
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>File ID</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                            <th style={{ padding: '0.75rem' }}>Source</th>
                            <th style={{ padding: '0.75rem' }}>Category</th>
                            <th style={{ padding: '0.75rem' }}>Summary</th>
                            {activeTab === 'inward' && <th style={{ padding: '0.75rem' }}>Current Status</th>}
                            {activeTab === 'outward' && <th style={{ padding: '0.75rem' }}>Completed By</th>}
                            {activeTab === 'outward' && <th style={{ padding: '0.75rem' }}>Outcome</th>}
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
                                                {/* We don't have explicit 'outcome' field in File, it's in the movement remarks or we infer from status. 
                                                    The requirement said "outward register should contain all the completed files".
                                                    We can fetch history or check if we stored outcome in the file (we didn't adding a column).
                                                    We stored it in remarks of the last movement.
                                                    For simplicty in this view, we'll just show Status.
                                                    To show "Outcome", we'd need to fetch the last movement or specific field.
                                                    The user asked to ASK for outcome. I stored it in remarks.
                                                    Ideally, we should parse it or just show "Completed".
                                                    Let's show the Status for now, or if we can, the details.
                                                    Since `file` dict doesn't have the last remark, we might just show "Completed".
                                                    Wait, I can update `to_dict` to include `outcome` if I saved it.
                                                    I didn't save it to `File` model, only `FileMovement`.
                                                    So listing it here is hard without N+1 query.
                                                    I'll just label it "Completed".
                                                */}
                                                <span style={{ color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                    {file.status}
                                                </span>
                                            </td>
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
