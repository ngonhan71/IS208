const rapchieuService = require('../services/rapchieu.service')

const rapchieuController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await rapchieuService.getAll()
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
    getThanhPho: async (req, res) => {
        try {
            const [rows] = await rapchieuService.getThanhPho()
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
    getByThanhPho: async (req, res) => {
        try {
            const { thanhpho } = req.params
            const [rows] = await rapchieuService.getByThanhPho(thanhpho)
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
            const [rows] = await rapchieuService.getById(id)
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
            const { tenRapChieu, diachi, thanhpho, dienthoai } = req.body
            const [rows] = await rapchieuService.create({tenRapChieu, diachi, thanhpho, dienthoai})
            if (rows?.affectedRows) {
                res.json({
                    data: rows,
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
            const { tenRapChieu, diachi, thanhpho, dienthoai } = req.body
            const { id } = req.params
            const [rows] = await rapchieuService.update(id, {tenRapChieu, diachi, thanhpho, dienthoai})

            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy rạp chiếu!!"
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
            const [rows] = await rapchieuService.delete(id)

            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy rạp chiếu!!"
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

module.exports = rapchieuController