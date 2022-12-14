const express = require('express')
const router = express.Router()

const rapchieuController = require('../controllers/rapchieu.controller')

router.get("/", rapchieuController.getAll)
router.get("/thanhpho/:thanhpho", rapchieuController.getByThanhPho)
router.get("/thanhpho", rapchieuController.getThanhPho)
router.get("/:id", rapchieuController.getById)
router.post("/", rapchieuController.create)
router.put("/:id", rapchieuController.update)
router.delete("/:id", rapchieuController.delete)

module.exports = router