const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Lấy danh sách người dùng cho Admin
 * @returns {Promise<Array>}
 */
export const apiGetAdminUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/UserManager`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Lấy danh sách người dùng thất bại');
  }

  return await response.json();
};


/**
 * Thêm người dùng mới
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
export const apiAddAdminUser = async (userData) => {
  // Map dữ liệu sang đúng định dạng API yêu cầu
  const payload = {
    Name: userData.name,
    Email: userData.email,
    SDT: userData.sdt,
    Vaitro: userData.vaitro,
    Mat_Khau: userData.matkhau
  };

  const response = await fetch(`${API_BASE_URL}/admin/UserManager`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  // Kiểm tra StatusCode từ backend trả về (theo format user cung cấp)
  if (!response.ok || responseData.StatusCode >= 400 || responseData.statusCode >= 400) {
    throw new Error(responseData.Message || responseData.message || 'Thêm người dùng thất bại');
  }

  return responseData;
};

/**
 * Xóa người dùng (Soft delete)
 * @param {string|number} id 
 * @returns {Promise<Object>}
 */
export const apiDeleteAdminUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/UserManager/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();

  if (!response.ok || responseData.StatusCode >= 400 || responseData.statusCode >= 400) {
    throw new Error(responseData.Message || responseData.message || 'Xóa người dùng thất bại');
  }

  return responseData;
};
