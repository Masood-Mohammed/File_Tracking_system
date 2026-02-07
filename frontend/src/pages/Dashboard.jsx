import React, { useEffect, useState } from 'react';
import { getFiles, forwardFile, completeFile, getHistory, uploadFile, deleteFile, getUsers } from '../api';
import FileCard from '../components/FileCard';
import ActionModal from '../components/ActionModal';
import HistoryModal from '../components/HistoryModal';
import UploadModal from '../components/UploadModal';
import CompleteModal from '../components/CompleteModal';
import DeleteModal from '../components/DeleteModal';
import { RefreshCw, Plus } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
    const [files, setFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState(''); // '' = All, 'Pending', 'Completed'

    const [selectedFile, setSelectedFile] = useState(null);

    const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [fileHistory, setFileHistory] = useState([]);

    const fetchData = async () => {
        const data = await getFiles(user.role, user.id, statusFilter);
        setFiles(data);
    };

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data.filter(u => u.id !== user.id));
    }

    useEffect(() => {
        fetchData();
    }, [user, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleForward = (file) => {
        setSelectedFile(file);
        setIsForwardModalOpen(true);
    };

    const handleHistory = async (file) => {
        const history = await getHistory(file.id);
        setFileHistory(history);
        setIsHistoryModalOpen(true);
    };

    const handleUpload = async (formData) => {
        await uploadFile(formData);
        setIsUploadModalOpen(false);
        fetchData();
        alert('File uploaded successfully!');
    };

    const submitForward = async (toUser, remarks) => {
        await forwardFile(selectedFile.id, {
            from_user_id: user.id,
            to_user_id: toUser,
            remarks
        });
        setIsForwardModalOpen(false);
        fetchData();
    };

    const handleComplete = (file) => {
        setSelectedFile(file);
        setIsCompleteModalOpen(true);
    };

    const submitComplete = async (outcome, remarks) => {
        await completeFile(selectedFile.id, user.id, outcome, remarks);
        setIsCompleteModalOpen(false);
        fetchData();
    };

    const handleDelete = (file) => {
        setSelectedFile(file);
        setIsDeleteModalOpen(true);
    };

    const submitDelete = async (reason) => {
        try {
            await deleteFile(selectedFile.id, reason);
            setIsDeleteModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.message || 'Failed to delete file');
        }
    };

    return (
        <div className="dashboard-container">
            <header className="header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Dashboard</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Upload File
                    </button>
                    <button className="btn" onClick={fetchData} style={{ background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </header>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    className={`btn ${statusFilter === '' ? 'btn-primary' : ''}`}
                    style={statusFilter === '' ? {} : { background: 'white', border: '1px solid #e2e8f0' }}
                    onClick={() => setStatusFilter('')}
                >
                    All Files
                </button>
                <button
                    className={`btn ${statusFilter === 'Pending' ? 'btn-primary' : ''}`}
                    style={statusFilter === 'Pending' ? {} : { background: 'white', border: '1px solid #e2e8f0' }}
                    onClick={() => setStatusFilter('Pending')}
                >
                    Pending
                </button>
                <button
                    className={`btn ${statusFilter === 'Completed' ? 'btn-primary' : ''}`}
                    style={statusFilter === 'Completed' ? {} : { background: 'white', border: '1px solid #e2e8f0' }}
                    onClick={() => setStatusFilter('Completed')}
                >
                    Completed
                </button>
            </div>

            <div className="grid">
                {files.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        No files found.
                    </div>
                ) : (
                    files.map(file => (
                        <FileCard
                            key={file.id}
                            file={file}
                            userRole={user.role}
                            onForward={handleForward}
                            onComplete={handleComplete}
                            onViewHistory={handleHistory}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            <ActionModal
                isOpen={isForwardModalOpen}
                onClose={() => setIsForwardModalOpen(false)}
                onSubmit={submitForward}
                users={users}
                file={selectedFile}
            />

            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                history={fileHistory}
                file={selectedFile}
            />

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSubmit={handleUpload}
            />

            <CompleteModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                onSubmit={submitComplete}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSubmit={submitDelete}
            />
        </div>
    );
}
