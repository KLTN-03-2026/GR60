const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Lấy danh sách toàn bộ tiện nghi của hệ thống cho Admin
 */
export const apiGetAdminAmenities = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/AmenitiesManager`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy danh sách tiện nghi hệ thống';
    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.message || errorObj.title || errorMessage;
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * Thêm một tiện nghi mới vào hệ thống
 */
export const apiAddAdminAmenity = async (amenityData) => {
  const response = await fetch(`${API_BASE_URL}/admin/AmenitiesManager`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(amenityData),
  });

  const result = await response.json();

  if (!response.ok || (result.StatusCode !== 201 && result.statusCode !== 201)) {
    throw new Error(result.Message || result.message || 'Thêm tiện nghi vào hệ thống thất bại');
  }

  return result;
};

/**
 * Cập nhật thông tin một tiện nghi
 * @param {number} id - ID của tiện nghi
 * @param {object} amenityData - Dữ liệu tiện nghi cập nhật
 */
export const apiUpdateAdminAmenity = async (id, amenityData) => {
  const response = await fetch(`${API_BASE_URL}/admin/AmenitiesManager/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(amenityData),
  });

  const result = await response.json();

  if (!response.ok || (result.StatusCode !== 200 && result.statusCode !== 200)) {
    throw new Error(result.Message || result.message || 'Cập nhật tiện nghi thất bại');
  }

  return result;
};

/**
 * Xóa một tiện nghi khỏi hệ thống
 * @param {number} id - ID của tiện nghi
 */
export const apiDeleteAdminAmenity = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/AmenitiesManager/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok || (result.StatusCode !== 200 && result.statusCode !== 200)) {
    throw new Error(result.Message || result.message || 'Xóa tiện nghi thất bại');
  }

  return result;
};
