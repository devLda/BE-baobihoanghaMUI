const sql = require("../../database/index");

// constructor
const LoaiSanPham = function (loaisanpham) {
  this.maLoaiSanPham = loaisanpham.maLoaiSanPham;
  this.tenLoaiSanPham = loaisanpham.tenLoaiSanPham;
};

LoaiSanPham.create = (newLoaiSanPham, result) => {
  sql.query("INSERT INTO loaisanpham SET ?", newLoaiSanPham, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created loaisanpham: ", {
      id: res.insertId,
      ...newLoaiSanPham,
    });
    result(null, { id: res.insertId, ...newLoaiSanPham });
  });
};

LoaiSanPham.findByMa = (maLoaiSanPham, result) => {
  sql.query(
    `SELECT * FROM loaisanpham WHERE maLoaiSanPham = '${maLoaiSanPham}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found loaisanpham: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found LoaiSanPham with the id
      result({ kind: "not_found" }, null);
    }
  );
};

LoaiSanPham.getAll = (maLoaiSanPham, result) => {
  let query = "SELECT * FROM loaisanpham";

  if (maLoaiSanPham) {
    query += ` WHERE maLoaiSanPham LIKE '%${maLoaiSanPham}%'`;
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

LoaiSanPham.updateByMa = (maLoaiSanPham, loaisanpham, result) => {
  sql.query(
    "UPDATE loaisanpham SET maLoaiSanPham = ?, tenLoaiSanPham = ? WHERE maLoaiSanPham = ?",
    [maLoaiSanPham, loaisanpham.tenLoaiSanPham, maLoaiSanPham],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found LoaiSanPham with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated loaisanpham: ", {
        maLoaiSanPham: maLoaiSanPham,
        ...loaisanpham,
      });
      result(null, { maLoaiSanPham: maLoaiSanPham, ...loaisanpham });
    }
  );
};

LoaiSanPham.remove = (maLoaiSanPham, result) => {
  sql.query(
    "DELETE FROM loaisanpham WHERE maLoaiSanPham = ?",
    maLoaiSanPham,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found LoaiSanPham with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted loaisanpham with ma: ", maLoaiSanPham);
      result(null, res);
    }
  );
};

module.exports = LoaiSanPham;
