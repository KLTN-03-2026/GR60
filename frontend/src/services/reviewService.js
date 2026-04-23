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
