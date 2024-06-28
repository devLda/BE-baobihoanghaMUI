const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const sanPhamSchema = new mongoose.Schema(
  {
    maSanPham: {
      type: String,
      required: true,
    },
    loaiSanPham: {
      type: mongoose.Types.ObjectId,
      ref: "loaiSanPham",
    },
    tenSanPham: {
      type: String,
      required: true,
    },
    hinhAnh: {
      type: Array,
    },
    moTa: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

sanPhamSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("sanPham", sanPhamSchema);
