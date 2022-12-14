const express = require('express')
const router = express.Router()

const fileUpload = require('express-fileupload')
const uploadOpts = {
    useTempFiles : true,
    tempFileDir : '/tmp/'
}


const gheController = require('../controllers/ghe.controller')

router.get("/phongchieu/:maPhongChieu", gheController.getAllByMaPhongChieu)
router.get("/da-ban/:maSuatChieu", gheController.getAllDaBan)
router.get("/", gheController.getAll)
router.get("/:id", gheController.getById)

router.post("/phongchieu/:maPhongChieu", fileUpload(uploadOpts), gheController.importExcel)

router.post("/giu-ghe", gheController.giuGhe)
router.post("/bo-chon-ghe", gheController.boChonGhe)
router.post("/bo-chon-tat-ca-ghe", gheController.boChonTatCaGhe)

router.post("/", gheController.create)
// router.put("/:id", gheController.update)
router.delete("/:id", gheController.delete)

module.exports = router