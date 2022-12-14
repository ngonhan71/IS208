const express = require('express')
const router = express.Router()

// const fileUpload = require('express-fileupload')
// const uploadOpts = {
//     useTempFiles : true,
//     tempFileDir : '/tmp/'
// }

const phongchieuController = require('../controllers/phongchieu.controller')

router.get("/", phongchieuController.getAll)
router.get("/:maPhongChieu", phongchieuController.getById)
router.post("/", phongchieuController.create)
router.put("/:maPhongChieu", phongchieuController.update)
router.delete("/:maPhongChieu", phongchieuController.delete)

module.exports = router