const express = require("express");
const control = require("./sanpham.controller");
// const upload = require("./upload");
const router = express.Router();

router.post("/add", control.create);

router.get("/", control.getAll);

// router.get("/multi/:pid", control.getMultiDataSanPham);

// router.get("/multisanpham", control.getMultiAllData);

// router.get("/get/:id", control.getById);

router.get("/get/:maSanPham", control.getSanPham);

router.put("/update/:maSanPham", control.update);

router.delete("/delete/:maSanPham", control.remove);

// router.post("/image", upload);

module.exports = router;
