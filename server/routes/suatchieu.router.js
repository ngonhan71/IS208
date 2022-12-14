const express = require('express')
const router = express.Router()

const suatchieuController = require('../controllers/suatchieu.controller')

router.get("/phim-rapchieu", suatchieuController.getAllByPhimAndRapChieu)
router.get("/phim", suatchieuController.getAllByPhim)
router.get("/phongchieu-ngaychieu", suatchieuController.getByMaPhongChieuAndNgayChieu)
router.get("/chart/count", suatchieuController.getCountLifeTime)
router.get("/", suatchieuController.getAll)
router.get("/:id/mobile", suatchieuController.getByIdMobile)
router.get("/:id", suatchieuController.getById)
router.post("/", suatchieuController.create)
router.put("/:id", suatchieuController.update)
router.delete("/:id", suatchieuController.delete)

module.exports = router