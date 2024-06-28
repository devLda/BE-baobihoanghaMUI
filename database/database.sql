CREATE DATABASE IF NOT EXISTS baobihoangha_db;


CREATE TABLE `LOAISANPHAM` (
 `maLoaiSanPham` VARCHAR(20) NOT NULL,
 `tenLoaiSanPham` varchar(200) NOT NULL,
 `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(`maLoaiSanPham`)
)

CREATE TABLE `SANPHAM` (
 `maSanPham` VARCHAR(20) NOT NULL,
 `maLoaiSanPham` VARCHAR(20) NOT NULL,
 `tenSanPham` varchar(200) NOT NULL,
 `moTa` varchar(200) NULL,
 `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(`maSanPham`),
 CONSTRAINT FK_loaisanpham_sanpham FOREIGN KEY (maLoaiSanPham)
 REFERENCES LOAISANPHAM(maLoaiSanPham)
)

CREATE TABLE `HINHANH` (
 `maHinhAnh` VARCHAR(20) NOT NULL,
 `maSanPham` VARCHAR(20) NOT NULL,
 `url` VARCHAR(200) NOT NULL,
 `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(`maHinhAnh`),
 CONSTRAINT FK_sanpham_hinhanh
 FOREIGN KEY (maSanPham)
 REFERENCES SANPHAM(maSanPham)
)