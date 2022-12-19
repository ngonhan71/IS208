const bcrypt = require('bcrypt')
const nguoidungService = require('../services/nguoidung.service')

const nguoidungController = {
    getAllKH: async (req, res) => {
        try {
            const [rows] = await nguoidungService.getAllKH()
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
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body
            const { id } = req.params

            const [rows] = await nguoidungService.getById(id)
            const user = rows[0]

            if (user) {
                const { matkhau: pwDB } = user
                const check = await bcrypt.compare(currentPassword, pwDB)

                if (check) {
                    const hash = await bcrypt.hash(newPassword, 10)

                    await nguoidungService.updatePassword(id, { password: hash })
                    return res.json({
                        message: "Ok",
                    })
                    
                }
                return res.json({
                    status: "error",
                    error: "Mật khẩu hiện tại không đúng!"
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

}

module.exports = nguoidungController