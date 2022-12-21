const express = require('express')
const router = express.Router()

const phongchieuController = require('../controllers/phongchieu.controller')

router.get("/", phongchieuController.getAll)
router.get("/:maPhongChieu", phongchieuController.getById)
router.post("/", phongchieuController.create)
router.put("/:maPhongChieu", phongchieuController.update)
router.delete("/:maPhongChieu", phongchieuController.delete)

module.exports = router