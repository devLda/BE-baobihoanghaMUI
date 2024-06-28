const sql = require("../../database/index");

// constructor
const SanPham = function (sanpham) {
  this.maSanPham = sanpham.maSanPham;
  this.maLoaiSanPham = sanpham.maLoaiSanPham;
  this.tenSanPham = sanpham.tenSanPham;
  this.moTa = sanpham.moTa;
};

SanPham.create = (newSanPham, result) => {
  sql.query("INSERT INTO sanpham SET ?", newSanPham, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { maSanPham: res.maSanPham, ...newSanPham });
  });
};

SanPham.getAll = (maSanPham, result) => {
  let query =
    "SELECT * FROM sanpham JOIN loaisanpham ON sanpham.maLoaiSanPham = loaisanpham.maLoaiSanPham ";

  if (maSanPham) {
    query += ` WHERE maSanPham LIKE '%${maSanPham}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

SanPham.findByLoaiSP = (maLoaiSanPham, result) => {
  sql.query(
    `SELECT * FROM sanpham JOIN loaisanpham ON sanpham.maLoaiSanPham = loaisanpham.maLoaiSanPham WHERE sanpham.maLoaiSanPham = '${maLoaiSanPham}'`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      // not found LoaiSanPham with the id
      result({ kind: "not_found" }, null);
    }
  );
};

SanPham.findByMa = (maSanPham, result) => {
  sql.query(
    `SELECT * FROM sanpham JOIN loaisanpham ON sanpham.maLoaiSanPham = loaisanpham.maLoaiSanPham JOIN hinhanh ON sanpham.maSanPham = hinhanh.maSanPham WHERE sanpham.maSanPham = '${maSanPham}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found LoaiSanPham with the id
      result({ kind: "not_found" }, null);
    }
  );
};

SanPham.updateByMa = (maSanPham, sanpham, result) => {
  sql.query(
    "UPDATE sanpham SET maSanPham = ?, maLoaiSanPham = ?, tenSanPham = ?, moTa = ? WHERE maSanPham = ?",
    [
      maSanPham,
      sanpham.maLoaiSanPham,
      sanpham.tenSanPham,
      sanpham.moTa,
      maSanPham,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found SanPham with the maSanPham
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { maSanPham: maSanPham, ...sanpham });
    }
  );
};

SanPham.remove = (maSanPham, result) => {
  sql.query(
    "DELETE FROM sanpham WHERE maSanPham = ?",
    maSanPham,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found SanPham with the maSanPham
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

module.exports = SanPham;
