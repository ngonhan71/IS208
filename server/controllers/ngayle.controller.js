const ngayleService = require('../services/ngayle.service')

const ngayleController = {
    getAll: async (req, res) => {
        try {
            const [result] = await ngayleService.getAll()
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
            const { id } = req.params
            const [result] = await ngayleService.getById(id)
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
            const { tenNgayLe, loai, ngay } = req.body

            const date = new Date(ngay)
            if (date.toString() === "Invalid Date") return res.json({ error: "Ngày không hơp lệ" })

            const [result] = await ngayleService.create({tenNgayLe, loai, ngay})
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
            const { tenNgayLe, loai, ngay } = req.body
            const { id } = req.params
            
            const date = new Date(ngay)
            if (date.toString() === "Invalid Date") return res.json({ error: "Ngày không hơp lệ" })

            const [result] = await ngayleService.update(id, {tenNgayLe, loai, ngay})

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy ngày lễ!!"
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
            const [result] = await ngayleService.delete(id)

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy ngày lễ!!"
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

module.exports = ngayleController