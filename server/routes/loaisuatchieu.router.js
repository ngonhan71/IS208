const express = require('express')
const router = express.Router()

const loaisuatchieuController = require('../controllers/loaisuatchieu.controller')

router.get("/them-sc", loaisuatchieuController.getAllAddSC)
router.get("/", loaisuatchieuController.getAll)
router.get("/:id", loaisuatchieuController.getById)
router.post("/", loaisuatchieuController.create)
router.put("/:id", loaisuatchieuController.update)
router.delete("/:id", loaisuatchieuController.delete)

module.exports = router