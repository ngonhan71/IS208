const express = require('express')
const router = express.Router()

const loaigheController = require('../controllers/loaighe.controller')

router.get("/", loaigheController.getAll)
router.get("/:id", loaigheController.getById)
router.post("/", loaigheController.create)
router.put("/:id", loaigheController.update)
router.delete("/:id", loaigheController.delete)

module.exports = router