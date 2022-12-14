const express = require('express')
const router = express.Router()


const hoadonController = require('../controllers/hoadon.controller')

router.get("/nguoidung/:maNguoiDung", hoadonController.getAllByUserId)
router.get("/chart/revenue", hoadonController.getRevenueLifeTime)
router.get("/chart/count", hoadonController.getCountLifeTime)
router.get("/chart/phim-ban-chay", hoadonController.getPhimBanChay)
router.get("/chart/rapchieu-ban-chay", hoadonController.getRapChieuBanChay)
router.get("/revenue", hoadonController.getRevenue)
router.get("/count", hoadonController.getCount)
router.get("/", hoadonController.getAll)
router.get("/:id", hoadonController.getById)
router.get("/thanhtoan/momo", hoadonController.getPayUrlMoMo)

router.post("/thanhtoan/momo/verify", hoadonController.verifyMoMo)
router.post("/thanhtoan/momo", hoadonController.getPayUrlMoMoPOST)
router.post("/", hoadonController.create)
router.put("/:id/ma-thanhtoan", hoadonController.updateMaThanhToan)
// router.delete("/:id", gheController.delete)

module.exports = router