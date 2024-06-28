const express = require("express");
const control = require("./loaisanpham.controller");
const router = express.Router();

router.post("/add", control.create);

router.get("/", control.getAll);

// router.get("/all", control.getAll);

router.get("/list", control.getListLoaiSP);

router.get("/get/:maLoaiSanPham", control.getLoaiSanPham);

router.put("/update/:maLoaiSanPhamOld", control.update);

router.delete("/delete/:maLoaiSanPham", control.remove);

// router.post("/uploadimage", control.uploadSingleImage);

module.exports = router;
