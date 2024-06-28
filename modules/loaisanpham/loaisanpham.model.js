const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const loaiSanPhamSchema = new mongoose.Schema(
  {
    maLoaiSanPham: {
      type: String,
      required: true,
    },
    tenLoaiSanPham: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

loaiSanPhamSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("loaiSanPham", loaiSanPhamSchema);
