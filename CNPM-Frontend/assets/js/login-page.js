function login(event) {
  event.preventDefault(); // Ngừng hành vi mặc định (reload trang)

  // Lấy dữ liệu từ form
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  // Kiểm tra nếu chưa chọn vai trò
  if (!role) {
    showToast("Vui lòng chọn vai trò!", "error");
    return;
  }

  // Gửi yêu cầu đến API backend
  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, role })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showToast("Đăng nhập thành công!", "success");
        setTimeout(() => {
          // Lưu thông tin vào localStorage sau khi đăng nhập thành công
          localStorage.setItem('role', data.role); // Lưu vai trò
          localStorage.setItem('roleId', data.roleId); // Lưu mã học sinh, giáo viên hoặc admin

          // Điều hướng đến trang của vai trò người dùng
          if (data.role == "GiaoVien") {
            window.location.href = `teacher-page.html`;
          } else if (data.role == "HocSinh") {
            window.location.href = `student-page.html`;
          } else {
            window.location.href = `admin-page.html`;
          }
        }, 1500);
      } else {
        showToast(data.message || "Tên người dùng hoặc mật khẩu không đúng!", "error");
      }
    })
    .catch(error => {
      showToast("Đã xảy ra lỗi. Vui lòng thử lại!", "error");
      console.error(error);
    });
}

function showForgotPasswordForm() {
  document.getElementById('loginFormContainer').classList.add('hidden');
  document.getElementById('forgotPasswordFormContainer').classList.remove('hidden');
}

function showLoginForm() {
  document.getElementById('forgotPasswordFormContainer').classList.add('hidden');
  document.getElementById('loginFormContainer').classList.remove('hidden');
}

function resetPassword(event) {
  event.preventDefault();

  const studentId = document.getElementById('studentId').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Xóa lỗi cũ
  document.getElementById('resetErrorMessage').textContent = '';

  if (newPassword !== confirmPassword) {
    // document.getElementById('resetErrorMessage').textContent = 'Mật khẩu không khớp!';
    showToast('Mật khẩu không khớp!', 'error');
    return false;
  }

  // Gửi yêu cầu đổi mật khẩu tới server
  fetch('http://localhost:5000/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentId, phoneNumber, newPassword }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showToast('Đổi mật khẩu thành công!', 'success');
        showLoginForm();
      } else {
        showToast(data.error, 'error');
        // document.getElementById('resetErrorMessage').textContent = data.error;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      showToast('Có lỗi xảy ra. Vui lòng thử lại', 'error');
      //document.getElementById('resetErrorMessage').textContent = 'Có lỗi xảy ra. Vui lòng thử lại.';
    });

  return false;
}
function togglePasswordVisibility(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.src = './assets/img/eye-open.svg';
  } else {
    passwordInput.type = 'password';
    eyeIcon.src = './assets/img/eye-crossed.svg';
  }
}


// Hàm để hiển thị thông báo Toast
function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;

  if (type === 'error') {
    toast.classList.add('toast-error');
    toast.classList.remove('toast-success');
  } else if (type === 'success') {
    toast.classList.add('toast-success');
    toast.classList.remove('toast-error');
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000); // Thời gian hiển thị thông báo
}
