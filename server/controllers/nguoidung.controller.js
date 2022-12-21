const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nguoidungService = require('../services/nguoidung.service')
const { generateCode } = require('../helper/auth')
const { transporter } = require('../config/nodemailer')
 
const nguoidungController = {
    createNV: async (req, res) => {
        try {
            const { email, tenNguoiDung, dienthoai } = req.body
            const [checkEmail] = await nguoidungService.getByEmail(email)
            if (checkEmail[0]) return res.json({ error: "Email đã tồn tại!" })

            const [checkPhone] = await nguoidungService.getByPhone(dienthoai)
            if (checkPhone[0]) return res.json({ error: "Số điện thoại đã tồn tại!" })

            const matkhau = (Math.floor(Math.random() * 9999999) + 100000).toString()
            const hashMK = await bcrypt.hash(matkhau, 10)

            const [result] = await nguoidungService.create({email, tenNguoiDung, matkhau: hashMK, dienthoai, role: 1, trangthai: "active"})

            const resultSendMail = await transporter.sendMail({
                from: '"CINEMA" <project.php.nhncomputer@gmail.com>',
                to: email,
                subject: `[CINEMA] Thông tin tài khoản nhân viên của bạn`,
                html: ` <h3>Xin chào ${tenNguoiDung},</h3>
                        <h3>Chúc mừng bạn vừa được cấp tài khoản quyền nhân viên tại UIT Cinema!</h3>
                        <p>Username : ${email}</p>
                        <p>Password : ${matkhau}</p>`
            })
 
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
    getAllNV: async (req, res) => {
        try {
            const [rows] = await nguoidungService.getAllNV()
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
    handleForgotPassword: async(req, res) => {
        try {
            const { email } = req.body
            const [rows] = await nguoidungService.getByEmail(email)
            const nguoidung = rows[0]

            if (!nguoidung) {
                return res.json({
                    status: "error",
                    error: "Tài khoản không tồn tại!"
                })
            }

            const { ma_nguoidung, ten_nguoidung } = nguoidung

            const resetCode = generateCode({ma_nguoidung, email})
            const host = req.get('origin')
            const link = `${host}/dat-lai-mat-khau/${resetCode}`
            const resultSendMail = await transporter.sendMail({
                from: '"CINEMA" <project.php.nhncomputer@gmail.com>',
                to: email,
                subject: `[CINEMA] Đặt lại mật khẩu!`,
                html: ` <h3>Xin chào ${ten_nguoidung},</h3>
                        <h3>Bạn vừa yêu cầu UITCinema cấp lại mật khẩu tài khoản cho mình.</h3>
                        <a href="${link}">Nhấn vào đây để thực hiện</a>`
            })
            return res.json({
                error: 0,
                message: 'success'
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    handleResetPassword: async(req, res) => {
        try {
            const { code, password } = req.body
            const { email, ma_nguoidung } = jwt.verify(code, process.env.JWT_ACCESS_TOKEN_SECRET)
            if (!email || !ma_nguoidung) res.json({error: "Code không hợp lệ!"})

            const [rows] = await nguoidungService.getById(ma_nguoidung)
            const nguoidung = rows[0]

            if (!nguoidung) {
                return res.json({
                    status: "error",
                    error: "Code không hợp lệ!"
                })
            }

            const hash = await bcrypt.hash(password, 10)

            await nguoidungService.updatePassword(ma_nguoidung, { password: hash })
           
            return res.json({
                error: 0,
                message: 'success'
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params
            const { trangthai } = req.body

            const [rows] = await nguoidungService.updateStatus(id, { trangthai })

            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Thất bại!!"
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