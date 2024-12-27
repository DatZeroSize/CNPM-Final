// Toggle between sections
document.getElementById("personal-info-btn").addEventListener("click", function () {
  toggleSection("personal-info", this);
});

document.getElementById("attendance-history-btn").addEventListener("click", function () {
  toggleSection("attendance-history", this);
});
let dd = -1;
function toggleSection(sectionId, button) {
  const sections = document.querySelectorAll(".section");
  const buttons = document.querySelectorAll(".nav-item");

  // Hide all sections and reset buttons
  sections.forEach((section) => section.classList.add("hidden"));
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Show the selected section and activate its button
  document.getElementById(sectionId).classList.remove("hidden");
  button.classList.add("active");
}

document.getElementById("logout-btn").addEventListener("click", function () {
  console.log("Đã nhấn nút đăng xuất");  // Kiểm tra xem sự kiện click có được kích hoạt không
  showToast("Đăng xuất thành công!", "success");
  setTimeout(function () {
    window.location.href = "index.html";  // Chuyển về trang chính
  }, 1500);
});

// Lấy thông tin học sinh từ localStorage và cập nhật giao diện
const maHocsinh = localStorage.getItem('roleId');
const role = localStorage.getItem('role');



const subject_dropdown = document.getElementById('subject-dropdown');
const year_dropdown = document.getElementById('year-dropdown');

function getSubject(){
  fetch(`http://localhost:5000/getSubject/${maHocsinh}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Lỗi từ server: ' + response.status); // Kiểm tra mã trạng thái lỗi
    }
    return response.json();
  })
  .then(data => {
    if (data.success) {
      const subject = data.monHoc;
      subject.forEach((mon) => {
        const option = document.createElement('option');
        option.value = mon.MaMonHoc;
        option.textContent = mon.TenMonHoc;
        subject_dropdown.appendChild(option);
      });
      const currentYear = new Date().getFullYear();
      const years = []
      for (let i = currentYear-2; i < currentYear+5; i++) {
        const yearFirst = i.toString();
        const yearSecond = (i+1).toString();
        const tenNamHoc = yearFirst + '-' + yearSecond;
        const maNamHoc = yearFirst+yearSecond;
        years.push({ma: maNamHoc, ten: tenNamHoc});
      }
      years.forEach((nam) => {
        const option = document.createElement('option');
        option.value = nam.ma;
        option.textContent = nam.ten;
        year_dropdown.appendChild(option);
      });
      loadAttendanceHistory();
    } else {
      showToast("Không tìm thấy thông tin học sinh","error");
    }
  })
  .catch(error => {
    console.error('Lỗi:', error);
    showToast("Đã xảy ra lỗi khi lấy thông tin học sinh","error");
  });

   
}

// Function to show toast notifications
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

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('sidebar-open');
}

getSubject()

console.log("Mã học sinh từ localStorage:", maHocsinh);  // Log giá trị maHocsinh nhận được

if (role === 'HocSinh' && maHocsinh) {
  // Gửi yêu cầu đến API backend để lấy thông tin học sinh
  fetch(`http://localhost:5000/student/${maHocsinh}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Lỗi từ server: ' + response.status); // Kiểm tra mã trạng thái lỗi
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        const student = data.student;
        
        // Cập nhật thông tin học sinh vào các phần tử HTML
        document.querySelector('.profile h6:nth-of-type(1)').textContent = student.HoTen;
        document.querySelector('.profile h6:nth-of-type(2)').textContent = student.MaHocSinh;
        document.querySelector('.profile p').textContent = 'Học Sinh';

         // Chuyển đổi ngày từ UTC sang định dạng dd-mm-yyyy
         const date = new Date(student.NgaySinh);
         const day = String(date.getUTCDate()).padStart(2, '0');  // Lấy ngày với 2 chữ số
         const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Lấy tháng (tháng bắt đầu từ 0)
         const year = date.getUTCFullYear();  // Lấy năm

         const formattedDate = `${day}/${month}/${year}`;  // Định dạng lại ngày theo dd-mm-yyyy
        // Cập nhật mã học sinh vào phần tử đúng
        document.querySelector('.info-table tr:nth-child(1) td').textContent = student.MaHocSinh;
        document.querySelector('.info-table tr:nth-child(2) td').textContent = student.HoTen;
        document.querySelector('.info-table tr:nth-child(3) td').textContent = student.MaLop;
        document.querySelector('.info-table tr:nth-child(4) td').textContent = formattedDate;
        document.querySelector('.info-table tr:nth-child(5) td').textContent = student.GioiTinh;
        document.querySelector('.info-table tr:nth-child(6) td').textContent = student.SoDienThoai;
        document.querySelector('.info-table tr:nth-child(7) td').textContent = student.HoTenCha;
        document.querySelector('.info-table tr:nth-child(8) td').textContent = student.HoTenMe;
        document.querySelector('.info-table tr:nth-child(9) td').textContent = student.QueQuan;

        // Cập nhật ảnh khuôn mặt (nếu có)
        
      } else {
        showToast('Không tìm thấy thông tin học sinh',"error");
      }
    })
    .catch(error => {
      console.error('Lỗi:', error);
      showToast('Đã xảy ra lỗi khi lấy thông tin học sinh',"error");
    });
}

// Hàm lấy và hiển thị lịch sử điểm danh
function loadAttendanceHistory() {

  dd = dd+1;
  const maHocsinh = localStorage.getItem('roleId');
  const tuan = document.getElementById("week-dropdown").value;
  const hocKy = document.getElementById("semester-dropdown").value;
  const namHoc = document.getElementById("year-dropdown").value;
  const monHoc = document.getElementById("subject-dropdown").value
  if (maHocsinh) {
    fetch(`http://localhost:5000/attendance-history/${maHocsinh}?tuan=${tuan}&hocKy=${hocKy}&namHoc=${namHoc}&monHoc=${monHoc}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Xử lý dữ liệu lịch sử điểm danh
          const attendanceHistory = data.history;
          const tableBody = document.getElementById("attendance-history-table-body");
          const tableHead = document.getElementById("attendance-history-table-head");

          // Làm sạch dữ liệu cũ
          tableBody.innerHTML = '';
          tableHead.innerHTML = '<th>Thứ</th><th>Ngày</th><th>Trạng thái</th>';
          // Duyệt qua lịch sử điểm danh và thêm vào bảng
          attendanceHistory.forEach(item => {
            const row = document.createElement("tr");
          
            // Chuyển đổi ngày từ UTC sang định dạng dd-mm-yyyy
            const date = new Date(item.Ngay);
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
          
            const formattedDate = `${day}/${month}/${year}`;
          
            // Lấy thông tin thứ từ kết quả trả về
            const thu = item.Thu;
          
            row.innerHTML = `
              <td>${thu}</td>
              <td>${formattedDate}</td>
              <td>${item.TrangThai}</td>
            `;
            tableBody.appendChild(row);
          });
          
        } else {
          const tableBody = document.getElementById("attendance-history-table-body");
          const tableHead = document.getElementById("attendance-history-table-head");
        // Xóa nội dung cũ của bảng
        tableBody.innerHTML = '';
        tableHead.innerHTML = '';

        // Thêm một hàng với nội dung và đường thẳng ngang qua
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        // Thiết lập nội dung
        cell.textContent = "Không tìm thấy dữ liệu!";
        cell.setAttribute("colspan", "2"); // Thay 2 bằng số lượng cột của bảng
        cell.style.textAlign = "center"; // Canh giữa nội dung  

        // Thêm ô vào hàng và hàng vào bảng
        row.appendChild(cell);
        tableBody.appendChild(row);
          if (dd){
            showToast('Đã xảy ra lỗi khi lấy lịch sử điểm danh',"error");
          }     
        }
      })
      .catch(error => {
        console.error('Lỗi:', error);
        if (dd){
          showToast('Đã xảy ra lỗi khi lấy lịch sử điểm danh',"error");
        }  
      });
  }
}

// Lắng nghe sự kiện thay đổi trên các dropdown và gọi lại hàm loadAttendanceHistory khi thay đổi
document.getElementById("week-dropdown").addEventListener("change", loadAttendanceHistory);
document.getElementById("semester-dropdown").addEventListener("change", loadAttendanceHistory);
document.getElementById("year-dropdown").addEventListener("change", loadAttendanceHistory);
document.getElementById("subject-dropdown").addEventListener("change", loadAttendanceHistory);


