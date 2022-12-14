const loaisuatchieuService = require('../services/loaisuatchieu.service')

const loaisuatchieuController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await loaisuatchieuService.getAll()
            res.json({
                data: rows,
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
    getAllAddSC: async (req, res) => {
        try {
            const [rows] = await loaisuatchieuService.getAllAddSC()
            res.json({
                data: rows,
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
            const { id } = req.params
            const [rows] = await loaisuatchieuService.getById(id)
            res.json({
                data: rows[0],
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
            const { tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia } = req.body
            const [check] = await loaisuatchieuService.getByInfo({tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia})
            if (check.length > 0) return res.json({ error: "Thông tin loại suất chiếu đã tồn tại!!!" })

            const [result] = await loaisuatchieuService.create({tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia})
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
            const { tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia } = req.body
            const { id } = req.params

            const [check] = await loaisuatchieuService.getByInfo({
                maLoaiSuatChieu: id, tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia
            })
            if (check.length > 0) return res.json({ error: "Thông tin loại suất chiếu đã tồn tại!!!" })

            const [result] = await loaisuatchieuService.update(id, {tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia})
            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy loại suất chiếu!!"
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
            const { id } = req.params
            const [result] = await loaisuatchieuService.delete(id)

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy loại suất chiếu!!"
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

module.exports = loaisuatchieuController