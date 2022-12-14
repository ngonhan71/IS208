const express = require('express')
const router = express.Router()

const theloaiController = require('../controllers/theloai.controller')

router.get("/", theloaiController.getAll)
router.get("/:id", theloaiController.getById)
router.post("/", theloaiController.create)
router.put("/:id", theloaiController.update)
router.delete("/:id", theloaiController.delete)

module.exports = router