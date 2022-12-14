const theloaiService = require('../services/theloai.service')

const theloaiController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await theloaiService.getAll()
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
            const [rows] = await theloaiService.getById(id)
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
            const { tenTheLoai } = req.body
            const [rows] = await theloaiService.create({tenTheLoai})
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
            const { tenTheLoai } = req.body
            const { id } = req.params

            const [rows] = await theloaiService.update(id, {tenTheLoai})

            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy thể loại phim!!"
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
            const [rows] = await theloaiService.delete(id)

            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy thể loại phim!!"
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

module.exports = theloaiController