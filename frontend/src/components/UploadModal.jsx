import React, { useState } from 'react';

export default function UploadModal({ isOpen, onClose, onSubmit }) {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!file) return alert('Please select a file');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('source', 'Hand'); // Explicitly Hand for uploads
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="card">
                <h2 style={{ marginTop: 0 }}>Upload File (Scan)</h2>

                <div className="input-group">
                    <label>Select File</label>
                    <input type="file" onChange={e => setFile(e.target.files[0])} />
                </div>

                <div className="input-group">
                    <label>Description (Optional - AI will auto-generate from file)</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Leave empty to let Gemini analyze the document..."
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="btn" style={{ flex: 1, background: '#e2e8f0' }} onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>Upload</button>
                </div>
            </div>
        </div>
    );
}
