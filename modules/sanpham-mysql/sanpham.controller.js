const SanPham = require("./sanpham.model.js");
const HinhAnh = require("../../hinhanh.model.js");
const axios = require("axios");
// Create and Save a new SanPham
exports.create = (req, res) => {
  const { maSanPham, maLoaiSanPham, tenSanPham, moTa } = req.body;
  // Validate request
  if (!maSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập mã loại sản phẩm",
    });

  if (!maLoaiSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập mã loại sản phẩm",
    });

  if (!tenSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập tên sản phẩm",
    });

  // Create a SanPham
  const sanpham = new SanPham({
    maSanPham: maSanPham,
    maLoaiSanPham: maLoaiSanPham,
    tenSanPham: tenSanPham,
    moTa: moTa,
  });

  // Save SanPham in the database
  SanPham.create(sanpham, (err, data) => {
    if (err)
      res.status(500).json({
        success: false,
        data: err || "Có lỗi xảy ra khi sản phẩm.",
      });
    else
      res.status(200).json({
        success: true,
        data: data,
      });
  });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
  SanPham.getAll(null, (err, data) => {
    if (err) {
      console.log("err ", err);
      return res.status(500).json({
        success: false,
        data: err || "Đã có lỗi xảy ra khi truy vấn sản phẩm.",
      });
    } else {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        HinhAnh.getHinhAnhOfSanPham(element.maSanPham, (err, dataImg) => {
          if (err) {
            console.log("err ", err);
            return res.status(500).json({
              success: false,
              data: err || "Đã có lỗi xảy ra khi truy vấn sản phẩm.",
            });
          } else {
            if (dataImg?.length)
              element.hinhAnh = dataImg?.map((item) => item.url);

            if (index === data.length - 1) {
              return res.status(200).json({
                success: true,
                data: data,
              });
            }
          }
        });
      }
    }
  });
  // res.status(200).json({
  //   mes: "get all runing",
  // });
};

exports.findLoai = (req, res) => {
  const { maLoaiSanPham } = req.query;

  if (!maLoaiSanPham)
    return res.status(500).json({
      success: false,
      data: "Thiếu trường mã loại sản phẩm",
    });

  let status = 200;
  let mess = null;

  SanPham.findByLoaiSP(maLoaiSanPham, (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err || "Đã xảy ra lỗi khi truy vấn đến sản phẩm",
      });
    } else {
      HinhAnh.getHinhAnhOfSanPham(data.maSanPham, (err, dataImg) => {
        if (err) {
          status = 500;
          mess = err || "Đã xảy ra lỗi khi truy vấn đến sản phẩm";
        } else {
          if (dataImg?.length) data.hinhAnh = dataImg?.map((item) => item.url);
          mess = data;
        }

        return res.status(status).json({
          success: status === 200,
          data: mess,
        });
      });
    }
  });
};

// Find a single Tutorial with a id
exports.findOne = (req, res) => {
  const { maSanPham } = req.params;

  console.log("zo ", maSanPham);

  if (!maSanPham)
    return res.status(500).json({
      success: false,
      data: "Thiếu trường mã sản phẩm",
    });

  let status = 200;
  let mess = null;

  SanPham.findByMa(maSanPham, (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        data: err || "Đã xảy ra lỗi khi truy vấn đến sản phẩm",
      });
    } else {
      HinhAnh.getHinhAnhOfSanPham(maSanPham, (err, dataImg) => {
        if (err) {
          status = 500;
          mess = err || "Đã xảy ra lỗi khi truy vấn đến sản phẩm";
        } else {
          if (dataImg?.length) data.hinhAnh = dataImg?.map((item) => item.url);
          mess = data;
        }

        return res.status(status).json({
          success: status === 200,
          data: mess,
        });
      });
    }
  });
};

// Update a Tutorial identified by the id in the request
exports.update = (req, res) => {
  const { maSanPham, maLoaiSanPham, tenSanPham, moTa } = req.body;
  // Validate request

  if (!maSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập mã loại sản phẩm",
    });

  if (!maLoaiSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập mã loại sản phẩm",
    });

  if (!tenSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập tên sản phẩm",
    });

  let status = 200;
  let mess = null;

  SanPham.updateByMa(
    maSanPham,
    new SanPham({
      maSanPham: maSanPham,
      maLoaiSanPham: maLoaiSanPham,
      tenSanPham: tenSanPham,
      moTa: moTa,
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          status = 404;
          mess = `Không tìm thấy sản phẩm với mã ${maSanPham}.`;
        } else {
          status = 500;
          mess = "Đã xảy ra lỗi khi cập nhật loại sản phẩm với mã " + maSanPham;
        }
      } else mess = data;
      return res.status(status).json({
        success: status === 200,
        data: mess,
      });
    }
  );
};

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
  const { maSanPham } = req.params;

  try {
    await axios.delete(
      `${process.env.URL_SERVER}/filesupload/deletebyma/${maSanPham}`
    ); // Doesn't require server remote url as it is relative
  } catch (err) {
    return res.status(500).send({
      data: "Đã xảy ra lỗi khi xóa ảnh. " + err,
    });
  }

  let status = 200;
  let mess = null;

  SanPham.remove(maSanPham, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        status = 404;
        mess = `Không tìm thấy sản phẩm với mã ${maSanPham}.`;
      } else {
        status = 500;
        mess = "Đã xảy ra lỗi khi xóa sản phẩm với mã " + maSanPham;
      }
    } else mess = `Sản phẩm đã được xóa thành công!`;
    res.status(status).json({
      success: status === 200,
      data: mess,
    });
  });
};
