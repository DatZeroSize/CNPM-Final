const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
// Cấu hình Multer để lưu tạm ảnh vào thư mục `temp`
const upload = multer({ dest: 'temp/' });
// Tạo ứng dụng Express
const app = express();
const port = 5000;

// Sử dụng middleware
app.use(cors());
app.use(bodyParser.json());

// Phục vụ các tệp tĩnh từ thư mục CNPM-Frontend
app.use(express.static(path.join(__dirname, '../CNPM-Frontend')));

// Khi truy cập trang gốc, phục vụ index.html
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// Kết nối đến cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dat261303', // Mật khẩu của bạn
  database: 'DiemDanhHocSinh',
});

// Kiểm tra kết nối
connection.connect(err => {
  if (err) {
    console.error('Lỗi kết nối:', err.stack);
    return;
  }
  console.log('Kết nối thành công');
});

// Đăng nhập API
app.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  const query = `
    SELECT TenDangNhap, LoaiTaiKhoan, MaHocSinh, MaGiaoVien, MaAdmin 
    FROM TaiKhoan 
    WHERE TenDangNhap = ? AND MatKhau = ? AND LoaiTaiKhoan = ?;
  `;

  connection.execute(query, [username, password, role], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu', success: false });
    }

    if (results.length > 0) {
      const role = results[0].LoaiTaiKhoan;
      const roleId = role === 'HocSinh' ? results[0].MaHocSinh : (role === 'GiaoVien' ? results[0].MaGiaoVien : results[0].MaAdmin);
      return res.json({ success: true, role, roleId });
    } else {
      return res.status(400).json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });
    }
  });
});


app.get('/student/:ma_hocsinh', (req, res) => {
  const { ma_hocsinh } = req.params;

  const query = `
    SELECT MaHocSinh, HoTen, MaLop, NgaySinh, GioiTinh, SoDienThoai, HoTenCha, HoTenMe, QueQuan
    FROM HocSinh
    WHERE MaHocSinh = ?;
  `;

  connection.execute(query, [ma_hocsinh], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Lỗi truy vấn cơ sở dữ liệu' });
    }

    if (results.length > 0) {
      return res.json({ success: true, student: results[0] });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh' });
    }
  });
});


//Lấy môn học
app.get('/getSubject/:ma_hocsinh', (req, res) => {
  const { ma_hocsinh } = req.params;

  const query = `
   SELECT DISTINCT 
    MonHoc.MaMonHoc, 
    MonHoc.TenMonHoc
    FROM DiemDanh
    JOIN MonHoc ON DiemDanh.MaMonHoc = MonHoc.MaMonHoc
    WHERE DiemDanh.MaHocSinh = ?; 
  `;
  connection.execute(query, [ma_hocsinh], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Lỗi truy vấn cơ sở dữ liệu' });
    }

    if (results.length > 0) {
      return res.json({ success: true, monHoc: results });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin môn học' });
    }
  });
});

// Lấy lịch sử điểm danh cho học sinh theo mã học sinh, tuần, học kỳ, và năm học
app.get('/attendance-history/:ma_hocsinh', (req, res) => {
  const { ma_hocsinh } = req.params;
  const { tuan, hocKy, namHoc, monHoc} = req.query;

  console.log(`Nhận tham số từ frontend: MaHocsinh=${ma_hocsinh}, Tuan=${tuan}, HocKy=${hocKy}, NamHoc=${namHoc}, MaMonHoc=${monHoc}`);

  const query = `
 SELECT 
    TuanHoc.MaTuan, 
    HocKy.TenHocKy, 
    NamHoc.TenNamHoc, 
    CONVERT_TZ(DiemDanh.Ngay, '+00:00', '+07:00') AS Ngay,
    CASE 
        DAYNAME(CONVERT_TZ(DiemDanh.Ngay, '+00:00', '+07:00'))
        WHEN 'Sunday' THEN 'Chủ Nhật'
        WHEN 'Monday' THEN 'Thứ 2'
        WHEN 'Tuesday' THEN 'Thứ 3'
        WHEN 'Wednesday' THEN 'Thứ 4'
        WHEN 'Thursday' THEN 'Thứ 5'
        WHEN 'Friday' THEN 'Thứ 6'
        WHEN 'Saturday' THEN 'Thứ 7'
    END AS Thu, 
    DiemDanh.TrangThai
FROM DiemDanh
JOIN TuanHoc ON DiemDanh.MaTuan = TuanHoc.MaTuan
JOIN HocKy ON DiemDanh.MaHocKy = HocKy.MaHocKy
JOIN NamHoc ON DiemDanh.MaNamHoc = NamHoc.MaNamHoc
WHERE DiemDanh.MaHocSinh = ?
    AND DiemDanh.MaTuan = ?
    AND DiemDanh.MaHocKy = ?
    AND DiemDanh.MaNamHoc = ?
    AND DiemDanh.MaMonHoc = ?
ORDER BY DiemDanh.Ngay;


`;


  connection.execute(query, [ma_hocsinh, tuan, hocKy, namHoc, monHoc], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ success: false, message: 'Lỗi truy vấn cơ sở dữ liệu' });
    }

    if (results.length > 0) {
      return res.json({ success: true, history: results });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch sử điểm danh' });
    }
  });
});


app.get('/teacher/:ma_giaovien', (req, res) => {
  const { ma_giaovien } = req.params;

  const query = `
        SELECT 
        GiaoVien.MaGiaoVien, 
        GiaoVien.HoTen, 
        GiaoVien.NgaySinh, 
        GiaoVien.GioiTinh, 
        GiaoVien.MaMonHoc,
        MonHoc.TenMonHoc
    FROM GiaoVien
    JOIN MonHoc ON GiaoVien.MaMonHoc = MonHoc.MaMonHoc
    WHERE GiaoVien.MaGiaoVien = ?;
  `;

  connection.execute(query, [ma_giaovien], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ success: false, message: 'Lỗi truy vấn cơ sở dữ liệu' });
    }

    if (results.length > 0) {
      return res.json({ success: true, teacher: results[0] });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin giáo viên' });
    }
  });
});


//Lấy môn học
app.get('/getClass/:ma_giaovien', (req, res) => {
  const { ma_giaovien } = req.params;

  const query = `
   SELECT DISTINCT 
    Lop.MaLop, 
    Lop.TenLop 
    FROM LopGiangDay
    JOIN Lop ON LopGiangDay.MaLop = Lop.MaLop
    WHERE LopGiangDay.MaGiaoVien = ?
  `;
  connection.execute(query, [ma_giaovien], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Lỗi truy vấn cơ sở dữ liệu' });
    }

    if (results.length > 0) {
      return res.json({ success: true, Lop: results });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin môn học' });
    }
  });
});


// Route lấy điểm danh của học sinh trong lớp theo tuần, học kỳ và năm học
// Route để lấy điểm danh theo lớp, tuần, học kỳ, năm học
// Route API xử lý điểm danh theo lớp
app.get('/attendance-by-class', (req, res) => {
  const { maGiaoVien, maMonHoc, maLop, tuan, hocKy, namHoc } = req.query;
  
  console.log('Nhận tham số từ frontend:', maLop, tuan, hocKy, namHoc); // Log để kiểm tra

  const query = `
    SELECT 
      HocSinh.HoTen, 
      HocSinh.MaHocSinh,
      DiemDanh.MaLop,
      DiemDanh.Ngay, 
      DiemDanh.TrangThai
    FROM DiemDanh
    JOIN HocSinh ON DiemDanh.MaHocSinh = HocSinh.MaHocSinh
    JOIN Lop ON DiemDanh.MaLop = Lop.MaLop
    JOIN TuanHoc ON DiemDanh.MaTuan = TuanHoc.MaTuan
    JOIN HocKy ON DiemDanh.MaHocKy = HocKy.MaHocKy
    JOIN NamHoc ON DiemDanh.MaNamHoc = NamHoc.MaNamHoc
    WHERE DiemDanh.MaLop = ? AND DiemDanh.MaTuan = ? AND DiemDanh.MaHocKy = ? AND DiemDanh.MaNamHoc = ? AND DiemDanh.MaGiaoVien = ? AND DiemDanh.MaMonHoc = ?
    ORDER BY DiemDanh.Ngay;
  `;
  
  connection.execute(query, [maLop, tuan, hocKy, namHoc, maGiaoVien, maMonHoc], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ success: false, message: 'Lỗi truy vấn cơ sở dữ liệu' });
    }

    if (results.length > 0) {
      return res.json({ success: true, attendance: results });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy điểm danh cho lớp này' });
    }
  });
});
app.post('/update-attendance', (req, res) => {
  const changes = req.body;

  changes.forEach(change => {
    const { maHocSinh, ngay, trangThai, maLop, maTuan, maHocKy, maNamHoc, maGiaoVien, maMH  } = change;
    console.log(trangThai)
    const query = `
      UPDATE DiemDanh
      SET TrangThai = ?
      WHERE DiemDanh.MaHocSinh = ?
        AND DiemDanh.Ngay = ?
        AND DiemDanh.MaLop = ?
        AND DiemDanh.MaTuan = ?
        AND DiemDanh.MaHocKy = ?
        AND DiemDanh.MaNamHoc = ?
        AND DiemDanh.MaGiaoVien = ?
        AND DiemDanh.MaMonHoc = ?
    `;

    connection.execute(query, [trangThai, maHocSinh, ngay, maLop, maTuan, maHocKy, maNamHoc, maGiaoVien, maMH ], (err, results) => {
      if (err) {
        console.error('Lỗi khi cập nhật điểm danh:', err);
        return res.status(500).json({ success: false, message: 'Lỗi cập nhật điểm danh' });
      }
    });
  });

  return res.json({ success: true, message: 'Cập nhật điểm danh thành công!' });
});

app.get('/account/:accountId', (req, res) => {
  const accountId = req.params.accountId;

  const sql = `
    SELECT 
      MaTaiKhoan, 
      TenDangNhap, 
      MatKhau, 
      LoaiTaiKhoan, 
      CASE
        WHEN LoaiTaiKhoan = 'QuanTriVien' THEN MaAdmin
        WHEN LoaiTaiKhoan = 'GiaoVien' THEN MaGiaoVien
        WHEN LoaiTaiKhoan = 'HocSinh' THEN MaHocSinh
      END AS MaVaiTro
    FROM TaiKhoan
    WHERE MaTaiKhoan = ?
  `;

  connection.execute(sql, [accountId], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn:", err);
      return res.status(500).json({ error: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
    }

    if (results.length > 0) {
      return res.json(results[0]); // Trả dữ liệu tài khoản
    } else {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
    }
  });
});

// Route thêm tài khoản
app.post('/add-account', (req, res) => {
  console.log(req.body); // Log dữ liệu nhận được từ frontend

  const { MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaVaiTro } = req.body;

  // Biến để lưu các giá trị tương ứng
  let MaAdmin = null;
  let MaGiaoVien = null;
  let MaHocSinh = null;

  // Xác định giá trị cho MaAdmin, MaGiaoVien hoặc MaHocSinh dựa trên LoaiTaiKhoan
  if (LoaiTaiKhoan === 'HocSinh') {
    MaHocSinh = MaVaiTro; // Lưu MaVaiTro vào MaHocSinh nếu là học sinh
  } else if (LoaiTaiKhoan === 'GiaoVien') {
    MaGiaoVien = MaVaiTro; // Lưu MaVaiTro vào MaGiaoVien nếu là giáo viên
  } else if (LoaiTaiKhoan === 'QuanTriVien') {
    MaAdmin = MaVaiTro;    // Lưu MaVaiTro vào MaAdmin nếu là quản trị viên
  }

  // Kiểm tra xem MaHocSinh có tồn tại trong bảng HocSinh
  if (MaHocSinh) {
    const checkQuery = `SELECT COUNT(*) AS count FROM HocSinh WHERE MaHocSinh = ?`;
    connection.execute(checkQuery, [MaHocSinh], (err, results) => {
      if (err) {
        console.error("Lỗi khi kiểm tra học sinh:", err);
        return res.status(500).json({ success: false, message: 'Lỗi kiểm tra học sinh' });
      }

      if (results[0].count === 0) {
        // Nếu không có học sinh với MaHocSinh này, trả về lỗi
        return res.status(400).json({ success: false, message: 'Mã vai trò không hợp lệ' });
      }

      // Tiến hành thêm tài khoản vào bảng TaiKhoan
      const query = `
        INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin, MaGiaoVien, MaHocSinh)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      connection.execute(query, [MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin, MaGiaoVien, MaHocSinh], (err, results) => {
        if (err) {
          console.error("Lỗi khi thêm tài khoản:", err);
          return res.status(500).json({ success: false, message: 'Lỗi khi thêm tài khoản' });
        }

        return res.json({ success: true, message: 'Tài khoản đã được thêm thành công!' });
      });
    });
  } 
  else if (MaGiaoVien) {
    const checkQuery = `SELECT COUNT(*) AS count FROM GiaoVien WHERE MaGiaoVien = ?`;
    connection.execute(checkQuery, [MaGiaoVien], (err, results) => {
      if (err) {
        console.error("Lỗi khi kiểm tra học sinh:", err);
        return res.status(500).json({ success: false, message: 'Lỗi kiểm tra học sinh' });
      }

      if (results[0].count === 0) {
        // Nếu không có học sinh với MaHocSinh này, trả về lỗi
        return res.status(400).json({ success: false, message: 'Mã vai trò không hợp lệ' });
      }

      // Tiến hành thêm tài khoản vào bảng TaiKhoan
      const query = `
        INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin, MaGiaoVien, MaHocSinh)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      connection.execute(query, [MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin, MaGiaoVien, MaHocSinh], (err, results) => {
        if (err) {
          console.error("Lỗi khi thêm tài khoản:", err);
          return res.status(500).json({ success: false, message: 'Lỗi khi thêm tài khoản' });
        }

        return res.json({ success: true, message: 'Tài khoản đã được thêm thành công!' });
      });
    });
  }
  else if (MaAdmin) {
    const checkQuery = `SELECT COUNT(*) AS count FROM Admin_ql WHERE MaAdmin = ?`;
    connection.execute(checkQuery, [MaAdmin], (err, results) => {
      if (err) {
        console.error("Lỗi khi kiểm tra học sinh:", err);
        return res.status(500).json({ success: false, message: 'Lỗi kiểm tra học sinh' });
      }

      if (results[0].count === 0) {
        // Nếu không có học sinh với MaHocSinh này, trả về lỗi
        return res.status(400).json({ success: false, message: 'Mã vai trò không hợp lệ' });
      }

      // Tiến hành thêm tài khoản vào bảng TaiKhoan
      const query = `
        INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin, MaGiaoVien, MaHocSinh)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      connection.execute(query, [MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin, MaGiaoVien, MaHocSinh], (err, results) => {
        if (err) {
          console.error("Lỗi khi thêm tài khoản:", err);
          return res.status(500).json({ success: false, message: 'Lỗi khi thêm tài khoản' });
        }

        return res.json({ success: true, message: 'Tài khoản đã được thêm thành công!' });
      });
    });
  }
});

app.delete('/delete-account/:accountId', (req, res) => {
  const { accountId } = req.params;

  // Thực hiện xóa tài khoản khỏi bảng TaiKhoan
  const query = `DELETE FROM TaiKhoan WHERE MaTaiKhoan = ?`;

  connection.execute(query, [accountId], (err, results) => {
    if (err) {
      console.error("Lỗi khi xóa tài khoản:", err);
      return res.status(500).json({ success: false, message: 'Lỗi khi xóa tài khoản' });
    }

    // Kiểm tra nếu tài khoản không tồn tại
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản với mã này' });
    }

    return res.json({ success: true, message: 'Tài khoản đã được xóa thành công!' });
  });
});

app.put('/update-account/:accountId', (req, res) => {
  const { accountId } = req.params;
  const { TenDangNhap, MatKhau, LoaiTaiKhoan } = req.body;

  // Thực hiện câu lệnh cập nhật
  const query = `
      UPDATE TaiKhoan
      SET TenDangNhap = ?, MatKhau = ?
      WHERE MaTaiKhoan = ? 
  `;

  connection.execute(query, [TenDangNhap,  MatKhau, accountId], (err, results) => {
      if (err) {
          console.error("Lỗi khi cập nhật tài khoản:", err);
          return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tài khoản' });
      }

      return res.json({ success: true, message: 'Tài khoản đã được cập nhật thành công!' });
  });
});

app.get("/get-all-accounts", (req, res) => {
  const query = `SELECT 
  MaTaiKhoan, 
      TenDangNhap, 
      MatKhau, 
      LoaiTaiKhoan, 
      CASE
        WHEN LoaiTaiKhoan = 'QuanTriVien' THEN MaAdmin
        WHEN LoaiTaiKhoan = 'GiaoVien' THEN MaGiaoVien
        WHEN LoaiTaiKhoan = 'HocSinh' THEN MaHocSinh
      END AS MaVaiTro
  FROM TaiKhoan`; // Thay bằng truy vấn phù hợp với cơ sở dữ liệu của bạn
  connection.query(query, (error, results) => {
      if (error) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
          res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách tài khoản" });
      } else {
          res.json(results);
      }
  });
});







app.get('/api/attendance-summary', (req, res) => {
  const { maGiaoVien, maMonHoc, maLop, maTuan, maHocKy, maNamHoc } = req.query;
  const query = `
    SELECT 
    DiemDanh.Ngay AS Ngay,
    CASE DAYOFWEEK(DiemDanh.Ngay)
        WHEN 1 THEN 'Chủ nhật'
        WHEN 2 THEN 'Thứ 2'
        WHEN 3 THEN 'Thứ 3'
        WHEN 4 THEN 'Thứ 4'
        WHEN 5 THEN 'Thứ 5'
        WHEN 6 THEN 'Thứ 6'
        WHEN 7 THEN 'Thứ 7'
    END AS Thu,
    DiemDanh.MaLop AS Lop,
    COUNT(CASE WHEN DiemDanh.TrangThai = 'Có mặt' THEN 1 END) AS SoNguoiDiHoc,
    COUNT(CASE WHEN DiemDanh.TrangThai = 'Vắng' THEN 1 END) AS SoNguoiVang,
    (SELECT COUNT(HocSinh.MaHocSinh) 
     FROM HocSinh 
     WHERE HocSinh.MaLop = DiemDanh.MaLop) AS SiSoLop -- Subquery tính sĩ số lớp
    FROM 
        DiemDanh
    WHERE 
        DiemDanh.MaGiaoVien = ?
        AND DiemDanh.MaMonHoc = ?
        AND DiemDanh.MaTuan = ?
        AND DiemDanh.MaLop = ?
        AND DiemDanh.MaHocKy = ?
        AND DiemDanh.MaNamHoc = ?
    GROUP BY 
        DiemDanh.Ngay, DiemDanh.MaLop
    ORDER BY 
        DiemDanh.Ngay ASC;
  `;

  connection.query(query, [maGiaoVien, maMonHoc, maTuan, maLop, maHocKy, maNamHoc], (err, results) => {
    if (err) {
      console.error('Lỗi khi thực thi truy vấn:', err);
      res.status(500).json({ success: false, error: err.message });
      return;
    }
    res.json({ success: true, data: results });
  });
});


app.post("/bulk-add-accounts", (req, res) => {
  const accounts = req.body;

  if (!Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({ success: false, message: "Danh sách tài khoản không hợp lệ!" });
  }

  // Tạo danh sách các giá trị cho SQL
  const values = accounts.map(account => [
      account.MaTaiKhoan,
      account.TenDangNhap,
      account.MatKhau,
      account.LoaiTaiKhoan,
      account.MaAdmin,
      account.MaGiaoVien,
      account.MaHocSinh,
  ]);

  const sql = `
      INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin, MaGiaoVien, MaHocSinh)
      VALUES ?
      ON DUPLICATE KEY UPDATE
          TenDangNhap = VALUES(TenDangNhap),
          MatKhau = VALUES(MatKhau),
          LoaiTaiKhoan = VALUES(LoaiTaiKhoan),
          MaAdmin = VALUES(MaAdmin),
          MaGiaoVien = VALUES(MaGiaoVien),
          MaHocSinh = VALUES(MaHocSinh)
  `;

  // Thực thi câu lệnh SQL
  connection.query(sql, [values], (err, result) => {
      if (err) {
          console.error("Lỗi khi thêm tài khoản hàng loạt:", err);
          return res.status(500).json({ success: false, message: "Lỗi server!" });
      }
      res.json({ success: true, message: "Đã thêm tài khoản thành công!", result });
  });
});



app.post('/start-recognition', (req, res) => {
  const { spawn } = require('child_process');
  const { maGiaoVien, maLop } = req.query; // Nhận mã giáo viên và mã lớp từ client
  const pythonPath = 'D:\\Anconda\\envs\\Open_CV_Conda\\python.exe';
  const scriptPath = 'C:\\Users\\HP\\PycharmProjects\\Open_CV_Conda\\nhan_dien_khuon_mat.py';

  const pythonProcess = spawn(pythonPath, [scriptPath]);

  let dataBuffer = ''; // Biến lưu trữ dữ liệu từ Python

  pythonProcess.stdout.on('data', (data) => {
    dataBuffer += data.toString(); // Thu thập dữ liệu từ Python script
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    try {
      // Parse dữ liệu từ Python script
      const detectedFaces = JSON.parse(dataBuffer);
      console.log('Kết quả nhận diện:', detectedFaces);

      // Cập nhật trạng thái "Có mặt" cho học sinh nhận diện được
      const sqlUpdatePresent = `
        UPDATE DiemDanh
        SET TrangThai = 'Có mặt'
        WHERE MaHocSinh IN (?) 
          AND MaLop = ? 
          AND MaGiaoVien = ? 
          AND Ngay = CURDATE()
      `;
      const paramsPresent = [detectedFaces, maLop, maGiaoVien];
      connection.query(sqlUpdatePresent, paramsPresent, (err, resultsPresent) => {
        if (err) {
          console.error('Lỗi khi cập nhật trạng thái "Có mặt":', err);
          return res.status(500).json({ success: false, error: 'Lỗi cập nhật trạng thái "Có mặt".' });
        }
        console.log('Cập nhật trạng thái "Có mặt" thành công:', resultsPresent);

        // Cập nhật trạng thái "Null" thành "Vắng" cho các học sinh còn lại
        const sqlUpdateAbsent = `
          UPDATE DiemDanh
          SET TrangThai = 'Vắng'
          WHERE TrangThai = 'Null'
            AND MaLop = ? 
            AND MaGiaoVien = ? 
            AND Ngay = CURDATE()
        `;
        const paramsAbsent = [maLop, maGiaoVien];
        connection.query(sqlUpdateAbsent, paramsAbsent, (err, resultsAbsent) => {
          if (err) {
            console.error('Lỗi khi cập nhật trạng thái "Vắng":', err);
            return res.status(500).json({ success: false, error: 'Lỗi cập nhật trạng thái "Vắng".' });
          }
          console.log('Cập nhật trạng thái "Vắng" thành công:', resultsAbsent);

          // Trả về phản hồi sau khi hoàn thành tất cả cập nhật
          res.json({ success: true, message: 'Điểm danh hoàn tất!', detectedFaces });
        });
      });
    } catch (err) {
      console.error('Lỗi khi parse dữ liệu:', err);
      res.status(500).json({ success: false, error: 'Lỗi khi parse dữ liệu từ Python.' });
    }
  });
});





app.post('/reset-password', (req, res) => {
  const { studentId, phoneNumber, newPassword } = req.body;

  // Kiểm tra thông tin sinh viên và số điện thoại
  connection.query(
    'SELECT * FROM HocSinh WHERE MaHocSinh = ? AND SoDienThoai = ?',
    [studentId, phoneNumber],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Lỗi hệ thống!' });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ success: false, error: 'Thông tin không chính xác!' });
      }

      // Cập nhật mật khẩu mới
      connection.query(
        'UPDATE TaiKhoan SET MatKhau = ? WHERE MaHocSinh = ?',
        [newPassword, studentId],
        (err, updateResults) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Không thể cập nhật mật khẩu!' });
          }

          res.json({ success: true, message: 'Mật khẩu đã được cập nhật!' });
        }
      );
    }
  );
});


// API cập nhật khuôn mặt học sinh
// API cập nhật khuôn mặt học sinh
// API cập nhật khuôn mặt học sinh
app.post('/upload-face', upload.array('images', 5), (req, res) => {
  const files = req.files; // Các tệp được upload
  const studentId = req.body.studentId; // ID của học sinh

  // Kiểm tra dữ liệu đầu vào
  if (!studentId || !files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ!' });
  }

  // Đường dẫn thư mục đích
  const destinationDir = path.join('C:\\Users\\HP\\PycharmProjects\\Open_CV_Conda\\dataset', studentId);

  try {
      // Xóa toàn bộ nội dung thư mục đích nếu nó đã tồn tại
      if (fs.existsSync(destinationDir)) {
          fs.readdirSync(destinationDir).forEach((file) => {
              fs.unlinkSync(path.join(destinationDir, file));
          });
          console.log(`Đã xóa toàn bộ nội dung trong thư mục: ${destinationDir}`);
      } else {
          // Tạo thư mục nếu chưa tồn tại
          fs.mkdirSync(destinationDir, { recursive: true });
          console.log(`Đã tạo thư mục: ${destinationDir}`);
      }

      // Lưu từng file vào thư mục
      files.forEach((file, index) => {
          const destinationFile = path.join(destinationDir, `face_${index + 1}.jpg`);

          // Sao chép file tạm đến thư mục đích
          fs.copyFileSync(file.path, destinationFile);

          // Xóa file tạm
          fs.unlinkSync(file.path);

          console.log(`Đã lưu tệp: ${destinationFile}`);
      });

      // Trả về phản hồi thành công
      return res.json({ success: true, message: 'Đã lưu tất cả tệp thành công!' });
  } catch (err) {
      console.error(`Lỗi khi xử lý tệp: ${err}`);
      return res.status(500).json({ success: false, message: 'Lỗi khi lưu tệp!' });
  }
});


// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});