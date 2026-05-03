export const apiGetAdminHolidays = async () => {
    const token = localStorage.getItem('homestayUser') ? JSON.parse(localStorage.getItem('homestayUser')).token : null;
    
    const response = await fetch('https://localhost:7092/api/admin/HolidayManager', {
        method: 'GET',
        credentials: 'include',

        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });

    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        throw new Error('Lỗi khi lấy danh sách ngày lễ');
    }

    return await response.json();
};

export const apiAddAdminHoliday = async (holidayData) => {
    const token = localStorage.getItem('homestayUser') ? JSON.parse(localStorage.getItem('homestayUser')).token : null;
    
    const response = await fetch('https://localhost:7092/api/admin/HolidayManager', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(holidayData)
    });

    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Unauthorized');
    }

    const result = await response.json();
    
    if (result.statusCode !== 201) {
        throw new Error(result.message || 'Thêm ngày lễ thất bại');
    }

    return result;
};

export const apiUpdateAdminHoliday = async (id, holidayData) => {
    const token = localStorage.getItem('homestayUser') ? JSON.parse(localStorage.getItem('homestayUser')).token : null;
    
    const response = await fetch(`https://localhost:7092/api/admin/HolidayManager/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(holidayData)
    });

    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Unauthorized');
    }

    const result = await response.json();
    
    if (result.statusCode !== 201) {
        throw new Error(result.message || 'Sửa ngày lễ thất bại');
    }

    return result;
};

export const apiDeleteAdminHoliday = async (id) => {
    const token = localStorage.getItem('homestayUser') ? JSON.parse(localStorage.getItem('homestayUser')).token : null;
    
    const response = await fetch(`https://localhost:7092/api/admin/HolidayManager/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });

    if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Unauthorized');
    }

    // According to user, success is 204. DELETE often returns no content.
    // Let's check if there's a response body to parse.
    const result = response.status !== 204 ? await response.json() : { statusCode: 204, message: "Xóa ngày lễ thành công" };
    
    if (result.statusCode !== 204 && response.status !== 204) {
        throw new Error(result.message || 'Xóa ngày lễ thất bại');
    }

    return result;
};

