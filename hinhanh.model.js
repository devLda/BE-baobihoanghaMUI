const sql = require("./database/index");

const hinhAnh = function (hinhanh) {
  this.mahinhAnh = hinhanh.mahinhAnh;
  this.maSanPham = hinhanh.maSanPham;
  this.url = hinhanh.url;
};

hinhAnh.create = (newhinhAnh, result) => {
  sql.query("INSERT INTO hinhanh SET ?", newhinhAnh, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { mahinhAnh: res.mahinhAnh, ...newhinhAnh });
  });
};

hinhAnh.getHinhAnhOfSanPham = (maSanPham, result) => {
  let query = `SELECT * FROM sanpham JOIN hinhanh ON hinhanh.maSanPham = sanpham.maSanPham where sanpham.maSanPham = '${maSanPham}'`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

hinhAnh.remove = (mahinhAnh, result) => {
  console.log('maHinhAnh', mahinhAnh)
  sql.query(
    `DELETE FROM hinhanh WHERE mahinhAnh LIKE '%${mahinhAnh}%'`,
    mahinhAnh,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found hinhAnh with the mahinhAnh
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, res);
    }
  );
};

hinhAnh.removeHinhAnhOfSanPham = (maSanPham, result) => {
  let query = `DELETE FROM hinhanh where maSanPham = '${maSanPham}'`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found hinhAnh with the mahinhAnh
      result({ kind: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

module.exports = hinhAnh;
