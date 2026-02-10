import React, { useState } from 'react';

export default function UploadModal({ isOpen, onClose, onSubmit }) {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!file) return alert('Please select a file');

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('source', 'Hand'); // Explicitly Hand for uploads

        try {
            await onSubmit(formData);
        } catch (error) {
            alert('Upload failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Upload File (Scan)</h2>

                <div className="input-group">
                    <label>Select File</label>
                    <input type="file" onChange={e => setFile(e.target.files[0])} disabled={isSubmitting} />
                </div>

                <div className="input-group">
                    <label>Description (Optional - AI will auto-generate from file)</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Leave empty to let Gemini analyze the document..."
                        disabled={isSubmitting}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn" style={{ flex: 1, background: '#e2e8f0' }} onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
}
