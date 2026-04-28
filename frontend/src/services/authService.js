const API_BASE_URL = 'https://localhost:7092/api';

/**
 * Gọi API Đăng nhập
 * @param {string} email 
 * @param {string} matKhau 
 * @returns {Promise<Object>} user data
 */
export const apiLogin = async (email, matKhau) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: email,
      MatKhau: matKhau,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessageFromServer = errorText;
    try {
      const errorObj = JSON.parse(errorText);
      errorMessageFromServer = errorObj.message || errorObj.title || errorText;
    } catch (err) {
    }

    if (errorMessageFromServer.includes('Email hoặc mật khẩu không đúng')) {
      throw new Error('Email hoặc mật khẩu không đúng');
    } else {
      throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  }

  return await response.json();
};

/**
 * Gọi API Đăng ký
 * @param {Object} data Thông tin đăng ký (HoTen, Email, MatKhau)
 * @returns {Promise<Object>}
 */
export const apiRegister = async (data) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseText = await response.text();
  let responseData = null;
  
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    // Không phải JSON
  }

  // Xác định trạng thái lỗi (HTTP code >= 400 HOẶC StatusCode backend trả về >= 400)
  const serverCode = responseData?.StatusCode || responseData?.statusCode || response.status;
  const isError = !response.ok || serverCode >= 400;

  if (isError) {
    if (responseData) {
      // 1. Kiểm tra lôi từ Object 'errors' (Chuẩn ASP.NET Model Validation Model State)
      if (responseData.errors) {
        const errorList = [];
        for (const key in responseData.errors) {
          // Bỏ qua mảng rỗng
          if (Array.isArray(responseData.errors[key])) {
             errorList.push(...responseData.errors[key]);
          } else {
             errorList.push(responseData.errors[key]);
          }
        }
        if (errorList.length > 0) {
          throw new Error(errorList.join('\n')); // Chuyển thành chuỗi hiển thị
        }
      }

      // 2. Nếu BE trả về field Message/message do dev tự handle ({ StatusCode: 400, Message: "Email tốn tại" })
      const errorMsg = responseData.Message || responseData.message || responseData.title;
      if (errorMsg) {
        throw new Error(errorMsg);
      }

      throw new Error('Đã lỗi xảy ra nhưng không có message mô tả từ Server.');
    }

    // Nếu API không trả về json, thử parse text nguyên bản (trường hợp Text thuần)
    if (responseText && responseText.trim() !== '') {
      // Đôi khi server trả về html error
      if(responseText.includes('<html')) throw new Error('Cổng Server đang được bảo vệ, lỗi hiển thị HTML.');
      throw new Error(responseText);
    }
    
    throw new Error('Không thể kết nối đến máy chủ.');
  }

  // Thành công (StatusCode 201 hoặc HTTP 2xx)
  return responseData;
};

/**
 * Gọi API Đăng xuất
 */
export const apiLogout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.ok;
  } catch (err) {
    console.error('Lỗi khi đăng xuất:', err);
    return false;
  }
};

/**
 * Gọi API Quên mật khẩu
 * @param {string} email 
 * @param {string} soDienThoai 
 * @returns {Promise<Object>}
 */
export const apiForgotPassword = async (email, sdt) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-pass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: email,
      Sdt: sdt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Số điện thoại hoặc Email không đúng';
    
    try {
      // Thử parse JSON nếu server trả về Problem Details
      const errorObj = JSON.parse(errorText);
      // Nếu có message cụ thể từ server thì dùng, nếu là generic "Bad Request" thì dùng message của mình
      if (errorObj.message) {
        errorMessage = errorObj.message;
      } else if (errorObj.errors) {
        // Handle Validation Errors
        errorMessage = Object.values(errorObj.errors).flat().join(', ');
      }
    } catch (e) {
      // Nếu không phải JSON, dùng text nguyên bản nếu có, không thì dùng mặc định
      if (errorText && errorText.length < 100) errorMessage = errorText;
    }

    throw new Error(errorMessage);
  }

  // API trả về token dưới dạng chuỗi (plain text)
  return await response.text();
};

/**
 * Gọi API Đặt lại mật khẩu mới
 * @param {string} email 
 * @param {string} token 
 * @param {string} newPassword 
 * @returns {Promise<boolean>}
 */
export const apiResetPassword = async (token, newPass, confirmNewPass) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Token: token,
      NewPass: newPass,
      ConfirmNewPass: confirmNewPass,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Đặt lại mật khẩu thất bại.';
    
    try {
      // Nếu là JSON thì bóc tách
      const errorObj = JSON.parse(errorText);
      errorMessage = errorObj.message || errorObj.title || errorText;
    } catch (e) {
      // Nếu là text thuần (như "Token không hợp lệ") thì dùng luôn
      if (errorText) errorMessage = errorText;
    }
    
    throw new Error(errorMessage);
  }

  return await response.text();
};
