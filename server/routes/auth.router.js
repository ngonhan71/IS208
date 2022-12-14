const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth.controller')
const { verifyToken } = require('../middleware/auth')

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/login/mobile", authController.loginMobile)
router.post("/login/admin", authController.loginAdmin)
router.get("/me", verifyToken, authController.getMe)

module.exports = router