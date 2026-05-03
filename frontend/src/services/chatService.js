const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Gọi API lấy ID cuộc trò chuyện của một người dùng
 * @param {string|number} userId ID của người dùng
 * @returns {Promise<number>} ID của cuộc trò chuyện
 */
export const apiGetConversation = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/conversation`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể lấy thông tin cuộc trò chuyện.');
  }

  // API trả về kiểu dữ liệu là số nguyên đại diện cho ID cuộc trò chuyện
  const data = await response.json();
  return data;
};

/**
 * Gọi API lấy danh sách tin nhắn của một cuộc trò chuyện
 * @param {string|number} userId ID của người dùng
 * @param {string|number} conversationId ID của cuộc trò chuyện
 * @returns {Promise<Array>} Danh sách tin nhắn
 */
export const apiGetMessages = async (userId, conversationId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/Message?idConversation=${conversationId}`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách tin nhắn.');
  }

  const data = await response.json();
  return data;
};

/**
 * Gọi API lấy danh sách cuộc trò chuyện cho Admin
 * @returns {Promise<Array>} Danh sách cuộc trò chuyện
 */
export const apiGetAdminConversations = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/managerChat`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Không thể lấy danh sách cuộc trò chuyện quản trị.');
  }

  const data = await response.json();
  return data;
};

/**
 * Xóa cuộc trò chuyện
 * @param {string|number} id ID của cuộc trò chuyện
 * @returns {Promise<string>} Thông báo kết quả
 */
export const apiDeleteConversation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/managerChat`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {  
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id),
  });

  if (!response.ok) {
    throw new Error('Không thể xóa cuộc trò chuyện.');
  }

  const text = await response.text();
  return text;
};
