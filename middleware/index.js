const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
//upload file
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./filesUpload");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// remove img
const fs = require("fs");
const hinhAnh = require("../hinhanh.model.js");

const globalMiddelwares = (app, dir) => {
  app.use("/public", express.static(path.join(dir, "public")));

  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });
  
  app.use(
    cors({
      origin: true,
      methods: ["POST", "PUT", "GET", "DELETE"],
      credentials: true,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cookieParser());

  app.post("/be/api/file/upload-file", upload.single("file"), async (req, res) => {
    const maSanPham = req.body.maSanPham;
    const url = process.env.URL_SERVER + "/filesupload/" + req.file.filename;

    const hinhanh = new hinhAnh({
      mahinhAnh: req.file.filename,
      maSanPham: maSanPham,
      url: url,
    });

    hinhAnh.create(hinhanh, (err, data) => {
      if (err)
        res.status(500).json({
          success: false,
          data: err.message || "Có lỗi xảy ra khi tải ảnh lên.",
        });
      else
        res.status(200).json({
          success: true,
          data: "Tải ảnh thành công",
        });
    });
  });

  app.use("/be/filesupload", express.static("filesUpload"));

  app.delete("/be/filesupload/delete/:filename", (req, res) => {
    const fileName = req.params.filename;
    const directoryPath = dir + "/filesUpload/";
    const timeFile = fileName.split("-")[0];

    let status = 200;
    let messErr = "";

    fs.unlink(directoryPath + fileName, (err) => {
      if (err) {
        status = 500;
        messErr = "Không thể xoá file. " + err;
      }

      hinhAnh.remove(timeFile, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            status = 404;
            messErr = `Không tìm thấy ảnh với mã ${fileName}.`;
          } else {
            status = 500;
            messErr = "Đã xảy ra lỗi khi xóa ảnh với mã " + fileName;
          }
        } else messErr = `Ảnh đã được xóa thành công!`;
      });
    });

    return res.status(status).json({
      success: status === 200 ? true : false,
      data: messErr,
    });
  });

  app.delete("/be/filesupload/deletebyma/:maSanPham", (req, res) => {
    const { maSanPham } = req.params;
    console.log("delete(): ", maSanPham);
    const directoryPath = dir + "/filesUpload/";

    const listDelete = [];

    let status = 200;
    let messErr = "";

    function deleteFiles(files, callback) {
      var i = files.length;
      files.forEach(function (filepath) {
        fs.unlink(filepath, function (err) {
          i--;
          if (err) {
            callback(err);
            return;
          } else if (i < 0) {
            callback(null);
          }
        });
      });
    }

    hinhAnh.getHinhAnhOfSanPham(maSanPham, (err, dataImg) => {
      if (err) {
        console.log("err ", err);

        status = 500;
        messErr = err.message || "Đã có lỗi xảy ra khi truy vấn sản phẩm.";

        return;
      } else {
        if (dataImg?.length) {
          for (let index = 0; index < dataImg.length; index++) {
            const element = dataImg[index];
            console.log("dir ", directoryPath);
            listDelete.push(directoryPath + element.url.split("/")[4]);
          }

          if (listDelete.length)
            deleteFiles(listDelete, function (err) {
              if (err)

                status = 500;
              messErr = err.message || "Đã có lỗi xảy ra khi xoá.";
            });
        }
      }
    });

    hinhAnh.removeHinhAnhOfSanPham(maSanPham, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {

          status = 404;
          messErr = `Không tìm thấy ảnh với mã ${maSanPham}.`;
        } else {
          status = 500;
          messErr = "Đã xảy ra lỗi khi xóa ảnh với mã " + maSanPham;
        }
      }
    });

    return res.status(status).json({
      success: status === 200 ? true : false,
      data: messErr,
    });
  });

  app.use("/be/api/loaisanpham", require("../modules/loaisanpham-mysql"));
  app.use("/be/api/sanpham", require("../modules/sanpham-mysql"));
};

module.exports = globalMiddelwares;
