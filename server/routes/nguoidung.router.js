const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const nguoidungController = require('../controllers/nguoidung.controller')
const { verifyToken, checkRole, roleEnum } = require('../middleware/auth')


router.get("/mobile/request-active/:maNguoiDung", authController.createActiveCode)
router.get("/mobile", authController.activeTaiKhoan)
router.get("/khachhang", nguoidungController.getAllKH)
router.get("/nhanvien", nguoidungController.getAllNV)
router.get("/:id", nguoidungController.getById)

router.post("/quen-mat-khau", nguoidungController.handleForgotPassword)
router.post("/dat-lai-mat-khau", nguoidungController.handleResetPassword)

router.post("/nhan-vien", verifyToken, checkRole([roleEnum.Admin]), nguoidungController.createNV)

router.put("/:id/trang-thai", verifyToken, checkRole([roleEnum.Admin]), nguoidungController.updateStatus)
router.put("/:id/password", nguoidungController.changePassword)


module.exports = router