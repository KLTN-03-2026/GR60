const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Lấy thông tin Homestay cho giao diện quản lý Admin
 * Yêu cầu đăng nhập tài khoản Admin
 * @returns {Promise<Object>}
 */
export const apiGetAdminHomeStayManager = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/HomeStayManager`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể lấy thông tin Homestay';
    try {
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.message || errorObj.title || errorMessage;
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
};

/**
 * Cập nhật thông tin Homestay
 * Dùng FormData để hỗ trợ upload file
 * @param {FormData} formData
 * @returns {Promise<Object>}
 */
export const apiUpdateAdminHomeStayManager = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/admin/HomeStayManager`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Không thể cập nhật thông tin Homestay';
    try {
      const errorObj = JSON.parse(errorText);
      
      // Xử lý lỗi validation từ ASP.NET (object 'errors')
      if (errorObj.errors) {
        const errorList = [];
        for (const key in errorObj.errors) {
          if (Array.isArray(errorObj.errors[key])) {
            errorList.push(...errorObj.errors[key]);
          } else {
            errorList.push(errorObj.errors[key]);
          }
        }
        if (errorList.length > 0) {
          errorMessage = errorList.join('\n');
        }
      } else {
        errorMessage = errorObj.message || errorObj.title || errorMessage;
      }
    } catch (e) {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  // Phản hồi có thể rỗng hoặc json
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : { success: true };
  } catch (e) {
    return { success: true, message: text };
  }
};
