const express = require('express')
const router = express.Router()

const ngayleController = require('../controllers/ngayle.controller')

const { verifyToken, checkRole, roleEnum } = require('../middleware/auth')

router.get("/", ngayleController.getAll)
router.get("/:id", ngayleController.getById)
router.post("/", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), ngayleController.create)
router.put("/:id", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), ngayleController.update)
router.delete("/:id", verifyToken, checkRole([roleEnum.Staff, roleEnum.Admin]), ngayleController.delete)

module.exports = router