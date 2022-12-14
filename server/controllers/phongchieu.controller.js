// const fs = require('fs')
// const excelToJson = require("convert-excel-to-json");
const phongchieuService = require('../services/phongchieu.service')
// const gheService = require('../services/ghe.service')

const phongchieuController = {
    getAll: async (req, res) => {
        try {
            const { maRapChieu } = req.query
            const [result] = await phongchieuService.getAll({maRapChieu})
            res.json({
                data: result,
                message: "Ok",
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    getById: async (req, res) => {
        try {
            const { maPhongChieu } = req.params
            const [result] = await phongchieuService.getById(maPhongChieu)
            res.json({
                data: result[0],
                message: "Ok",
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    create: async (req, res) => {
        try {
            const { tenPhongChieu, maRapChieu } = req.body

            const [resultCheckName] = await phongchieuService.getByName({
                tenPhongChieu: tenPhongChieu.trim(), 
                maRapChieu
            })
            if (resultCheckName.length >= 1) return res.json({ status: "error", error: "Tên phòng chiếu đã tồn tại!!" })
           
            const [result] = await phongchieuService.create({tenPhongChieu, maRapChieu})
            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: error
                })
            }
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    update: async (req, res) => {
        try {
            const { tenPhongChieu, maRapChieu } = req.body
            const { maPhongChieu } = req.params

            const [resultCheckName] = await phongchieuService.getByName({
                tenPhongChieu: tenPhongChieu.trim(), 
                maRapChieu
            })
            if (resultCheckName.length >= 1) return res.json({ status: "error", error: "Tên phòng chiếu đã tồn tại!!" })

            const [result] = await phongchieuService.update(maPhongChieu, {tenPhongChieu, maRapChieu})

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy phòng chiếu!!"
                })
            }
         
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    }, 
    delete: async (req, res) => {
        try {
            const { maPhongChieu } = req.params
            const [result] = await phongchieuService.delete(maPhongChieu)

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy phòng chiếu!!"
                })
            }
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    }

}

module.exports = phongchieuController