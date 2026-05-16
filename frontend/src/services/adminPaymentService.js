const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Lấy danh sách tất cả các thanh toán cho Admin
 */
export const apiGetPayments = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/PaymentManager`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể tải danh sách thanh toán';
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
 * Cập nhật trạng thái thanh toán
 * @param {number|string} idBooking 
 * @param {string} status (da_hoan_thanh, da_huy, dang_xu_ly)
 */
export const apiUpdatePaymentStatus = async (idBooking, status) => {
  const response = await fetch(`${API_BASE_URL}/admin/PaymentManager/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Id_Booking: idBooking,
      Trang_Thai: status
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Lỗi khi cập nhật trạng thái thanh toán';
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
 * Xóa thanh toán (isDelete)
 * @param {number|string} idPayment 
 * @param {number|string} idBooking
 */
export const apiDeletePayment = async (idPayment, idBooking) => {
  const response = await fetch(`${API_BASE_URL}/admin/PaymentManager/${idPayment}/isDelete`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Number(idBooking)),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Lỗi khi xóa thanh toán';
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
