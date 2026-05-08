const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Lấy danh sách tất cả các đơn đặt phòng cho Admin
 */
export const apiGetBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/BookingManager`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể tải danh sách đặt phòng';
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
 * Cập nhật trạng thái đặt phòng
 * @param {number|string} idBooking 
 * @param {string} status (da_hoan_thanh, da_huy, dang_xu_ly)
 */
export const apiUpdateBookingStatus = async (idBooking, status) => {
  const response = await fetch(`${API_BASE_URL}/admin/BookingManager/${idBooking}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(status), // Gửi raw string trong Body nếu BE yêu cầu [FromBody] string
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Lỗi khi cập nhật trạng thái đặt phòng';
    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.Message || errorObj.message || errorMessage;
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * Cập nhật trạng thái xóa của đặt phòng (isDelete)
 * @param {number|string} idBooking 
 */
export const apiDeleteBooking = async (idBooking) => {
  const response = await fetch(`${API_BASE_URL}/admin/BookingManager/${idBooking}/isDelete`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Lỗi khi Xóa đơn đặt phòng';
    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.Message || errorObj.message || errorMessage;
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};
