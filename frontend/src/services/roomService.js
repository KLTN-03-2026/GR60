const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Fetch all room categories concurrently (VIP, Family, Standard)
 * @returns {Promise<Array>} Array of objects containing { id: type, data: [...] }
 */
export const apiGetAllRoomsCategories = async () => {
    const endpoints = [
        { id: 'vip', url: `${API_BASE_URL}/rooms?type=vip` },
        { id: 'family', url: `${API_BASE_URL}/rooms?type=family` },
        { id: 'standard', url: `${API_BASE_URL}/rooms?type=standard` }
    ];

    const results = await Promise.all(
        endpoints.map(async (ep) => {
            try {
                const response = await fetch(ep.url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                const data = text ? JSON.parse(text) : [];
                return { id: ep.id, data };
            } catch (err) {
                console.error(`Lỗi khi fetch api ${ep.url}:`, err);
                return { id: ep.id, data: [] };
            }
        })
    );

    return results;
};

/**
 * Search rooms by criteria
 * @param {Object} searchParams search parameters state 
 * @returns {Promise<Array>} Array of filtered rooms
 */
export const apiSearchRooms = async (searchParams) => {
    const query = new URLSearchParams();
    if (searchParams.DiaChi) query.append('DiaChi', searchParams.DiaChi);
    if (searchParams.MucGiaMin) query.append('MucGiaMin', searchParams.MucGiaMin);
    if (searchParams.MucGiaMax) query.append('MucGiaMax', searchParams.MucGiaMax);
    if (searchParams.SoSao && searchParams.SoSao !== 'all') query.append('SoSao', searchParams.SoSao);
    if (searchParams.SoNguoiLon) query.append('SoNguoiLon', searchParams.SoNguoiLon);
    if (searchParams.SoTreEm) query.append('SoTreEm', searchParams.SoTreEm);

    const url = `${API_BASE_URL}/rooms/roomfind?${query.toString()}`;
    const response = await fetch(url);
    const text = await response.text();
    const data = text ? JSON.parse(text) : [];

    if (!response.ok) {
        // Nếu có message từ backend thì trả về data để Home.jsx xử lý, 
        // nếu không thì mới throw lỗi
        if (data && data.message) return data;
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return data;

};

/**
 * Get rooms by type (vip, family, standard)
 * @param {string} type 
 * @returns {Promise<Array>}
 */
export const apiGetRoomsByType = async (type) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms?type=${type}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : [];
    } catch (err) {
        console.error(`Lỗi khi fetch api rooms type ${type}:`, err);
        return [];
    }
};
export const apiGetRoomById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (err) {
        console.error(`Lỗi khi fetch api room id ${id}:`, err);
        return null;
    }
};

export const apiGetBookedDates = async (roomId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/booking/day?idroom=${roomId}`, {
            method: 'GET',
            credentials: 'include', // Thêm để gửi kèm cookie/token nếu cần
        });
        
        if (!response.ok) {
            console.warn(`API Booked Dates trả về mã lỗi: ${response.status}`);
            return [];
        }

        const text = await response.text();
        return text ? JSON.parse(text) : [];
    } catch (err) {
        console.error(`Lỗi kết nối khi fetch booked dates cho room id ${roomId}:`, err);
        return [];
    }
};


export const apiGetRoomPrice = async (roomId, checkIn, checkOut) => {
    try {
        const ci = `${checkIn.getFullYear()}-${checkIn.getMonth() + 1}-${checkIn.getDate()}`;
        const co = `${checkOut.getFullYear()}-${checkOut.getMonth() + 1}-${checkOut.getDate()}`;
        const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/price?NgayNhanPhong=${ci}&NgayTraPhong=${co}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (err) {
        console.error(`Lỗi khi fetch price cho room id ${roomId}:`, err);
        return null;
    }
};

export const apiGetBookingHistory = async (idUser) => {
    try {
        const response = await fetch(`${API_BASE_URL}/booking?idUser=${idUser}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : [];
    } catch (err) {
        console.error(`Lỗi khi fetch booking history cho user id ${idUser}:`, err);
        return [];
    }
};

export const apiGetBookingDetail = async (bookingId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (err) {
        console.error(`Lỗi khi fetch booking detail cho id ${bookingId}:`, err);
        return null;
    }
};

export const apiGetHomeStayInfo = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/HomeStay`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data[0] : data;
    } catch (err) {
        console.error('Lỗi khi fetch homestay info:', err);
        return null;
    }
};
