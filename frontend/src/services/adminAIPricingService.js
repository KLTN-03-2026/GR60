const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Lấy danh sách giá phòng đang áp dụng cho Admin
 */
export const apiGetAppliedPricing = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/AIPriceManager/giaapdung`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy danh sách giá áp dụng';
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
 * Lấy lịch sử dự đoán AI cho Admin
 */
export const apiGetPredictionHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/AIPriceManager`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy lịch sử dự đoán';
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
 * Chạy dự đoán AI mới cho một phòng cụ thể
 * @param {number|string} idRoom 
 * @param {object} data { Ngay_Bat_Dau_Du_doan, Ngay_Ket_Thuc_Du_doan }
 */
export const apiRunPrediction = async (idRoom, data) => {
  const response = await fetch(`${API_BASE_URL}/admin/AIPriceManager/${idRoom}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể chạy dự đoán';
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
 * Duyệt và áp dụng giá dự đoán AI
 * @param {number|string} idRoom 
 * @param {object} data { idDuDoanGia, giaApDung, idUser, thoiGianTao }
 */
export const apiApprovePrediction = async (idRoom, data) => {
  const response = await fetch(`${API_BASE_URL}/admin/AIPriceManager/${idRoom}/giaapDung`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể duyệt giá';
    try {
      const errorObj = JSON.parse(errorText);
      if (errorObj.errors) {
        const errorDetails = Object.values(errorObj.errors).flat().join(', ');
        errorMessage = `${errorObj.title || 'Lỗi dữ liệu'}: ${errorDetails}`;
      } else {
        errorMessage = errorObj.message || errorObj.title || errorMessage;
      }
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

/**
 * Xóa lịch sử dự đoán AI
 * @param {number|string} idDuDoanGia 
 */
export const apiDeletePrediction = async (idDuDoanGia) => {
  const response = await fetch(`${API_BASE_URL}/admin/AIPriceManager/doangia/${idDuDoanGia}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể xóa lịch sử dự đoán';
    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.message || errorObj.title || errorMessage;
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return true;
};
