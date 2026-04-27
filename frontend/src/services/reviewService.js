const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Fetch all reviews
 * @returns {Promise<Array>} List of reviews
 */
export const apiGetReviews = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`);
    if (res.ok) {
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      // Lọc bỏ những đánh giá không có nội dung
      return data.filter(r => r.noi_dung);
    }
    return [];
  } catch (err) {
    console.error('Lỗi khi tải đánh giá:', err);
    return [];
  }
};

/**
 * Fetch reviews for a specific room
 * @param {string|number} roomId 
 * @returns {Promise<Array>} List of reviews
 */
export const apiGetRoomReviews = async (roomId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/rooms/${roomId}/review`);
    if (res.ok) {
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      return data.filter(r => r.noi_dung);
    }
    return [];
  } catch (err) {
    console.error(`Lỗi khi tải đánh giá cho phòng ${roomId}:`, err);
    return [];
  }
};
/**
 * Add a new review for a room
 * @param {string|number} roomId 
 * @param {Object} reviewData { idUser, So_Sao, Noi_Dung }
 */
export const apiAddReview = async (roomId, reviewData) => {
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

  const res = await fetch(`${API_BASE_URL}/reviews?idroom=${roomId}`, {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(reviewData),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Not JSON
  }

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const errorMsg = data?.message || text || 'Đã có lỗi xảy ra';
    throw new Error(errorMsg);
  }

  return data;
};
