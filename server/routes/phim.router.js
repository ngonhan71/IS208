const express = require('express')
const router = express.Router()

const phimController = require('../controllers/phim.controller')
const { verifyToken, checkRole, roleEnum } = require('../middleware/auth')

router.get("/dangchieu-sapchieu", phimController.getAllDangChieuAndSapChieu)
router.get("/count", phimController.getCount)
router.get("/", phimController.getAll)
router.get("/:id/theloai", phimController.getTheLoaiByMaPhim)
router.get("/:id", phimController.getById)
router.post("/", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), phimController.create)
router.put("/:maPhim", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), phimController.update)
// router.delete("/:id", phimController.delete)

module.exports = router