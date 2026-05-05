const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Lấy danh sách tất cả các phòng cho Admin
 */
export const apiGetAdminRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy danh sách phòng';
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
 * Thêm phòng mới
 * @param {object} roomData - Dữ liệu phòng (TenPhong, DiaChi, MoTa, LoaiPhong, TrangThai, GiaGoc, SoNguoiLon, SoTreEm, SoGiuong)
 */
export const apiAddAdminRoom = async (roomData) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roomData),
  });

  const result = await response.json();

  if (!response.ok || (result.StatusCode !== 201 && result.statusCode !== 201)) {
    throw new Error(result.Message || result.message || 'Thêm phòng thất bại');
  }

  return result;
};

/**
 * Cập nhật thông tin phòng
 * @param {number} id - ID của phòng
 * @param {object} roomData - Dữ liệu phòng cập nhật
 */
export const apiUpdateAdminRoom = async (id, roomData) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roomData),
  });

  const result = await response.json();

  if (!response.ok || (result.StatusCode !== 200 && result.statusCode !== 200)) {
    throw new Error(result.Message || result.message || 'Cập nhật phòng thất bại');
  }

  return result;
};

/**
 * Xóa phòng (Soft delete hoặc Hard delete tùy backend)
 */
/**
 * Chỉnh trạng thái xóa của phòng (Soft Delete)
 */
export const apiDeleteAdminRoom = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${id}`, {
    method: 'PATCH',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok || (result.StatusCode !== 200 && result.statusCode !== 200)) {
    throw new Error(result.Message || result.message || 'Xóa phòng thất bại');
  }

  return result;
};

/**
 * Lấy chi tiết một phòng cho Admin
 */
export const apiGetAdminRoomById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy thông tin chi tiết phòng';
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
 * Lấy danh sách tiện nghi của một phòng cho Admin
 */
export const apiGetAdminRoomAmenities = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${id}/amenities`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy danh sách tiện nghi';
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
 * Thêm tiện nghi vào phòng
 * @param {number} roomId - ID của phòng
 * @param {object} data - { IdTienNghi: number, Soluong: number }
 */
export const apiAddAmenityToRoom = async (roomId, data) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${roomId}/amenities`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      IdTienNghi: parseInt(data.IdTienNghi),
      Soluong: parseInt(data.Soluong)
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    // Theo spec của user, lỗi 400 trả về { statusCode: 400, message: "Phòng đã có tiện nghi" }
    throw new Error(result.message || 'Không thể thêm tiện nghi');
  }

  return result;
};

/**
 * Xóa tiện nghi khỏi phòng
 * @param {number} roomId - ID của phòng
 * @param {number} amenityId - ID của tiện nghi
 */
export const apiRemoveAmenityFromRoom = async (roomId, amenityId) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${roomId}/amenities`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parseInt(amenityId)),
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(result.message || 'Không thể xóa tiện nghi');
  }

  return result;
};

/**
 * Lấy danh sách ảnh của một phòng cho Admin
 */
export const apiGetAdminRoomImages = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${id}/imgRoom`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy danh sách ảnh phòng';
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
 * Thêm một ảnh mới vào phòng
 * @param {number} roomId - ID của phòng
 * @param {File} imageFile - File ảnh cần upload
 */
export const apiAddRoomImage = async (roomId, imageFile) => {
  const formData = new FormData();
  formData.append('fileAnh', imageFile);

  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${roomId}/imgRoom`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const result = await response.json();

  // Kiểm tra StatusCode theo spec của user (201 là thành công)
  if (!response.ok || (result.StatusCode !== 201 && result.statusCode !== 201)) {
    throw new Error(result.Message || result.message || 'Không thể thêm ảnh');
  }

  return result;
};

/**
 * Xóa một ảnh khỏi phòng
 * @param {number} roomId - ID của phòng
 * @param {number} idImg - ID của ảnh cần xóa
 */
export const apiRemoveRoomImage = async (roomId, idImg) => {
  const response = await fetch(`${API_BASE_URL}/admin/RoomManager/${roomId}/imgRoom`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parseInt(idImg)),
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : {};

  if (!response.ok || (result.StatusCode !== 200 && result.statusCode !== 200 && !response.ok)) {
    throw new Error(result.Message || result.message || 'Không thể xóa ảnh');
  }

  return result;
};
