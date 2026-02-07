const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BASE_URL = API_URL.replace('/api', '');

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

export const deleteFile = async (fileId, reason) => {
    const res = await fetch(`${API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
    });

    if (!res.ok) {
        const text = await res.text();
        try {
            const err = JSON.parse(text);
            throw new Error(err.error || 'Failed to delete file');
        } catch (e) {
            console.error("Non-JSON error response:", text);
            throw new Error(`Server error (${res.status}): Please check console for details.`);
        }
    }
    return res.json();
};

export const getAnalytics = async (category) => {
    let url = `${API_URL}/files/analytics`;
    if (category && category !== 'All') {
        url += `?category=${category}`;
    }
    const res = await fetch(url);
    return res.json();
};

export const setupUsers = async () => {
    await fetch(`${API_URL}/auth/setup`, { method: 'POST' });
};

export const getDeletedFiles = async () => {
    const res = await fetch(`${API_URL}/files/deleted`);
    return res.json();
};

export const getUsers = async () => {
    const res = await fetch(`${API_URL}/auth/users`);
    return res.json();
};
