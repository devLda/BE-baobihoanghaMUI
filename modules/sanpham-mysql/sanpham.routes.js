const express = require("express");
const control = require("./sanpham.controller");
const router = express.Router();

// const { isAdmin, verifyAccessToken } = require("../../middleware/verifyToken");

// router.post("/add", [verifyAccessToken, isAdmin], control.create);
router.post("/add", control.create);

router.get("/", control.findAll);

router.get("/getbyloai", control.findLoai);

router.get("/get/:maSanPham", control.findOne);

router.put("/update/:maSanPham", control.update);

router.delete("/delete/:maSanPham", control.delete);

module.exports = router;
