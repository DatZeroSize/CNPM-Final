// Toggle between sections
document.getElementById("personal-info-btn").addEventListener("click", function () {
  toggleSection("personal-info", this);
});
  
document.getElementById("class-list-btn").addEventListener("click", function () {
  toggleSection("class-list", this);
});
  
document.getElementById("statis-list-btn").addEventListener("click", function () {
  toggleSection("statis-list", this);
});
  
document.getElementById("camera-list-btn").addEventListener("click", function () {
  toggleSection("camera-list", this);
});
let ds = 0;
let tk = 0;
const updateButton = document.querySelector(".update-btn");
const cancelButton = document.querySelector(".cancel-btn");
const confirmationModal = document.getElementById("confirmationModal");
const confirmYesButton = document.getElementById("confirmYes");
const confirmNoButton = document.getElementById("confirmNo");


updateButton.addEventListener("click", () => {
  // Lấy tất cả các nút "status-btn"
  const statusButtons = document.querySelectorAll(".status-btn");

  // Kích hoạt tất cả các nút
  statusButtons.forEach(button => {
    button.disabled = false; // Bỏ vô hiệu hóa
  });

  statusButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      // Lấy trạng thái hiện tại
      const button1 = e.target; // Nút được click
      
      const currentStatus = button.getAttribute("data-TrangThai"); // Mặc định là "none" nếu không có trạng thái
      // Thay đổi trạng thái theo vòng lặp
      if (currentStatus === "Null") {
        button1.className = "status-btn present"; // Đổi màu thành xanh
        button1.setAttribute("data-TrangThai", "Có mặt");
      }
      if (currentStatus === "Có mặt") {
        button1.className = "status-btn absent"; // Đổi màu thành đỏ
        button1.setAttribute("data-TrangThai", "Vắng");
      } 
      if (currentStatus === "Vắng") {
        button1.className = "status-btn none"; // Đổi màu thành xám
        button1.setAttribute("data-TrangThai", "Null");
      }
      
    });
  });
  

  // Hiện nút "Hủy" nếu cần
  cancelButton.classList.remove("hidden");
  updateButton.classList.add("hidden");
});

cancelButton.addEventListener("click", () => {
  // Lấy tất cả các nút "status-btn"
  const statusButtons = document.querySelectorAll(".status-btn");

  // Kích hoạt tất cả các nút
  statusButtons.forEach(button => {
    button.disabled = true; // Bỏ vô hiệu hóa
  });
  updateButton.classList.remove("hidden");
  cancelButton.classList.add("hidden");
  confirmationModal.classList.remove("hidden");
  confirmationModal.style.display = "flex"
});

confirmYesButton.addEventListener("click", () => {
  const statusButtons = document.querySelectorAll(".status-btn");

  const tuan = document.getElementById("week-dropdown").value;
  const hocKy = document.getElementById("semester-dropdown").value;
  const namHoc = document.getElementById("year-dropdown").value;

  // Reset mảng changedStates
  const changedStates = [];

  statusButtons.forEach(button => {
      const MaHocSinh = button.getAttribute("data-MaHocSinh");
      const Ngay = button.getAttribute("data-Ngay");
      const TrangThai = button.getAttribute("data-TrangThai");
      const MaLop = button.getAttribute("data-MaLop");

      // Đẩy dữ liệu vào changedStates
      changedStates.push({
        maHocSinh: MaHocSinh,
        ngay: Ngay,
        trangThai: TrangThai,
        maLop: MaLop,
        maTuan: tuan,
        maHocKy: hocKy,
        maNamHoc: namHoc,
        maGiaoVien: maGV,
        maMH: maMonHoc
      });
  });

  if (changedStates.length > 0) {
    fetch("http://localhost:5000/update-attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(changedStates)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showToast("Cập nhật thành công!", "success");
        } else {
          showToast("Cập nhật thất bại!", "error");
        }
      })
      .catch(error => {
        console.error("Lỗi khi cập nhật:", error);
        showToast("Lỗi trong quá trình gửi dữ liệu!", "error");
      });
  } else {
    showToast("Không có thay đổi nào để lưu!", "info");
  }
  loadClassAttendance(maGV, maMonHoc); 
  // Đóng modal
  updateButton.classList.remove("hidden");
  confirmationModal.classList.add("hidden");
  confirmationModal.style.display = "none";
});


confirmNoButton.addEventListener("click", () => {
  showToast("Bạn đã hủy thay đổi!","error")
  updateButton.classList.remove("hidden");
  confirmationModal.classList.add("hidden");
  confirmationModal.style.display = "none"
  loadClassAttendance(maGV, maMonHoc);
});


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



const class_dropdown = document.getElementById('class-dropdown');
const year_dropdown = document.getElementById('year-dropdown');
const class_dropdown1 = document.getElementById('class-dropdown1');
const year_dropdown1 = document.getElementById('year-dropdown1');
const class_dropdown2 = document.getElementById('class-dropdown2');


// Logout button functionality
document.getElementById("logout-btn").addEventListener("click", () => {
  showToast("Đăng xuất thành công!", "success");
  // Redirect to login page
  setTimeout(function() {
    window.location.href = "index.html";
  }, 1500);
});



// Hàm chuyển đổi ngày sinh (nếu cần)
function formatDate(dateString) {
  const date = new Date(dateString);

  // Sử dụng múi giờ địa phương thay vì UTC
  const day = String(date.getDate()).padStart(2, '0');  // getDate() trả về ngày theo múi giờ địa phương
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() trả về tháng (0-11), cộng thêm 1 để thành tháng 1-12
  const year = date.getFullYear();  // getFullYear() trả về năm theo múi giờ địa phương

  return `${day}-${month}-${year}`;
}

function formatDate1(dateString) {
  const date = new Date(dateString);

  // Sử dụng múi giờ địa phương thay vì UTC
  const day = String(date.getDate()).padStart(2, '0');  // getDate() trả về ngày theo múi giờ địa phương
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() trả về tháng (0-11), cộng thêm 1 để thành tháng 1-12
  const year = date.getFullYear();  // getFullYear() trả về năm theo múi giờ địa phương

  return `${year}-${month}-${day}`;
}

// Lấy mã giáo viên từ localStorage hoặc từ URL
const maGiaoVien = localStorage.getItem('roleId');  // Nếu không có, sử dụng mặc định 'GV001'
let maMonHoc = null;
let maGV = null;
let maLopLast = null;
let tuanLast = null;
let hocKyLast = null;
let namHocLast = null;

// Lấy thông tin giáo viên từ server
fetch(`http://localhost:5000/teacher/${maGiaoVien}`)
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const teacher = data.teacher;

      // Đổ dữ liệu vào các trường thông tin cá nhân
      document.querySelector('.profile h6').textContent = teacher.HoTen;
      document.getElementById("teacher-id").textContent = teacher.MaGiaoVien;
      document.getElementById("teacher-name").textContent = teacher.HoTen;
      document.getElementById("teacher-dob").textContent = formatDate(teacher.NgaySinh);
      document.getElementById("teacher-gender").textContent = teacher.GioiTinh;
      document.getElementById("teacher-subject").textContent = teacher.TenMonHoc;
      maMonHoc = teacher.MaMonHoc;
      maGV = teacher.MaGiaoVien;
      getClass();
      
    } else {
      showToast('Không tìm thấy thông tin giáo viên','error');
    }
  })
  .catch(error => {
    console.error('Lỗi:', error);
    showToast('Đã xảy ra lỗi khi lấy thông tin giáo viên','error');
  });


  function getClass(){
    fetch(`http://localhost:5000/getClass/${maGiaoVien}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Lỗi từ server: ' + response.status); // Kiểm tra mã trạng thái lỗi
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        const Lop = data.Lop;
        Lop.forEach((lop) => {
          const option = document.createElement('option');
          option.value = lop.MaLop;
          option.textContent = lop.MaLop;
          class_dropdown.appendChild(option);
        });
        Lop.forEach((lop) => {
          const option = document.createElement('option');
          option.value = lop.MaLop;
          option.textContent = lop.MaLop;
          class_dropdown1.appendChild(option);
        });
        Lop.forEach((lop) => {
          const option = document.createElement('option');
          option.value = lop.MaLop;
          option.textContent = lop.MaLop;
          class_dropdown2.appendChild(option);
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
    
      years.forEach((nam) => {
        const option = document.createElement('option');
        option.value = nam.ma;
        option.textContent = nam.ten;
        year_dropdown1.appendChild(option);
        
      });
      
        loadClassAttendance(maGV,maMonHoc);
      } else {
        showToast('Không tìm thấy thông tin học sinh','error');
      }
    })
    .catch(error => {
      console.error('Lỗi:', error);
      showToast('Đã xảy ra lỗi khi lấy thông tin học sinh','error');
    });
  }

function loadClassAttendance(maGiaoVien,maMonHoc) {
  const maLop = document.getElementById("class-dropdown").value;
  const tuan = document.getElementById("week-dropdown").value;
  const hocKy = document.getElementById("semester-dropdown").value;
  const namHoc = document.getElementById("year-dropdown").value;

  // Lấy điểm danh lớp theo tuần, học kỳ, năm học
  fetch(`http://localhost:5000/attendance-by-class?maGiaoVien=${maGiaoVien}&maMonHoc=${maMonHoc}&maLop=${maLop}&tuan=${tuan}&hocKy=${hocKy}&namHoc=${namHoc}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {

        maLopLast = maLop;
        tuanLast = tuan;
        hocKyLast = hocKy;
        namHocLast = namHoc;

        const attendance = data.attendance;
        const tableBody = document.getElementById("class-list-table-body");
        const tableHead = document.querySelector(".class-table thead tr");

        // Làm sạch bảng cũ
        tableBody.innerHTML = '';
        tableHead.innerHTML = '<th>Tên học sinh</th>';  // Reset tiêu đề bảng

        // Tạo mảng các ngày khác nhau từ dữ liệu điểm danh
        const daysSet = new Set();  // Set sẽ loại bỏ các ngày trùng nhau
        const daysSet1 = new Set();
        attendance.forEach(item => {
          const date = formatDate(new Date(item.Ngay));  // Định dạng lại ngày
          daysSet.add(date);  // Thêm vào Set
          daysSet1.add(item.Ngay);  // Thêm vào Set
        });
          
        // Chuyển Set thành mảng để dễ dàng duyệt qua
        const daysInWeek = Array.from(daysSet);
        const daysInWeek1 = Array.from(daysSet1);
        // Hàm chuyển đổi từ số ngày sang thứ
        function getDayName(date) {
          const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
          const dayIndex = new Date(formatDate1(date)).getDay(); // Lấy chỉ số thứ (0 - 6)
          return days[dayIndex];
        }
        
                // Thêm các cột ngày và thứ vào bảng
        daysInWeek1.forEach(day => {
          const th = document.createElement("th");
          const dayName = getDayName(day);  // Lấy thứ từ ngày
          th.textContent = ` ${dayName} ${formatDate(new Date(day))}`;  // Hiển thị ngày kèm thứ
          tableHead.appendChild(th);
        });

        // Lọc ra các học sinh trong lớp (dựa trên tên học sinh)
        const students = [...new Set(attendance.map(item => item.HoTen))]; // Lấy tên học sinh duy nhất

        // Tạo danh sách học sinh và điểm danh
        students.forEach(student => {
          const row = document.createElement("tr");

          // Thêm tên học sinh vào cột đầu tiên
          const studentCell = document.createElement("td");
          studentCell.textContent = student;
          row.appendChild(studentCell);

          // Duyệt qua các ngày và thêm trạng thái điểm danh vào mỗi cột
          daysInWeek.forEach(day => {
            const statusCell = document.createElement("td");
            const statusButton = document.createElement("button");
            statusButton.classList.add("status-btn");
          
            // Kiểm tra trạng thái cho ngày này
            const attendanceStatus = attendance.find(d => d.HoTen === student && formatDate(new Date(d.Ngay)) === day);
            if (attendanceStatus) {
              if (attendanceStatus.TrangThai === "Có mặt") {
                statusButton.classList.add("present");  // Màu xanh
              } else if (attendanceStatus.TrangThai === "Vắng") {
                statusButton.classList.add("absent");  // Màu đỏ
              } else if (attendanceStatus.TrangThai === "Null") {
                statusButton.classList.add("none");  // Màu xám
              }
              
            } else {
              statusButton.classList.add("none");  // Màu xám (Chưa có thông tin)
            }
          
            // Gắn các thuộc tính dữ liệu
            if (attendanceStatus) {
              statusButton.setAttribute("data-MaHocSinh", attendanceStatus.MaHocSinh);
              statusButton.setAttribute("data-Ngay", formatDate1(new Date(attendanceStatus.Ngay)));
              statusButton.setAttribute("data-TrangThai", attendanceStatus.TrangThai);
              statusButton.setAttribute("data-MaLop", attendanceStatus.MaLop);
              console.log(attendanceStatus.MaHocSinh,attendanceStatus.Ngay,attendanceStatus.TrangThai);
            }
          
            
            statusButton.disabled = true; // Vô hiệu hóa nút
            statusCell.appendChild(statusButton);
            row.appendChild(statusCell);
          });
          

          // Thêm học sinh vào bảng
          tableBody.appendChild(row);
        });
      } else {
        const tableBody = document.getElementById("class-list-table-body");
        const tableHead = document.querySelector(".class-table thead tr");
        tableBody.innerHTML = '';
        tableHead.innerHTML = '';

        // Thêm một hàng với nội dung và đường thẳng ngang qua
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        // Thiết lập nội dung
        cell.textContent = "Không tìm thấy dữ liệu!";
        cell.setAttribute("colspan", "1"); // Thay 2 bằng số lượng cột của bảng
        cell.style.textAlign = "center"; // Canh giữa nội dung
        if (ds){
          showToast("Lỗi khi lấy danh sách lớp","error");
        }
        // Thêm ô vào hàng và hàng vào bảng
        row.appendChild(cell);
        tableBody.appendChild(row);
      }
    })
    .catch(error => console.error("Lỗi khi lấy dữ liệu điểm danh:", error));
}
  
// Hàm chuyển đổi ngày sinh (nếu cần)
function formatDate(dateString) {
  const date = new Date(dateString);

  // Sử dụng múi giờ địa phương thay vì UTC
  const day = String(date.getDate()).padStart(2, '0');  // getDate() trả về ngày theo múi giờ địa phương
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() trả về tháng (0-11), cộng thêm 1 để thành tháng 1-12
  const year = date.getFullYear();  // getFullYear() trả về năm theo múi giờ địa phương

  return `${day}/${month}/${year}`;
}

// Hàm trung gian để xử lý sự kiện thay đổi
function handleDropdownChange() {
  if (maGV && maMonHoc) {
    ds = ds + 1;
    loadClassAttendance(maGV, maMonHoc); // Gọi hàm với tham số toàn cục
  } else {
    console.error("Thông tin maGV hoặc maMonHoc không có sẵn!");
  }
}

function handleDropdownChange1() {
  if (maGV && maMonHoc) {
    tk = tk + 1;
    fetchAttendanceData(maGV, maMonHoc);
  } else {
    console.error("Thông tin maGV hoặc maMonHoc không có sẵn!");
  }
}




function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  // Xử lý loại thông báo (thành công, lỗi, thông tin)
  if (type === "error") {
      toast.classList.add("toast-error");
      toast.classList.remove("toast-success");
  } else if (type === "success") {
      toast.classList.add("toast-success");
      toast.classList.remove("toast-error");
  }
  
  
  // Hiển thị toast
  toast.classList.add("show");

  // Ẩn toast sau 2 giây
  setTimeout(() => {
      toast.classList.remove("show");
  }, 2000);
}
var char = null;
function fetchAttendanceData(maGiaoVien, maMonHoc) {
  const maLop = document.getElementById("class-dropdown1").value;
  const tuan = document.getElementById("week-dropdown1").value;
  const hocKy = document.getElementById("semester-dropdown1").value;
  const namHoc = document.getElementById("year-dropdown1").value;
  
  fetch(
    `http://localhost:5000/api/attendance-summary?maGiaoVien=${maGiaoVien}&maMonHoc=${maMonHoc}&maLop=${maLop}&maTuan=${tuan}&maHocKy=${hocKy}&maNamHoc=${namHoc}`
  )
    .then((response) => {
      if (!response.ok) {
        console.error('Lỗi khi gọi API:', response.status, response.statusText);
        return [];
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        const ctx = document.getElementById('attendanceChart').getContext('2d');

        console.log(result.data.length)
        console.log(result.data[0].Thu)
        const dataDiHoc = [null,null,null,null,null,null,null];
        const dataVang = [null,null,null,null,null,null,null];
        const dataNull = [null,null,null,null,null,null,null];
        const dataThu = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6','Thứ 7'];
        const siSoLop = result.data[0].SiSoLop;
        const siSo = [siSoLop, siSoLop, siSoLop, siSoLop, siSoLop, siSoLop, siSoLop];

        for (let i = 0; i < result.data.length; i++){
          const thu = result.data[i].Thu;
          const index = dataThu.indexOf(thu);
          if (index !== -1) {
            // console.log(index);
            dataDiHoc[index] = result.data[i].SoNguoiDiHoc;
            dataVang[index] = result.data[i].SoNguoiVang;
          } 
        }


        const data = {
          labels:  dataThu,
          datasets: [
            {
              label: 'Đi học',
              data: dataDiHoc,
              backgroundColor: 'green',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Vắng',
              data:  dataVang,
              backgroundColor: 'red',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Sĩ số',
              data:  siSo,
              backgroundColor: 'blue',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        };
      
        const config = {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        };
        if (char) {
          char.destroy(); // Xóa biểu đồ cũ trước khi tạo mới
        }        
        // Tạo biểu đồ
        char = new Chart(ctx, config);

        return result.data; // Trả về dữ liệu từ API
      } else {
        
        console.error('API trả về lỗi:', result.error);
        
        if (char) {
          char.destroy(); // Hủy biểu đồ nếu có
          char = null;
        }
        return;
      
        
      }
    })
    .catch((error) => {
      if(tk){
        showToast("Lỗi khi thống kê","error");
      }
      console.error('Lỗi khi gọi API:', error);
      if (char) {
        char.destroy(); // Hủy biểu đồ nếu có
        char = null;
      }
      return;
      
    });
}

document.getElementById('start-camera').addEventListener('click', () => {
  const maLop = document.getElementById("class-dropdown2").value;

  fetch(`http://localhost:5000/start-recognition?maGiaoVien=${maGiaoVien}&maLop=${maLop}`, {
    method: 'POST',
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log('Điểm danh thành công:', data.detectedFaces);
      showToast('Điểm danh thành công!',"success");
    } else {
      console.error('Lỗi khi điểm danh:', data.error);
      showToast('Lỗi khi điểm danh!',"error");
    }
  })
  .catch((error) => console.error('Lỗi kết nối:', error));
});






// Gắn sự kiện thay đổi cho các dropdown
document.getElementById("week-dropdown").addEventListener("change", handleDropdownChange);
document.getElementById("semester-dropdown").addEventListener("change", handleDropdownChange);
document.getElementById("year-dropdown").addEventListener("change", handleDropdownChange);
document.getElementById("class-dropdown").addEventListener("change", handleDropdownChange);

document.getElementById("week-dropdown1").addEventListener("change", handleDropdownChange1);
document.getElementById("semester-dropdown1").addEventListener("change", handleDropdownChange1);
document.getElementById("year-dropdown1").addEventListener("change", handleDropdownChange1);
document.getElementById("class-dropdown1").addEventListener("change", handleDropdownChange1);
