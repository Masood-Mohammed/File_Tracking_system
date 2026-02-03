const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

export const getFiles = async (role, userId, status, startDate, endDate) => {
    let url = `${API_URL}/files/?role=${role}&user_id=${userId}`;
    if (status) url += `&status=${status}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    const res = await fetch(url);
    return res.json();
};

export const forwardFile = async (fileId, data) => {
    const res = await fetch(`${API_URL}/files/${fileId}/forward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    // Check for 403
    if (res.status === 403) {
        const err = await res.json();
        throw new Error(err.error || 'Unauthorized');
    }
    return res.json();
};

export const completeFile = async (fileId, userId, outcome, remarks) => {
    const res = await fetch(`${API_URL}/files/${fileId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, outcome, remarks })
    });
    return res.json();
};

export const getHistory = async (fileId) => {
    const res = await fetch(`${API_URL}/files/${fileId}/history`);
    return res.json();
};

export const uploadFile = async (formData) => {
    const res = await fetch(`${API_URL}/files/intake`, {
        method: 'POST',
        body: formData // No Content-Type header; fetch adds it with boundary for FormData
    });
    return res.json();
};

export const deleteFile = async (fileId) => {
    const res = await fetch(`${API_URL}/files/${fileId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete file');
    return res.json();
};

export const setupUsers = async () => {
    await fetch(`${API_URL}/auth/setup`, { method: 'POST' });
};
