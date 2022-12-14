const express = require('express')
const router = express.Router()

const ngayleController = require('../controllers/ngayle.controller')

router.get("/", ngayleController.getAll)
router.get("/:id", ngayleController.getById)
router.post("/", ngayleController.create)
router.put("/:id", ngayleController.update)
router.delete("/:id", ngayleController.delete)

module.exports = router