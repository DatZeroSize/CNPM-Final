CREATE DATABASE DiemDanhHocSinh;
USE DiemDanhHocSinh;
-- DROP DATABASE DiemDanhHocSinh

-- Học kì 1: 18
-- Học kì 2: 17


CREATE TABLE Lop (
    MaLop VARCHAR(10) PRIMARY KEY,
    TenLop VARCHAR(50) NOT NULL
);

CREATE TABLE HocSinh (
    MaHocSinh VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    MaLop VARCHAR(10),
    NgaySinh DATE,
    GioiTinh ENUM('Nam', 'Nữ'),
    SoDienThoai VARCHAR(15),
    HoTenCha VARCHAR(100),
    HoTenMe VARCHAR(100),
    QueQuan VARCHAR(100),
    FOREIGN KEY (MaLop) REFERENCES Lop(MaLop)
);



CREATE TABLE Admin_QL (
    MaAdmin VARCHAR(10) PRIMARY KEY,  -- Mã admin
    HoTen VARCHAR(100) NOT NULL,  -- Họ tên
    NgaySinh DATE NOT NULL,  -- Ngày sinh
    GioiTinh ENUM('Nam', 'Nữ') NOT NULL  -- Giới tính
);

CREATE TABLE HocKy (
    MaHocKy VARCHAR(10) PRIMARY KEY,  -- Mã học kỳ
    TenHocKy VARCHAR(50) NOT NULL  -- Tên học kỳ (Ví dụ: Học kỳ 1, Học kỳ 2)
);

CREATE TABLE NamHoc (
    MaNamHoc VARCHAR(10) PRIMARY KEY,  -- Mã năm học
    TenNamHoc VARCHAR(50) NOT NULL  -- Tên năm học (Ví dụ: 2023-2024)
);


CREATE TABLE MonHoc (
    MaMonHoc VARCHAR(10) PRIMARY KEY, -- Mã môn học (ví dụ: TOAN, LY, HOA)
    TenMonHoc VARCHAR(100) NOT NULL  -- Tên môn học
);
CREATE TABLE GiaoVien (
    MaGiaoVien VARCHAR(10) PRIMARY KEY,  -- Mã giáo viên
    HoTen VARCHAR(100) NOT NULL,  -- Tên giáo viên
    NgaySinh DATE NOT NULL,  -- Ngày sinh
    GioiTinh ENUM('Nam', 'Nữ') NOT NULL,  -- Giới tính
    MaMonHoc VARCHAR(10),
    FOREIGN KEY (MaMonHoc) REFERENCES MonHoc(MaMonHoc)
);
INSERT INTO MonHoc (MaMonHoc, TenMonHoc) VALUES
('TOAN', 'Toán học'),
('LY', 'Vật lý'),
('HOA', 'Hóa học'),
('SINH', 'Sinh học'),
('VAN', 'Ngữ văn'),
('ANH', 'Tiếng Anh'),
('DIA', 'Địa lý'),
('SU', 'Lịch sử');


CREATE TABLE LopGiangDay (
    MaGiaoVien VARCHAR(10),      -- Mã giáo viên
	MaLop VARCHAR(10),
    MaNamHoc VARCHAR(10),
    MaHocKy VARCHAR(10),
    PRIMARY KEY (MaGiaoVien, MaLop,MaNamHoc,MaHocKy),  -- Khóa chính là sự kết hợp giữa giáo viên và lớp
    FOREIGN KEY (MaGiaoVien) REFERENCES GiaoVien(MaGiaoVien),  -- Tham chiếu đến bảng GiaoVien
    FOREIGN KEY (MaNamHoc) REFERENCES NamHoc(MaNamHoc),
    FOREIGN KEY (MaHocKy) REFERENCES HocKy(MaHocKy),
    FOREIGN KEY (MaLop) REFERENCES Lop(MaLop)                 -- Tham chiếu đến bảng Lop
);

CREATE TABLE HocSinhLopNamHoc (
    MaHocSinh VARCHAR(10),  -- Mã học sinh
    MaLop VARCHAR(10),  -- Mã lớp
    MaNamHoc VARCHAR(10),  -- Mã năm học
    PRIMARY KEY (MaHocSinh, MaLop, MaNamHoc),
    FOREIGN KEY (MaHocSinh) REFERENCES HocSinh(MaHocSinh),  -- Khóa ngoại tới bảng HocSinh
    FOREIGN KEY (MaLop) REFERENCES Lop(MaLop),  -- Khóa ngoại tới bảng Lop
    FOREIGN KEY (MaNamHoc) REFERENCES NamHoc(MaNamHoc)  -- Khóa ngoại tới bảng NamHoc
);

CREATE TABLE TuanHoc (
    MaTuan INT PRIMARY KEY,  -- Mã tuần học (ví dụ: Tuần 1, Tuần 2...)
    TuNgay DATE,  -- Ngày bắt đầu tuần học
    DenNgay DATE  -- Ngày kết thúc tuần học
);

CREATE TABLE DiemDanh (
    MaDiemDanh INT AUTO_INCREMENT PRIMARY KEY,  -- Mã điểm danh
    Ngay DATE NOT NULL,  -- Ngày điểm danh
    TrangThai ENUM('Có mặt', 'Vắng', 'Null') NOT NULL,  -- Trạng thái điểm danh
    MaHocSinh VARCHAR(10),  -- Mã học sinh
    MaLop VARCHAR(10),  -- Mã lớp
    MaHocKy VARCHAR(10),  -- Mã học kỳ
    MaNamHoc VARCHAR(10),  -- Mã năm học
    MaTuan INT,  -- Mã tuần học
    MaMonHoc VARCHAR(10), -- Mã môn học
    MaGiaoVien VARCHAR(10),
    FOREIGN KEY (MaHocSinh) REFERENCES HocSinh(MaHocSinh),  -- Khóa ngoại tới bảng HocSinh
    FOREIGN KEY (MaLop) REFERENCES Lop(MaLop),  -- Khóa ngoại tới bảng Lop
    FOREIGN KEY (MaHocKy) REFERENCES HocKy(MaHocKy),  -- Khóa ngoại tới bảng HocKy
    FOREIGN KEY (MaNamHoc) REFERENCES NamHoc(MaNamHoc),  -- Khóa ngoại tới bảng NamHoc
    FOREIGN KEY (MaTuan) REFERENCES TuanHoc(MaTuan),  -- Khóa ngoại tới bảng TuanHoc
    FOREIGN KEY (MaGiaoVien) REFERENCES GiaoVien(MaGiaoVien),
    FOREIGN KEY (MaMonHoc) REFERENCES MonHoc(MaMonHoc)
);
-- DROP TABLE DiemDanh;

CREATE TABLE TaiKhoan (
    MaTaiKhoan VARCHAR(10) PRIMARY KEY,  -- Mã tài khoản
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,  -- Tên đăng nhập
    MatKhau VARCHAR(255) NOT NULL,  -- Mật khẩu (nên mã hóa mật khẩu)
    LoaiTaiKhoan ENUM('QuanTriVien', 'GiaoVien', 'HocSinh') NOT NULL,  -- Phân quyền tài khoản
    MaAdmin VARCHAR(10),  -- Mã admin (dành cho tài khoản admin)
    MaGiaoVien VARCHAR(10),  -- Mã giáo viên (dành cho tài khoản giáo viên)
    MaHocSinh VARCHAR(10),  -- Mã học sinh (dành cho tài khoản học sinh)
    FOREIGN KEY (MaAdmin) REFERENCES Admin_QL(MaAdmin),  -- Khóa ngoại tới bảng Admin_QL
    FOREIGN KEY (MaGiaoVien) REFERENCES GiaoVien(MaGiaoVien),  -- Khóa ngoại tới bảng GiaoVien
    FOREIGN KEY (MaHocSinh) REFERENCES HocSinh(MaHocSinh)  -- Khóa ngoại tới bảng HocSinh
);
-- DROP TABLE TaiKhoan;

INSERT INTO Lop (MaLop, TenLop) VALUES
('10A1', 'Lớp 10A1'),
('10A2', 'Lớp 10A2'),
('11A1', 'Lớp 11A1'),
('11A2', 'Lớp 11A2'),
('12A1', 'Lớp 12A1'),
('12A2', 'Lớp 12A2');
-- SELECT * FROM Lop;

INSERT INTO HocSinh (MaHocSinh, HoTen, MaLop, NgaySinh, GioiTinh, SoDienThoai, HoTenCha, HoTenMe, QueQuan) 
VALUES 
('HS001', 'Đặng Ngọc Vân Anh', '12A1', '2004-03-04', 'Nữ', '0987010003', 'Đặng Văn Hùng', 'Nguyễn Thị Hồng', 'Huế'),
('HS002', 'Phạm Thị Thùy Anh', '12A1', '2004-10-11', 'Nữ', '0987010033', 'Phạm Văn Huy', 'Nguyễn Thị Phương', 'Đà Nẵng'),
('HS003', 'Trịnh Đình Quốc Bảo', '12A1', '2004-12-25', 'Nam', '0987010047', 'Trịnh Văn Hải', 'Nguyễn Thị Lan', 'Đà Nẵng'),
('HS004', 'Nguyễn Thị Lệ Chi', '12A1', '2004-07-28', 'Nữ', '0987010029', 'Nguyễn Văn Hiếu', 'Nguyễn Thị Hằng', 'Hà Nội'),
('HS005', 'Trần Ngọc Bảo Duy', '12A1', '2004-07-20', 'Nam', '0987010042', 'Trần Văn Quý', 'Nguyễn Thị Hòa', 'Đà Nẵng'),
('HS006', 'Lê Nguyễn Thùy Duyên', '12A1', '2004-05-12', 'Nữ', '0987010019', 'Lê Văn Phúc', 'Nguyễn Thị Hương', 'Hà Nội'),
('HS007', 'Phạm Đình Tấn Đạt', '12A1', '2004-11-03', 'Nam', '0987010031', 'Phạm Văn Hải', 'Nguyễn Thị Lan', 'Hải Phòng'),
('HS008', 'Phí Khánh Hà', '12A1', '2004-08-11', 'Nữ', '0987010048', 'Phí Văn Minh', 'Nguyễn Thị Hoa', 'Hà Nội'),
('HS009', 'Châu Bảo Hân', '12A1', '2004-10-22', 'Nữ', '0987010001', 'Châu Văn Long', 'Lê Thị Hoa', 'Đà Nẵng'),
('HS010', 'Hàng Nhật Hiếu', '12A1', '2004-05-22', 'Nam', '0987010011', 'Hàng Văn Dương', 'Lê Thị Ngọc', 'Đà Nẵng'),

('HS101', 'Nguyễn Thị Lan Anh', '11A1', '2005-01-15', 'Nữ', '0987010010', 'Nguyễn Văn Hoan', 'Lê Thị Hoa', 'Đà Nẵng'),
('HS102', 'Phạm Minh Tuấn', '11A1', '2005-02-10', 'Nam', '0987010011', 'Phạm Văn Thanh', 'Nguyễn Thị Nhung', 'Hải Phòng'),
('HS103', 'Lê Thị Bảo Trâm', '11A1', '2005-03-12', 'Nữ', '0987010012', 'Lê Văn Hồng', 'Nguyễn Thị Vân', 'Hà Nội'),
('HS104', 'Trần Đình Kiên', '11A1', '2005-04-01', 'Nam', '0987010013', 'Trần Văn Đạt', 'Nguyễn Thị Kim', 'Huế'),
('HS105', 'Nguyễn Thị Mỹ Linh', '11A1', '2005-05-09', 'Nữ', '0987010014', 'Nguyễn Hoàng Nam', 'Nguyễn Thị Lan', 'Hà Nội'),
('HS106', 'Lê Quang Hưng', '11A1', '2005-06-11', 'Nam', '0987010015', 'Lê Thanh Bình', 'Nguyễn Thị Bích', 'Đà Nẵng'),
('HS107', 'Trần Phạm Minh Nhật', '11A1', '2005-07-12', 'Nam', '0987010016', 'Trần Hữu Đức', 'Nguyễn Thị Thúy', 'Hải Phòng'),
('HS108', 'Đoàn Phương Hảo', '11A1', '2005-08-19', 'Nữ', '0987010017', 'Đoàn Văn Hùng', 'Nguyễn Thị Thảo', 'Đà Nẵng'),
('HS109', 'Phạm Minh Tâm', '11A1', '2005-09-22', 'Nam', '0987010018', 'Phạm Văn Chí', 'Nguyễn Thị Mai', 'Huế'),
('HS110', 'Nguyễn Thị Mai Lan', '11A1', '2005-10-23', 'Nữ', '0987010019', 'Nguyễn Minh Tâm', 'Nguyễn Thị Thiên', 'Hà Nội'),

('HS201', 'Nguyễn Thị Thanh Hương', '10A1', '2006-01-10', 'Nữ', '0987001001', 'Nguyễn Hoàng Lâm', 'Nguyễn Thị Hồng', 'Hà Nội'),
('HS202', 'Trần Minh Tú', '10A1', '2006-02-14', 'Nữ', '0987001002', 'Trần Phước Bình', 'Nguyễn Thị Lan', 'Đà Nẵng'),
('HS203', 'Lê Đức Thiện', '10A1', '2006-03-20', 'Nam', '0987001003', 'Lê Hùng Kiên', 'Nguyễn Thị Thảo', 'Hải Phòng'),
('HS204', 'Nguyễn Thị Kim Chi', '10A1', '2006-04-22', 'Nữ', '0987001004', 'Nguyễn Minh Tuấn', 'Nguyễn Thị Quỳnh', 'Huế'),
('HS205', 'Phạm Bảo Trân', '10A1', '2006-05-11', 'Nữ', '0987001005', 'Phạm Hữu Thiên', 'Nguyễn Thị Mai', 'Đà Nẵng'),
('HS206', 'Lê Minh Hải', '10A1', '2006-06-01', 'Nam', '0987001006', 'Lê Minh Trí', 'Nguyễn Thị Liên', 'Hải Phòng'),
('HS207', 'Trần Thị Ánh Linh', '10A1', '2006-07-05', 'Nữ', '0987001007', 'Trần Ngọc Hưng', 'Nguyễn Thị Kim', 'Hà Nội'),
('HS208', 'Nguyễn Phước Anh', '10A1', '2006-08-12', 'Nam', '0987001008', 'Nguyễn Quang Sơn', 'Nguyễn Thị Dung', 'Đà Nẵng'),
('HS209', 'Lê Thiên Kim', '10A1', '2006-09-25', 'Nữ', '0987001009', 'Lê Hồng Quân', 'Nguyễn Thị Quế', 'Hải Phòng'),
('HS210', 'Trần Minh Nhật', '10A1', '2006-10-03', 'Nam', '0987001010', 'Trần Minh Thiện', 'Nguyễn Thị Tâm', 'Huế');


INSERT INTO GiaoVien (MaGiaoVien, HoTen, NgaySinh, GioiTinh, MaMonHoc)
VALUES 
('GV001', 'Nguyễn Ngọc Thoại An', '1980-01-15', 'Nữ', 'TOAN'),
('GV002', 'Phạm Thị Bích Việt', '1985-03-22', 'Nữ', 'HOA'),
('GV003', 'Nguyễn Hồ Bảo Trâm', '1982-07-30', 'Nữ', 'ANH');




INSERT INTO Admin_QL (MaAdmin, HoTen, NgaySinh, GioiTinh)
VALUES 
('Admin001', 'Lương Đình Dũng', '1980-05-15', 'Nam');
-- SELECT * FROM Admin_QL;

INSERT INTO HocKy (MaHocKy, TenHocKy)
VALUES 
('HK01', 'Học kỳ 1'),
('HK02', 'Học kỳ 2');
SELECT * FROM HocKy;

INSERT INTO NamHoc (MaNamHoc, TenNamHoc)
VALUES 
('20232024', '2023-2024'),
('20242025', '2024-2025');
-- SELECT * FROM NamHoc;

INSERT INTO LopGiangDay (MaGiaoVien, MaLop, MaNamHoc, MaHocKy)
VALUES
('GV001', '10A1', '20232024', 'HK01'),
('GV001', '10A2', '20232024', 'HK01'),
('GV002', '11A1', '20232024', 'HK01'),
('GV002', '11A2', '20232024', 'HK01'),
('GV003', '12A1', '20232024', 'HK01'),
('GV003', '12A2', '20232024', 'HK01'),
('GV001', '10A1', '20232024', 'HK02'),
('GV001', '10A2', '20232024', 'HK02'),
('GV002', '11A1', '20232024', 'HK02'),
('GV002', '11A2', '20232024', 'HK02'),
('GV003', '12A1', '20232024', 'HK02'),
('GV003', '12A2', '20232024', 'HK02');

-- Dữ liệu tuần học cho Học kỳ 1
INSERT INTO TuanHoc (MaTuan, TuNgay, DenNgay)
VALUES 
(1, '2024-08-26', '2024-09-01'),
(2, '2024-09-02', '2024-09-08'),
(3, '2024-09-09', '2024-09-15'),
(4, '2024-09-16', '2024-09-22'),
(5, '2024-09-23', '2024-09-29'),
(6, '2024-09-30', '2024-10-06'),
(7, '2024-10-07', '2024-10-13'),
(8, '2024-10-14', '2024-10-20'),
(9, '2024-10-21', '2024-10-27'),
(10, '2024-10-28', '2024-11-03'),
(11, '2024-11-04', '2024-11-10'),
(12, '2024-11-11', '2024-11-17'),
(13, '2024-11-18', '2024-11-24'),
(14, '2024-11-25', '2024-12-01'),
(15, '2024-12-02', '2024-12-08'),
(16, '2024-12-09', '2024-12-15'),
(17, '2024-12-16', '2024-12-22'),
(18, '2024-12-23', '2024-12-29');

-- Dữ liệu tuần học cho Học kỳ 2
INSERT INTO TuanHoc (MaTuan, TuNgay, DenNgay)
VALUES 
(19, '2025-01-13', '2025-01-19'),
(20, '2025-01-20', '2025-01-26'),
(21, '2025-01-27', '2025-02-02'),
(22, '2025-02-03', '2025-02-09'),
(23, '2025-02-10', '2025-02-16'),
(24, '2025-02-17', '2025-02-23'),
(25, '2025-02-24', '2025-03-02'),
(26, '2025-03-03', '2025-03-09'),
(27, '2025-03-10', '2025-03-16'),
(28, '2025-03-17', '2025-03-23'),
(29, '2025-03-24', '2025-03-30'),
(30, '2025-03-31', '2025-04-06'),
(31, '2025-04-07', '2025-04-13'),
(32, '2025-04-14', '2025-04-20'),
(33, '2025-04-21', '2025-04-27'),
(34, '2025-04-28', '2025-05-04'),
(35, '2025-05-05', '2025-05-11');

SELECT * FROM TuanHoc;



-- Tuần 1: 2024-10-07 đến 2024-10-13
INSERT INTO DiemDanh (Ngay, TrangThai, MaHocSinh, MaLop, MaHocKy, MaNamHoc, MaTuan, MaMonHoc, MaGiaoVien)
VALUES
-- Ngày 2024-10-07
('2024-10-07', 'Có mặt', 'HS001', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Có mặt', 'HS002', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Vắng', 'HS003', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Có mặt', 'HS004', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Có mặt', 'HS005', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Có mặt', 'HS006', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Có mặt', 'HS007', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Vắng', 'HS008', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Có mặt', 'HS009', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-07', 'Vắng', 'HS010', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
-- Ngày 2024-10-08
('2024-10-08', 'Có mặt', 'HS001', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Có mặt', 'HS002', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Vắng', 'HS003', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Có mặt', 'HS004', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Có mặt', 'HS005', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Có mặt', 'HS006', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Có mặt', 'HS007', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Vắng', 'HS008', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Có mặt', 'HS009', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-08', 'Có mặt', 'HS010', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
-- Ngày 2024-10-09
('2024-10-09', 'Có mặt', 'HS001', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Có mặt', 'HS002', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Vắng', 'HS003', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Có mặt', 'HS004', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Có mặt', 'HS005', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Có mặt', 'HS006', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Có mặt', 'HS007', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Vắng', 'HS008', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Có mặt', 'HS009', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-09', 'Có mặt', 'HS010', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
-- Ngày 2024-10-10
('2024-10-10', 'Có mặt', 'HS001', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Có mặt', 'HS002', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Vắng', 'HS003', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Có mặt', 'HS004', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Có mặt', 'HS005', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Có mặt', 'HS006', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Có mặt', 'HS007', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Vắng', 'HS008', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Có mặt', 'HS009', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
('2024-10-10', 'Có mặt', 'HS010', '12A1', 'HK01', '20232024', 1, 'ANH', 'GV003'),
-- Ngày 2024-10-11
('2024-10-11', 'Có mặt', 'HS001', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Có mặt', 'HS002', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Vắng', 'HS003', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Có mặt', 'HS004', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Có mặt', 'HS005', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Có mặt', 'HS006', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Có mặt', 'HS007', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Vắng', 'HS008', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Có mặt', 'HS009', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-11', 'Có mặt', 'HS010', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),

-- Ngày 2024-10-12
('2024-10-12', 'Có mặt', 'HS001', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Có mặt', 'HS002', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Vắng', 'HS003', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Có mặt', 'HS004', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Có mặt', 'HS005', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Có mặt', 'HS006', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Có mặt', 'HS007', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Vắng', 'HS008', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Có mặt', 'HS009', '12A1', 'HK01', '20232024', 1, 'ANH','GV003'),
('2024-10-12', 'Có mặt', 'HS010', '12A1', 'HK01', '20232024', 1, 'ANH','GV003');


INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaAdmin)
VALUES ('TK001', 'admin123', 'password123', 'QuanTriVien', 'Admin001');

INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaGiaoVien)
VALUES ('TK002', 'gv003', 'teacherpass', 'GiaoVien', 'GV003');

INSERT INTO TaiKhoan (MaTaiKhoan, TenDangNhap, MatKhau, LoaiTaiKhoan, MaHocSinh)
VALUES ('TK003', 'hs001', 'studentpass', 'HocSinh', 'HS001');

-- SELECT * FROM TuanHoc;


SELECT DISTINCT
    MonHoc.TenMonHoc,  -- Tên môn học
    MonHoc.MaMonHoc    -- Mã môn học
FROM DiemDanhs
JOIN HocSinh ON DiemDanh.MaHocSinh = HocSinh.MaHocSinh
JOIN MonHoc ON DiemDanh.MaMonHoc = MonHoc.MaMonHoc
WHERE HocSinh.MaHocSinh = 'HS001';  -- Thay 'HS001' bằng mã học sinh cần tìm


SELECT 
    Lop.MaLop,
    Lop.TenLop
FROM LopGiangDay
JOIN Lop ON LopGiangDay.MaLop = Lop.MaLop
WHERE LopGiangDay.MaGiaoVien = 'GV003'; -- Thay 'GV001' bằng mã giáo viên cần tìm


SELECT * FROM DiemDanh
WHERE MaGiaoVien = "GV003"


SELECT DISTINCT 
    Lop.MaLop, 
    Lop.TenLop 
FROM LopGiangDay
JOIN Lop ON LopGiangDay.MaLop = Lop.MaLop
WHERE LopGiangDay.MaGiaoVien = 'GV001'; -- Thay 'GV003' bằng mã giáo viên cần tìm

SELECT DISTINCT 
    MonHoc.MaMonHoc, 
    MonHoc.TenMonHoc
FROM DiemDanh
JOIN MonHoc ON DiemDanh.MaMonHoc = MonHoc.MaMonHoc
WHERE DiemDanh.MaHocSinh = 'HS001'; 

	SELECT 
		DiemDanh.Ngay AS Ngay,
		CASE DAYOFWEEK(DiemDanh.Ngay)
			WHEN 1 THEN 'Chủ nhật'
			WHEN 2 THEN 'Thứ hai'
			WHEN 3 THEN 'Thứ ba'
			WHEN 4 THEN 'Thứ tư'
			WHEN 5 THEN 'Thứ năm'
			WHEN 6 THEN 'Thứ sáu'
			WHEN 7 THEN 'Thứ bảy'
		END AS Thu,
		DiemDanh.MaLop AS Lop,
		COUNT(CASE WHEN DiemDanh.TrangThai = 'Có mặt' THEN 1 END) AS SoNguoiDiHoc,
		COUNT(CASE WHEN DiemDanh.TrangThai = 'Vắng' THEN 1 END) AS SoNguoiVang
	FROM 
		DiemDanh
	WHERE 
		DiemDanh.MaGiaoVien = 'GV003' -- Thay mã giáo viên tại đây
		AND DiemDanh.MaMonHoc = 'ANH' -- Thay mã môn học tại đây
		AND DiemDanh.MaTuan = 1 -- Thay mã tuần tại đây
		AND DiemDanh.MaLop = '12A1' -- Thay mã môn học tại đây
		AND DiemDanh.MaHocKy = 'HK01' -- Thay mã học kỳ tại đây
		AND DiemDanh.MaNamHoc = '20232024' -- Thay mã năm học tại đây
	GROUP BY 
		DiemDanh.Ngay, DiemDanh.MaLop
	ORDER BY 
		DiemDanh.Ngay ASC;
        
        
        
        SELECT 
    Lop.MaLop AS Lop, 
    Lop.TenLop AS TenLop,
    COUNT(HocSinh.MaHocSinh) AS SiSo
FROM 
    Lop
LEFT JOIN 
    HocSinh ON Lop.MaLop = HocSinh.MaLop
WHERE 
    Lop.MaLop = '12A1' -- Thay mã lớp tại đây
GROUP BY 
    Lop.MaLop, Lop.TenLop;


SELECT 
    DiemDanh.Ngay AS Ngay,
    CASE DAYOFWEEK(DiemDanh.Ngay)
        WHEN 1 THEN 'Chủ nhật'
        WHEN 2 THEN 'Thứ hai'
        WHEN 3 THEN 'Thứ ba'
        WHEN 4 THEN 'Thứ tư'
        WHEN 5 THEN 'Thứ năm'
        WHEN 6 THEN 'Thứ sáu'
        WHEN 7 THEN 'Thứ bảy'
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
    DiemDanh.MaGiaoVien = 'GV003' -- Thay mã giáo viên tại đây
    AND DiemDanh.MaMonHoc = 'ANH' -- Thay mã môn học tại đây
    AND DiemDanh.MaTuan = 1 -- Thay mã tuần tại đây
    AND DiemDanh.MaLop = '12A1' -- Thay mã lớp tại đây
    AND DiemDanh.MaHocKy = 'HK01' -- Thay mã học kỳ tại đây
    AND DiemDanh.MaNamHoc = '20232024' -- Thay mã năm học tại đây
GROUP BY 
    DiemDanh.Ngay, DiemDanh.MaLop
ORDER BY 
    DiemDanh.Ngay ASC;

INSERT INTO DiemDanh (Ngay, TrangThai, MaHocSinh, MaLop, MaHocKy, MaNamHoc, MaTuan, MaMonHoc, MaGiaoVien)
SELECT 
    CURDATE() AS Ngay,            -- Ngày điểm danh là ngày hiện tại
    'Null' AS TrangThai,          -- Trạng thái mặc định là Null
    HS.MaHocSinh,                 -- Mã học sinh
    HS.MaLop,                     -- Mã lớp
    LGD.MaHocKy,                  -- Mã học kỳ
    LGD.MaNamHoc,                 -- Mã năm học
    TH.MaTuan,                    -- Mã tuần học
    GV.MaMonHoc,                  -- Mã môn học
    LGD.MaGiaoVien                -- Mã giáo viên
FROM 
    HocSinh HS
JOIN LopGiangDay LGD ON HS.MaLop = LGD.MaLop
JOIN GiaoVien GV ON LGD.MaGiaoVien = GV.MaGiaoVien
JOIN TuanHoc TH ON CURDATE() BETWEEN TH.TuNgay AND TH.DenNgay; -- Tìm tuần hiện tại
SELECT*FROM TaiKhoan
Where MaHocSinh = 'HS001'


