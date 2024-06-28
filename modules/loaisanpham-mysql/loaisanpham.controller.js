const LoaiSanPham = require("./loaisanpham.model.js");

// Create and Save a new LoaiSanPham
exports.create = (req, res) => {
  // Validate request
  const { maLoaiSanPham, tenLoaiSanPham } = req.body;

  if (!maLoaiSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập mã loại sản phẩm",
    });

  if (!tenLoaiSanPham)
    return res.status(500).json({
      data: "Vui lòng nhập tên loại sản phẩm",
    });

  LoaiSanPham.findByMa(maLoaiSanPham, (err, data) => {
    if (data?.length) {
      return res.status(403).json({ data: "Loại sản phẩm đã tồn tại" });
    }
  });

  // Create a LoaiSanPham
  const loaisanpham = new LoaiSanPham({
    maLoaiSanPham: maLoaiSanPham,
    tenLoaiSanPham: tenLoaiSanPham,
  });

  // Save LoaiSanPham in the database
  LoaiSanPham.create(loaisanpham, (err, data) => {
    if (err)
      res.status(500).json({
        success: false,
        data: err || "Đã xảy ra lỗi khi tạo Loại sản phẩm.",
      });
    else
      res.status(200).json({
        success: true,
        data: data,
      });
  });
};

// Retrieve all LoaiSanPhams from the database (with condition).
exports.findAll = (req, res) => {
  LoaiSanPham.getAll(null, (err, data) => {
    if (err) {
      console.log("err ", err);
      res.status(500).json({
        success: false,
        data: err || "Đã xảy ra lỗi khi lấy dữ liệu về loại sản phẩm",
      });
    } else
      res.status(200).json({
        success: true,
        data: data,
      });
  });
  // res.status(200).json({
  //   mes: "get all runing",
  // });
};

// Find a single LoaiSanPham with a id
exports.findOne = (req, res) => {
  const { maLoaiSanPham } = req.params;

  if (!maLoaiSanPham) {
    return res.status(500).json({
      success: false,
      data: "Thiếu trường mã loại sản phẩm",
    });
  }
  LoaiSanPham.findByMa(maLoaiSanPham, (err, data) => {
    if (err) {
      console.log("err ", err);
      res.status(500).json({
        success: false,
        data: err || "Đã xảy ra lỗi khi truy vấn đến loại sản phẩm",
      });
    } else
      res.status(200).json({
        success: true,
        data: data,
      });
  });
};

// Update a LoaiSanPham identified by the id in the request
exports.update = (req, res) => {
  const { maLoaiSanPhamOld } = req.params;
  const { tenLoaiSanPham } = req.body;

  if (!tenLoaiSanPham)
    return res.status(500).json({
      success: false,
      data: "Thiếu trường tên loại sản phẩm",
    });

  LoaiSanPham.updateByMa(
    maLoaiSanPhamOld,
    new LoaiSanPham({
      maLoaiSanPham: maLoaiSanPhamOld,
      tenLoaiSanPham: tenLoaiSanPham,
    }),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).json({
            success: false,
            data: `Không tìm thấy loại sản phẩm với mã ${maLoaiSanPhamOld}.`,
          });
        } else {
          res.status(500).json({
            success: false,
            data:
              err,
          });
        }
      } else
        res.status(200).json({
          success: true,
          data: data,
        });
    }
  );
};

// Delete a LoaiSanPham with the specified id in the request
exports.delete = (req, res) => {
  const { maLoaiSanPham } = req.params;
  LoaiSanPham.remove(maLoaiSanPham, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          success: false,
          data: `Không tìm thấy loại sản phẩm với mã ${maLoaiSanPham}.`,
        });
      } else {
        res.status(500).json({
          success: false,
          data: err,
        });
      }
    } else
      res.status(200).json({
        success: true,
        data: `Loại sản phẩm đã được xóa thành công!`,
      });
  });
};
