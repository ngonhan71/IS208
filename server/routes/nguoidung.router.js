const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const nguoidungController = require('../controllers/nguoidung.controller')

router.get("/mobile/request-active/:maNguoiDung", authController.createActiveCode)
router.get("/mobile", authController.activeTaiKhoan)
router.get("/khachhang", nguoidungController.getAllKH)
router.get("/:id", nguoidungController.getById)

router.put("/:id/password", nguoidungController.changePassword)


module.exports = router