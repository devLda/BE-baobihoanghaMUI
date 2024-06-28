const sanPham = require("./sanpham.model");
const fs = require("fs");
const loaiSanPham = require("../loaisanpham/loaisanpham.model");
const asyncHandler = require("express-async-handler");
const axios = require("axios");

const create = asyncHandler(async (req, res) => {
  const { maSanPham, tenSanPham } = req.body;

  if (!maSanPham || !loaiSanPham || !tenSanPham)
    return res.status(400).json({
      success: false,
      mes: "Thiếu trường dữ liệu",
    });

  const loaiSP = await loaiSanPham.findOne({
    maLoaiSanPham: req.body.loaiSanPham,
  });

  const findSP = await sanPham.findOne({
    maSanPham: maSanPham,
  });

  if (!loaiSP)
    return res.status(404).json({ mes: "Loại sản phẩm không tồn tại" });
  if (findSP) return res.status(403).json({ mes: "Mã sản phẩm đã tồn tại" });
  const newSP = {
    maSanPham: maSanPham,
    tenSanPham: tenSanPham,
    loaiSanPham: loaiSP._id,
    hinhAnh: [],
  };
  const newSanPham = await sanPham.create(newSP);
  return res.status(200).json({
    success: newSanPham ? true : false,
    data: newSanPham ? newSanPham : "Đã xảy ra lỗi!!!",
  });
});

const getAll = asyncHandler(async (req, res) => {
  let query = req.query || {};
  const result = await sanPham
    .find(query)
    .populate("loaiSanPham", "maLoaiSanPham tenLoaiSanPham");
  let sanPhamFilter = null;
  if (query?.maLoaiSanPham)
    sanPhamFilter = result.filter(
      (res) => res.loaiSanPham.maLoaiSanPham === query.maLoaiSanPham
    );
  else sanPhamFilter = result;
  return res.status(200).json({
    success: sanPhamFilter ? true : false,
    data: sanPhamFilter ? sanPhamFilter : "Đã xảy ra lỗi",
  });
});

const getSanPham = asyncHandler(async (req, res) => {
  const { maSanPham } = req.params;
  if (!maSanPham) throw new Error("Không tìm thấy sản phẩm!!!");
  const result = await sanPham
    .findOne({ maSanPham: maSanPham })
    .populate("loaiSanPham", "maLoaiSanPham tenLoaiSanPham");

  return res.status(200).json({
    success: result ? true : false,
    data: result ? result : "Đã xảy ra lỗi",
  });
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Không tìm thấy sản phẩm!!!");
  const result = await sanPham
    .findById(id)
    .populate("loaiSanPham", "maLoaiSanPham tenLoaiSanPham");

  return res.status(200).json({
    success: result ? true : false,
    data: result ? result : "Đã xảy ra lỗi",
  });
});

const update = asyncHandler(async (req, res) => {
  const { maSanPham } = req.params;

  const { tenSanPham } = req.body;

  if (!req.body.loaiSanPham || !maSanPham || !tenSanPham)
    return res.status(400).json({
      success: false,
      mes: "Thiếu trường dữ liệu",
    });

  const loaiSP = await loaiSanPham.findOne({
    maLoaiSanPham: req.body.loaiSanPham,
  });

  if (!loaiSP) throw new Error("Loại sản phẩm không tồn tại");

  const sanPhamUpdate = req.body;
  sanPhamUpdate.loaiSanPham = loaiSP._id;
  const response = await sanPham.findOneAndUpdate(
    { maSanPha: maSanPham },
    sanPhamUpdate,
    {
      new: true,
    }
  );

  if (response)
    return res.status(200).json({
      success: true,
      data: response,
    });
  else
    return res.status(500).json({
      success: false,
      data: "Không thể cập nhật",
    });
});

const remove = asyncHandler(async (req, res) => {
  const { maSanPham } = req.params;

  if (!maSanPham) throw new Error("Không tìm thấy sản phẩm");

  const findSanPham = await sanPham.findOne({ maSanPham: maSanPham });
  for (let index = 0; index < findSanPham.hinhAnh.length; index++) {
    const element = findSanPham.hinhAnh[index];
    const filename = element.split("/")[4];
    try {
      await axios.delete(
        `${process.env.URL_SERVER}/filesupload/delete/${filename}`
      ); // Doesn't require server remote url as it is relative
    } catch (err) {
      return res.status(500).send({
        mes: "Đã xảy ra lỗi khi xóa ảnh. " + err,
      });
    }
  }

  const result = await findSanPham.delete();

  if (result)
    return res.status(200).json({
      success: true,
      mes: "Xoá sản phẩm thành công",
    });
  else
    return res.status(500).json({
      success: false,
      mes: "Đã xảy ra lỗi!!!",
    });
});

module.exports = {
  create,
  getAll,
  getSanPham,
  getById,
  update,
  remove,
};
