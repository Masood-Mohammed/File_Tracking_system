import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function UpdateModal({ isOpen, onClose, onSubmit, file }) {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (file) {
            setDescription(file.grievance_summary || '');
            setCategory(file.category || '');
        }
    }, [file, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(description, category);
        } catch (error) {
            console.error("Update failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Update Description</h3>
                    <button onClick={onClose} disabled={isSubmitting} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Request Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="input-group" style={{ marginTop: '1rem' }}>
                        <label>Title (Category)</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : (
                                <>
                                    <Save size={18} style={{ marginRight: '0.5rem' }} /> Update
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
