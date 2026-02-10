import React, { useState, useEffect } from 'react';
import { getDeletedFiles } from '../api';
import { Search } from 'lucide-react';

export default function DeletedRequests() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getDeletedFiles();
            setFiles(data);
        } catch (error) {
            console.error("Failed to fetch deleted files", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter by search query
    const filteredFiles = files.filter(file => {
        const lowerQ = searchQuery.toLowerCase();
        return (
            file.original_file_id?.toString().includes(lowerQ) ||
            file.grievance_summary?.toLowerCase().includes(lowerQ) ||
            file.deletion_reason?.toLowerCase().includes(lowerQ) ||
            file.category?.toLowerCase().includes(lowerQ)
        );
    });

    return (
        <div className="card" style={{ maxWidth: '100%', padding: '1.5rem' }}>
            <div className="page-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, color: '#1e40af' }}>Deleted Requests</h2>
                <div className="search-bar-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem 1rem' }}>
                    <Search size={18} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search deleted records..."
                        style={{ border: 'none', outline: 'none', width: '100%' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ background: '#eff6ff', borderBottom: '2px solid #bfdbfe', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem', color: '#1e3a8a' }}>Original ID</th>
                            <th style={{ padding: '0.75rem', color: '#1e3a8a' }}>Deleted Date</th>
                            <th style={{ padding: '0.75rem', color: '#1e3a8a' }}>Category</th>
                            <th style={{ padding: '0.75rem', color: '#1e3a8a' }}>Summary</th>
                            <th style={{ padding: '0.75rem', color: '#1e3a8a' }}>Reason for Deletion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading records...</td></tr>
                        ) : filteredFiles.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No deleted records found.</td></tr>
                        ) : (
                            filteredFiles.map(file => (
                                <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>#{file.original_file_id}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {file.deleted_at ? new Date(file.deleted_at).toLocaleString() : 'N/A'}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span className={`tag tag-priority-${file.priority}`}>{file.category}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem', minWidth: '300px', lineHeight: '1.5' }}>
                                        {file.grievance_summary}
                                    </td>
                                    <td style={{ padding: '0.75rem', color: '#dc2626', fontWeight: 500 }}>
                                        {file.deletion_reason}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
