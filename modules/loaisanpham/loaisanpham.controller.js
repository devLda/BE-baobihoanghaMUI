const loaiSanPham = require("./loaisanpham.model");
const sanPham = require("../sanpham/sanpham.model");
const asyncHandler = require("express-async-handler");
const sanPhamModel = require("../sanpham/sanpham.model");

const create = asyncHandler(async (req, res) => {
  const { maLoaiSanPham, tenLoaiSanPham } = req.body;

  if (!maLoaiSanPham || !tenLoaiSanPham)
    return res.status(500).json({
      data: req.body,
    });
  // throw new Error("Thiếu trường dữ liệu");

  const item = await loaiSanPham.findOne({ maLoaiSanPham });

  if (item) throw new Error("Loại sản phẩm đã tồn tại");
  else {
    const newLoai = await loaiSanPham.create(req.body);
    return res.status(200).json({
      success: newLoai ? true : false,
      data: newLoai ? newLoai : "Đã xảy ra lỗi",
    });
  }
});

const getAll = asyncHandler(async (req, res) => {
  let query = req.query || {};
  const result = await loaiSanPham.find(query);

  if (result)
    return res.status(200).json({
      success: true,
      data: result,
    });
  else
    return res.status(500).json({
      success: false,
      data: null,
    });
});

const getLoaiSanPham = asyncHandler(async (req, res) => {
  const { maLoaiSanPham } = req.params;

  if (!maLoaiSanPham) throw new Error("Thiếu trường dữ liệu");

  const result = await loaiSanPham.findOne({ maLoaiSanPham });
  return res.status(200).json({
    success: result ? true : false,
    data: result ? result : "Đã xảy ra lỗi",
  });
});

const getListLoaiSP = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sortField, sortOrder } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: {},
  };

  if (sortField && sortOrder) {
    options.sort = {
      [sortField]: sortOrder,
    };
  }

  const result = await loaiSanPham.paginate({}, options);
  return res.status(200).json({
    success: result ? true : false,
    data: result ? result : "Đã xảy ra lỗi",
  });
});

const update = asyncHandler(async (req, res) => {
  const { maLoaiSanPhamOld } = req.params;
  const { maLoaiSanPham, tenLoaiSanPham } = req.body;

  if (!maLoaiSanPham || !tenLoaiSanPham)
    throw new Error("Không tìm thấy loại phòng!");

  const response = await loaiSanPham.findOneAndUpdate(
    { maLoaiSanPham: maLoaiSanPhamOld },
    req.body,
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Đã xảy ra lỗi",
  });
});

const remove = asyncHandler(async (req, res) => {
  const { maLoaiSanPham } = req.params;

  const findLoaiSP = await loaiSanPham.findOne({
    maLoaiSanPham: maLoaiSanPham,
  });

  const findSanPham = await sanPham.findOne({
    loaiSanPham: findLoaiSP._id,
  });
  if (findSanPham) {
    return res.status(403).json({
      success: false,
      mes: "Không thể xoá vì có sản phẩm đang thuộc loại này.",
    });
  }

  const result = await loaiSanPham.findOneAndDelete({
    maLoaiSanPham: maLoaiSanPham,
  });
  return res.status(200).json({
    success: result ? true : false,
    mes: result ? "Xoá loại sản phẩm thành công" : "Đã có lỗi xảy ra",
  });
});

module.exports = {
  create,
  getAll,
  getLoaiSanPham,
  getListLoaiSP,
  update,
  remove,
};
