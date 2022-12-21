const express = require('express')
const router = express.Router()

const suatchieuController = require('../controllers/suatchieu.controller')

const { verifyToken, checkRole, roleEnum } = require('../middleware/auth')

router.get("/phim-rapchieu", suatchieuController.getAllByPhimAndRapChieu)
router.get("/phim", suatchieuController.getAllByPhim)
router.get("/phongchieu-ngaychieu", suatchieuController.getByMaPhongChieuAndNgayChieu)
router.get("/chart/count", suatchieuController.getCountLifeTime)
router.get("/", suatchieuController.getAll)
router.get("/:id/mobile", suatchieuController.getByIdMobile)
router.get("/:id", suatchieuController.getById)
router.post("/", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), suatchieuController.create)
router.put("/:id", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), suatchieuController.update)
router.delete("/:id", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), suatchieuController.delete)

module.exports = router