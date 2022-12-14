const express = require('express')
const router = express.Router()

const veController = require('../controllers/ve.controller')

router.post("/giu-ghe", veController.giuGhe)
router.post("/bo-chon-ghe", veController.boChonGhe)
router.post("/bo-chon-tat-ca-ghe", veController.boChonTatCaGhe)

module.exports = router