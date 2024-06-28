const express = require("express");
const control = require("./loaisanpham.controller");
const router = express.Router();

router.get("/get/:maLoaiSanPham", control.findOne);

router.put("/update/:maLoaiSanPhamOld", control.update);

router.delete("/delete/:maLoaiSanPham", control.delete);

router.post("/add", control.create);

router.get("/", control.findAll);

module.exports = router;
