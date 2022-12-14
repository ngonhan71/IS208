const nguoidungService = require('../services/nguoidung.service')

const nguoidungController = {
    // getAll: async (req, res) => {
    //     try {
    //         const [rows] = await loaigheService.getAll()
    //         res.json({
    //             data: rows,
    //             message: "Ok",
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             status: "error",
    //             error: error.message
    //         })
    //     }
    // },
    getById: async (req, res) => {
        try {
            const { id } = req.params
            const [rows] = await nguoidungService.getById(id)
            const user = rows[0]
            const { matkhau, ...data } = user
            res.json({
                data: data,
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
    // update: async (req, res) => {
    //     try {
    //         const { tenLoaiGhe, soCho, giaCongThem, color } = req.body
    //         const { id } = req.params

    //         const [rows] = await loaigheService.update(id, {tenLoaiGhe, soCho, giaCongThem, color})

    //         if (rows?.affectedRows) {
    //             res.json({
    //                 data: rows,
    //                 message: "Ok",
    //             })
    //         } else {
    //             res.json({
    //                 status: "error",
    //                 error: "Không tìm thấy loại ghế!!"
    //             })
    //         }
         
    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             status: "error",
    //             error: error.message
    //         })
    //     }
    // }, 

}

module.exports = nguoidungController