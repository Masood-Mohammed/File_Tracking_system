import React, { useState, useRef, useEffect } from 'react';
import { Clock, Archive, User, FileText, ExternalLink, History } from 'lucide-react';
import { BASE_URL } from '../api';

export default function FileCard({ file, userRole, currentUserId, onForward, onComplete, onViewHistory, onDelete, onUpdate, isExpanded }) {
    const isCompleted = file.status === 'Completed';

    const handleForwardClick = () => {
        // Strict Int Comparison to avoid string/number mismatch
        if (file.current_officer_id && parseInt(file.current_officer_id) !== parseInt(currentUserId)) {
            alert("This action cannot be done: You are not the current holder of this file.");
            return;
        }
        onForward(file);
    };

    const cardStyle = isExpanded ? {
        gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: '350px 1fr', // Sidebar (details) + Preview
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
    } : {};

    // If mobile, checking window width would be better, but for now CSS media queries on .file-card would be better if we used classes.
    // However, inline styles override classes. We'll handle responsive in CSS if possible or rely on grid behavior.

    // Actually, let's use a class for expanded state to handle responsive better.
    // But since I'm injecting styles here:

    return (
        <div className={`file-card ${isExpanded ? 'expanded-card' : ''}`} style={isExpanded ? { gridColumn: '1/-1' } : {}}>

            {/* If expanded, we split layout. If not, normal layout. 
                Constructing a flexible layout:
            */}

            <div className="file-card-content" style={isExpanded ? { display: 'flex', gap: '2rem', flexWrap: 'wrap' } : {}}>

                <div className="file-details" style={isExpanded ? { flex: '0 0 350px' } : { width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', background: '#f8fafc', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            ID: {file.id}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(file.created_at).toLocaleDateString()}</span>
                    </div>

                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={`tag tag-priority-${file.priority}`}>{file.priority} Priority</span>
                        {file.is_edited && (
                            <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 'bold' }}>(Edited)</span>
                        )}
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

                        {file.file_path && !isExpanded && (
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
                            <History size={14} /> <span style={{ textDecoration: 'underline' }}>Workflow</span>
                        </div>

                    </div>

                    {!isCompleted && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button className="btn" style={{ background: '#f1f5f9', flex: 1 }} onClick={handleForwardClick}>
                                Forward
                            </button>

                            <button className="btn" style={{ background: '#e0f2fe', color: '#0369a1', flex: 1 }} onClick={() => onUpdate(file)}>
                                Update
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
                                    Delete Request
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
                </div>

                {/* Preview Section for Expanded Card */}
                {isExpanded && file.file_path && (
                    <FilePreview file={file} />
                )}
            </div>
        </div >
    );
}

function FilePreview({ file }) {
    if (file.file_path.endsWith('.pdf')) {
        return (
            <div className="file-preview" style={{ flex: 1, minHeight: '500px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <iframe
                    src={`${BASE_URL}${file.file_path}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', height: '600px' }}
                    title="Document Preview"
                />
            </div>
        );
    } else {
        return <ImagePreview url={`${BASE_URL}${file.file_path}`} />;
    }
}

function ImagePreview({ url }) {
    const [isZoomed, setIsZoomed] = useState(false);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

    // We use a ref to track if we are dragging to prevent click-toggle on drag end
    const isDraggingRef = useRef(false);

    const toggleZoom = () => {
        if (isDraggingRef.current) return;
        setIsZoomed(!isZoomed);
    };

    const handleMouseDown = (e) => {
        if (!isZoomed) return;
        e.preventDefault();
        setIsDragging(true);
        isDraggingRef.current = false;
        setStartPos({ x: e.pageX, y: e.pageY });
        if (containerRef.current) {
            setScrollPos({
                left: containerRef.current.scrollLeft,
                top: containerRef.current.scrollTop
            });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();

        // Calculate distance
        const walkX = (e.pageX - startPos.x); // Scroll-fast multiplier can be added if needed
        const walkY = (e.pageY - startPos.y);

        if (Math.abs(walkX) > 5 || Math.abs(walkY) > 5) {
            isDraggingRef.current = true;
        }

        containerRef.current.scrollLeft = scrollPos.left - walkX;
        containerRef.current.scrollTop = scrollPos.top - walkY;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // We don't reset isDraggingRef here immediately to allow onClick to check it
        setTimeout(() => { isDraggingRef.current = false; }, 0);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        isDraggingRef.current = false;
    };

    return (
        <div
            className="file-preview"
            ref={containerRef}
            style={{
                flex: 1,
                minHeight: '500px',
                height: '600px',
                background: '#f1f5f9',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden', // Hide scrollbars
                display: 'flex',
                alignItems: isZoomed ? 'flex-start' : 'center',
                justifyContent: isZoomed ? 'flex-start' : 'center',
                position: 'relative',
                cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={url}
                alt="Document Preview"
                onClick={toggleZoom}
                draggable={false}
                style={{
                    maxWidth: isZoomed ? 'none' : '100%',
                    maxHeight: isZoomed ? 'none' : '600px',
                    objectFit: 'contain',
                    transform: isZoomed ? 'scale(1.2)' : 'none',
                    transformOrigin: 'top left',
                    transition: isDragging ? 'none' : 'transform 0.2s',
                    pointerEvents: 'auto'
                }}
            />
        </div>
    );
}
