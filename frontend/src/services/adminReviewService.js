const API_BASE_URL = 'https://localhost:7092/api';

const getAuthHeaders = () => {
    const stored = localStorage.getItem('homestayUser');
    let headers = {
        'Content-Type': 'application/json',
    };
    if (stored) {
        const user = JSON.parse(stored);
        const token = user.token || user.Token;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
};

export const apiGetAdminReviews = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/ReviewManager`, {
            headers: getAuthHeaders(),
            credentials: 'include'
        });
        
        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            throw new Error('Unauthorized');
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const text = await response.text();
        return text ? JSON.parse(text) : [];
    } catch (err) {
        console.error('Lỗi khi fetch admin reviews:', err);
        throw err;
    }
};

export const apiReplyReview = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/ReviewManager/phanhoi`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            throw new Error('Unauthorized');
        }

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            data = {};
        }

        // Theo mô tả của user, endpoint có thể trả về 201 hoặc 500
        // và field là statusCode hoặc StatusCode
        const status = data.statusCode || data.StatusCode || response.status;
        if (!response.ok || status === 500) {
            throw new Error(data.message || data.Message || `Lỗi hệ thống: ${status}`);
        }

        return data;
    } catch (err) {
        console.error('Lỗi khi gửi phản hồi:', err);
        throw err;
    }
};

export const apiDeleteReview = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/ReviewManager/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            throw new Error('Unauthorized');
        }

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            data = {};
        }

        const status = data.statusCode || data.StatusCode || response.status;
        if (!response.ok || status === 500) {
            throw new Error(data.message || data.Message || `Lỗi hệ thống: ${status}`);
        }

        return data;
    } catch (err) {
        console.error('Lỗi khi xóa đánh giá:', err);
        throw err;
    }
};

export const apiEditReply = async (idPhanHoi, noiDung) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/ReviewManager/phanhoi/${idPhanHoi}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(noiDung),
            credentials: 'include'
        });

        if (response.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            throw new Error('Unauthorized');
        }

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            data = {};
        }

        const status = data.statusCode || data.StatusCode || response.status;
        if (!response.ok || status === 500) {
            throw new Error(data.message || data.Message || `Lỗi hệ thống: ${status}`);
        }

        return data;
    } catch (err) {
        console.error('Lỗi khi sửa phản hồi:', err);
        throw err;
    }
};
