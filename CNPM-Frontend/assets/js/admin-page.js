document.addEventListener("DOMContentLoaded", function () {
    // Đảm bảo DOM đã tải hoàn toàn trước khi gắn sự kiện

    // Toggle between sections
    const personalBtn = document.getElementById("personal-btn");
    const addAccountBtn = document.getElementById("addAccount-btn");
    const updateAccountBtn = document.getElementById("updateAccount-btn");
    const updateFaceBtn = document.getElementById("updateFace-btn");
    const deleteAccountBtn = document.getElementById("deleteAccount-btn");

    if (personalBtn) {
        personalBtn.addEventListener("click", function () {
            toggleSection("personal", this);
        });
    }

    if (addAccountBtn) {
        addAccountBtn.addEventListener("click", function () {
            toggleSection("addAccount", this);
        });
    }

    if (updateAccountBtn) {
        updateAccountBtn.addEventListener("click", function () {
            toggleSection("updateAccount", this);
        });
    }

    if (updateFaceBtn) {
        updateFaceBtn.addEventListener("click", function () {
            toggleSection("updateFace", this);
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", function () {
            toggleSection("deleteAccount", this);
        });
    }

    function toggleMenu(button) {
        const menus = document.querySelectorAll(".menu-dropdown"); // Lấy tất cả menu
        const currentMenu = button.nextElementSibling; // Lấy menu liên quan đến nút bấm
    
        // Ẩn tất cả menu trước khi mở menu được click
        menus.forEach(menu => {
            if (menu !== currentMenu) {
                menu.style.display = 'none';
            }
        });
    
        // Hiển thị hoặc ẩn menu liên quan
        currentMenu.style.display = currentMenu.style.display === 'block' ? 'none' : 'block';
    
        // Thêm class "active" cho nút đang được nhấn
        button.classList.toggle('active');
    }
    
    // Sự kiện để ẩn menu khi nhấn bên ngoài
    document.addEventListener("click", (event) => {
        const isDotsButton = event.target.classList.contains("dots-button"); // Kiểm tra nếu click vào nút 3 chấm
        const isMenu = event.target.closest(".menu-dropdown"); // Kiểm tra nếu click vào menu
    
        if (!isDotsButton && !isMenu) {
            // Nếu không phải click vào nút 3 chấm hoặc menu, ẩn tất cả menu
            const menus = document.querySelectorAll(".menu-dropdown");
            menus.forEach(menu => {
                menu.style.display = 'none';
            });
    
            // Loại bỏ trạng thái "active" của tất cả nút 3 chấm
            const buttons = document.querySelectorAll(".dots-button");
            buttons.forEach(button => {
                button.classList.remove("active");
            });
        }
    });
    



    fetch("http://localhost:5000/get-all-accounts")
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById("account-tbody");
        tbody.innerHTML = ""; // Xóa các dòng dữ liệu cũ (nếu có)

        data.forEach(account => {
            if (account.LoaiTaiKhoan == 'HocSinh'){
                const row = `
                <tr>
                    <td>${account.MaTaiKhoan}</td>
                    <td>${account.TenDangNhap}</td>
                    <td>${account.MatKhau}</td>
                    <td>${account.LoaiTaiKhoan}</td>
                    <td>${account.MaVaiTro}</td>
                    <td>
                        <div class="action-menu">
                            <button class="dots-button" onclick="toggleMenu(this)">⋮</button>
                            <div class="menu-dropdown" style="display: none;">
                                <a href="#" class="update-account-btn" data-id="${account.MaTaiKhoan}">Cập nhật tài khoản</a>
                                <a href="#" class="delete-account-btn" data-id="${account.MaTaiKhoan}">Xóa tài khoản</a>
                                <a href="#" class="update-face-btn" data-id="${account.MaVaiTro}">Cập nhật khuôn mặt</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", row);
            }
            else{
                const row = `
                <tr>
                    <td>${account.MaTaiKhoan}</td>
                    <td>${account.TenDangNhap}</td>
                    <td>${account.MatKhau}</td>
                    <td>${account.LoaiTaiKhoan}</td>
                    <td>${account.MaVaiTro}</td>
                    <td>
                        <div class="action-menu">
                            <button class="dots-button" onclick="toggleMenu(this)">⋮</button>
                            <div class="menu-dropdown" style="display: none;">
                                <a href="#" class="update-account-btn" data-id="${account.MaTaiKhoan}">Cập nhật tài khoản</a>
                                <a href="#" class="delete-account-btn" data-id="${account.MaTaiKhoan}">Xóa tài khoản</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", row);
            }
            document.querySelectorAll(".update-face-btn").forEach(button => {
                button.addEventListener("click", function (e) {
                  e.preventDefault();
                  const studentId = this.getAttribute("data-id");
              
                  // Hiển thị phần giao diện cập nhật khuôn mặt
                  document.getElementById("updateFaceSection").classList.remove("hidden");
                  document.getElementById("studentId").value = studentId;
                  
                });
              });
                
        });
        document.querySelectorAll(".delete-account-btn").forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const accountId = this.getAttribute("data-id");
                if (confirm(`Bạn có chắc chắn muốn xóa tài khoản với ID: ${accountId}?`)) {
                    deleteAccount(accountId);
                }
            });
        });
        document.querySelectorAll(".update-account-btn").forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const accountId = this.getAttribute("data-id");
                // Gọi hàm cập nhật tài khoản
                updateAccount(accountId);
            });
        });
    })
    .catch(error => {
        console.error("Lỗi khi tải danh sách tài khoản:");
    });


    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            showToast("Đăng xuất thành công!", "success");
            setTimeout(function () {
                window.location.href = "index.html";
            }, 1500);
        });
    }

    // Show toast notifications

    

    // Add account functionality
const addAccountButton = document.getElementById("add-account-button");
if (addAccountButton) {
    addAccountButton.addEventListener("click", function () {
        // Sử dụng prompt để thu thập thông tin
        const accountId = prompt("Nhập mã tài khoản:");
        if (!accountId) {
            showToast("Mã tài khoản không được để trống!", "error");
            return;
        }

        const username = prompt("Nhập tên đăng nhập:");
        if (!username) {
            showToast("Tên đăng nhập không được để trống!", "error");
            return;
        }

        const password = prompt("Nhập mật khẩu:");
        if (!password) {
            showToast("Mật khẩu không được để trống!", "error");
            return;
        }

        let accountType = prompt("Nhập loại tài khoản (QuanTriVien, GiaoVien, HocSinh):");
        if (!["QuanTriVien", "GiaoVien", "HocSinh"].includes(accountType)) {
            showToast("Loại tài khoản không hợp lệ!", "error");
            return;
        }
        const roleId = prompt("Nhập mã vai trò:");
        if (!roleId) {
            showToast("Mã vai trò không được để trống!", "error");
            return;
        }

        // Gửi request POST để thêm tài khoản
        fetch("http://localhost:5000/add-account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                MaTaiKhoan: accountId,
                TenDangNhap: username,
                MatKhau: password,
                LoaiTaiKhoan: accountType,
                MaVaiTro: roleId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast("Thêm tài khoản thành công!", "success");
                refreshAccountList(); // Làm mới danh sách tài khoản
            } else {
                showToast(data.message || "Thêm tài khoản thất bại. Vui lòng thử lại.", "error");
            }
        })
        .catch(error => {
            console.error("Lỗi khi thêm tài khoản:", error);
            showToast("Đã xảy ra lỗi. Vui lòng thử lại!", "error");
        });
    });
}

    
const bulkAddButton = document.getElementById("bulk-add-account-button");
const bulkAddForm = document.getElementById("bulk-add-account-form");

if (bulkAddButton) {
    bulkAddButton.addEventListener("click", () => {
        bulkAddForm.classList.toggle("hidden"); // Hiển thị hoặc ẩn form
    });
}

if (bulkAddForm) {
    bulkAddForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Ngăn form reload trang

        const fileInput = document.getElementById("bulk-file");
        const file = fileInput.files[0];

        if (!file) {
            showToast("Vui lòng chọn tài liệu CSV!", "error");
            return;
        }

        // Đọc file CSV
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            const accounts = parseCSV(csvData); // Hàm parse CSV
            if (accounts.length === 0) {
                showToast("Tài liệu CSV không có dữ liệu hợp lệ!", "error");
                return;
            }
            sendBulkAccounts(accounts); // Gửi dữ liệu lên server
        };
        reader.readAsText(file);
    });
}

function parseCSV(csvData) {
    const rows = csvData.split("\n").filter((row) => row.trim() !== ""); // Loại bỏ dòng trống
    const accounts = [];

    rows.slice(1).forEach((row) => { // Bỏ qua dòng header
        const columns = row.split(",");
        if (columns.length >= 7) { // Đảm bảo đủ 7 cột dữ liệu
            const [
                accountId,
                username,
                password,
                accountType,
                adminId,
                teacherId,
                studentId
            ] = columns.map(col => col.trim());

            accounts.push({
                MaTaiKhoan: accountId,
                TenDangNhap: username,
                MatKhau: password,
                LoaiTaiKhoan: accountType,
                MaAdmin: adminId === "NULL" ? null : adminId,
                MaGiaoVien: teacherId === "NULL" ? null : teacherId,
                MaHocSinh: studentId === "NULL" ? null : studentId
            });
        }
    });

    return accounts;
}


function sendBulkAccounts(accounts) {
    fetch("http://localhost:5000/bulk-add-accounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(accounts),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                showToast("Cấp tài khoản hàng loạt thành công!", "success");
                refreshAccountList(); // Làm mới danh sách tài khoản
            } else {
                showToast(`Lỗi: ${data.message}`, "error"); // Hiển thị thông báo lỗi chi tiết
            }
        })
        .catch((error) => {
            console.error("Lỗi khi cấp tài khoản hàng loạt:", error);
            showToast("Đã xảy ra lỗi. Vui lòng thử lại!", "error");
        });
}


    function deleteAccount(accountId) {
        // Hiển thị hộp xác nhận trước khi xóa
        if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản với ID: ${accountId}?`)) {
            return;
        }
    
        // Gửi yêu cầu DELETE đến API
        fetch(`http://localhost:5000/delete-account/${accountId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast(`Đã xóa tài khoản với ID: ${accountId}`, "success");
    
                    // Cập nhật lại danh sách tài khoản sau khi xóa
                    refreshAccountList();
                } else {
                    showToast("Xóa tài khoản thất bại. Vui lòng thử lại.", "error");
                }
            })
            .catch(error => {
                console.error("Lỗi khi xóa tài khoản:", error);
                showToast("Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại.", "error");
            });
    }

    function updateAccount(accountId) {
        // Hiển thị form cập nhật tài khoản (hoặc chuyển hướng đến trang cập nhật)
        const username = prompt("Nhập tên đăng nhập mới:");
        const password = prompt("Nhập mật khẩu mới:");
        const accountRole = '';
    
        // Kiểm tra dữ liệu đầu vào
        if (!username || !password) {
            showToast("Vui lòng điền đầy đủ thông tin cập nhật!", "error");
            return;
        }
    
        // Gửi yêu cầu PUT để cập nhật tài khoản
        fetch(`http://localhost:5000/update-account/${accountId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                TenDangNhap: username,
                MatKhau: password,
                LoaiTaiKhoan: accountRole
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showToast(`Tài khoản với ID ${accountId} đã được cập nhật thành công!`, "success");
    
                    // Cập nhật lại danh sách tài khoản sau khi cập nhật
                    refreshAccountList();
                } else {
                    showToast("Cập nhật tài khoản thất bại. Vui lòng thử lại.", "error");
                }
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật tài khoản:", error);
                showToast("Đã xảy ra lỗi khi cập nhật tài khoản. Vui lòng thử lại.", "error");
            });
    }
    
    function refreshAccountList() {
        fetch("http://localhost:5000/get-all-accounts")
            .then(response => response.json())
            .then(data => {
                const tbody = document.getElementById("account-tbody");
                tbody.innerHTML = ""; // Xóa dữ liệu cũ
    
                data.forEach(account => {
                    const row = `
                        <tr>
                            <td>${account.MaTaiKhoan}</td>
                            <td>${account.TenDangNhap}</td>
                            <td>${account.MatKhau}</td>
                            <td>${account.LoaiTaiKhoan}</td>
                            <td>${account.MaVaiTro}</td>
                            <td>
                                <div class="action-menu">
                                    <button class="dots-button" onclick="toggleMenu(this)">⋮</button>
                                    <div class="menu-dropdown" style="display: none;">
                                        <a href="#" class="update-account-btn" data-id="${account.MaTaiKhoan}">Cập nhật tài khoản</a>
                                        <a href="#" class="delete-account-btn" data-id="${account.MaTaiKhoan}">Xóa tài khoản</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML("beforeend", row);
                });
    
                // Gắn lại sự kiện cho các nút sau khi danh sách được làm mới
                attachEventListeners();
            })
            .catch(error => {
                console.error("Lỗi khi làm mới danh sách tài khoản:", error);
            });
    }
    
    function attachEventListeners() {
        document.querySelectorAll(".delete-account-btn").forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const accountId = this.getAttribute("data-id");
                deleteAccount(accountId);
            });
        });
    
        document.querySelectorAll(".update-account-btn").forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const accountId = this.getAttribute("data-id");
                updateAccount(accountId);
            });
        });
    }
    
    document.getElementById("search-account-form").addEventListener("submit", function (e) {
        e.preventDefault(); // Ngăn hành động mặc định của form
    
        // Lấy mã tài khoản từ input
        const accountId = document.getElementById("account-id").value.trim();
    
        if (!accountId) {
            showToast("Vui lòng nhập mã tài khoản để tìm kiếm!", "error");
            return;
        }
    
        // Gọi API để lấy thông tin tài khoản
        fetch(`http://localhost:5000/account/${accountId}`)
            .then(response => response.json())
            .then(data => {
                if (data.MaTaiKhoan) {
                    const tbody = document.getElementById("account-tbody");
                    tbody.innerHTML = ""; // Xóa dữ liệu cũ
                    if (data.LoaiTaiKhoan == "HocSinh"){
                         // Thêm kết quả tìm kiếm vào bảng
                    const row = `
                    <tr>
                        <td>${data.MaTaiKhoan}</td>
                        <td>${data.TenDangNhap}</td>
                        <td>${data.MatKhau}</td>
                        <td>${data.LoaiTaiKhoan}</td>
                        <td>${data.MaVaiTro}</td>
                        <td>
                            <div class="action-menu">
                                <button class="dots-button" onclick="toggleMenu(this)">⋮</button>
                                <div class="menu-dropdown" style="display: none;">
                                    <a href="#" class="update-account-btn" data-id="${data.MaTaiKhoan}">Cập nhật tài khoản</a>
                                    <a href="#" class="delete-account-btn" data-id="${data.MaTaiKhoan}">Xóa tài khoản</a>
                                    <a href="#" class="update-face-btn" data-id="${data.MaVaiTro}">Cập nhật khuôn mặt</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML("beforeend", row);
        
                    }
                    else{
                         // Thêm kết quả tìm kiếm vào bảng
                    const row = `
                    <tr>
                        <td>${data.MaTaiKhoan}</td>
                        <td>${data.TenDangNhap}</td>
                        <td>${data.MatKhau}</td>
                        <td>${data.LoaiTaiKhoan}</td>
                        <td>${data.MaVaiTro}</td>
                        <td>
                            <div class="action-menu">
                                <button class="dots-button" onclick="toggleMenu(this)">⋮</button>
                                <div class="menu-dropdown" style="display: none;">
                                    <a href="#" class="update-account-btn" data-id="${data.MaTaiKhoan}">Cập nhật tài khoản</a>
                                    <a href="#" class="delete-account-btn" data-id="${data.MaTaiKhoan}">Xóa tài khoản</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML("beforeend", row);
                attachEventListeners();
                    }
                    document.querySelectorAll(".update-face-btn").forEach(button => {
                        button.addEventListener("click", function (e) {
                          e.preventDefault();
                          const studentId = this.getAttribute("data-id");
                      
                          // Hiển thị phần giao diện cập nhật khuôn mặt
                          document.getElementById("updateFaceSection").classList.remove("hidden");
                          document.getElementById("studentId").value = studentId;
                          
                        });
                      });
                } else {
                    showToast("Không tìm thấy tài khoản!", "error");
                }
            })
            .catch(error => {
                console.error("Lỗi khi tìm kiếm tài khoản:", error);
                showToast("Đã xảy ra lỗi. Vui lòng thử lại!", "error");
            });
    });
    

});

document.getElementById("updateFaceForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const studentId = document.getElementById("studentId").value.trim();
    const files = document.getElementById("faceImages").files;

    if (files.length !== 5) {
        showToast("Vui lòng chọn đúng 5 ảnh!", "error");
        return;
    }
    
    
  
    const formData = new FormData();
    formData.append("studentId", studentId);
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });
  
    fetch("http://localhost:5000/upload-face", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            document.getElementById("updateFaceSection").classList.add("hidden");
            showToast("Cập nhật khuôn mặt thành công!","success");
        } else {
            document.getElementById("updateFaceSection").classList.add("hidden");
            showToast("Cập nhật khuôn mặt thất bại!","error");
        }
      })
      .catch((error) => {
        document.getElementById("updateFaceSection").classList.add("hidden");
        showToast("Đã xảy ra lỗi. Vui lòng thử lại!", "error");
      });
  });


function toggleMenu(button) {
    const menu = button.nextElementSibling;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    button.classList.toggle('active');
}
function showToast(message, type) {
    const toast = document.getElementById("toast");
    toast.textContent = message;

    if (type === "error") {
        toast.classList.add("toast-error");
        toast.classList.remove("toast-success");
    } else if (type === "success") {
        toast.classList.add("toast-success");
        toast.classList.remove("toast-error");
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
