const upload = require("../../middleware/upload");
const express = require("express");
const router = express.Router();

router.post("/image", upload.single("file"), async (req, res) => {
  if (req.file === undefined) return res.send("you must select a file.");
  const imgUrl = `http://localhost:3301/api/sanpham/image/${req.file.filename}`;
  return res.send(imgUrl);
});

module.exports = router;
