const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nguoidungService = require('../services/nguoidung.service')

const { generateAccessToken, generateCode } = require('../helper/auth')
const { transporter } = require('../config/nodemailer')

const authController = {
    register: async(req, res) => {
        try {
            const { email, tenNguoiDung, matkhau, dienthoai } = req.body

            const [checkEmail] = await nguoidungService.getByEmail(email)
            if (checkEmail[0]) return res.json({ error: "Email đã tồn tại!" })

            const [checkPhone] = await nguoidungService.getByPhone(dienthoai)
            if (checkPhone[0]) return res.json({ error: "Số điện thoại đã tồn tại!" })

            const hashMK = await bcrypt.hash(matkhau, 10)

            const [result] = await nguoidungService.create({email, tenNguoiDung, matkhau: hashMK, dienthoai})
            
            const code = generateCode({email, ma_nguoidung: result?.insertId})
            //send email
            const link = `${process.env.URL_SERVER}/api/v1/nguoidung/mobile?active_code=${code}`
            const resultSendMail = await transporter.sendMail({
                from: '"CINEMA" <project.php.nhncomputer@gmail.com>',
                to: email,
                subject: `[CINEMA] Chúc mừng bạn đăng ký thành công!`,
                html: ` <h3>Xin chào ${tenNguoiDung},</h3>
                        <h3>Bạn vừa tiến hành đăng ký tài khoản tại UIT Cinema!</h3>
                        <p>Chúc mừng bạn trở thành thành viên UIT Cinema - Tích điểm ngay nhận quà liền tay.</p>
                        <p>Username : ${email}</p>
                        <a href="${link}">Nhấn vào đây để kích hoạt</a>`
            })
            res.status(200).json({
                message: 'Ok',
                result
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    createActiveCode: async(req, res) => {
        try {
            const { maNguoiDung } = req.params

            const [nguoidung] = await nguoidungService.getById(maNguoiDung)
            const { ma_nguoidung, email, ten_nguoidung } = nguoidung[0]
            
            const code = generateCode({ma_nguoidung, email})
            //send email
            const link = `${process.env.URL_SERVER}/api/v1/nguoidung/mobile?active_code=${code}`
            const resultSendMail = await transporter.sendMail({
                from: '"CINEMA" <project.php.nhncomputer@gmail.com>',
                to: email,
                subject: `[CINEMA] Chúc mừng bạn đăng ký thành công!`,
                html: ` <h3>Xin chào ${ten_nguoidung},</h3>
                        <h3>Bạn vừa tiến hành đăng ký tài khoản tại UIT Cinema!</h3>
                        <p>Chúc mừng bạn trở thành thành viên UIT Cinema - Tích điểm ngay nhận quà liền tay.</p>
                        <p>Username : ${email}</p>
                        <a href="${link}">Nhấn vào đây để kích hoạt</a>`
            })
            res.status(200).json({
                message: 'Ok',
                resultSendMail
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    activeTaiKhoan: async(req, res) => {
        try {
            const { active_code } = req.query

            const { email, ma_nguoidung } = jwt.verify(active_code, process.env.JWT_ACCESS_TOKEN_SECRET);
            if (!email || !ma_nguoidung) res.json({error: "Code không hợp lệ!"})
            const [nguoidung] = await nguoidungService.getById(ma_nguoidung)
            if (nguoidung[0]) {
                const [result] = await nguoidungService.updateStatus(ma_nguoidung, { trangthai: "active" })
                return res.json({message: "Xác minh tài khoản thành công!!"})
                
            }
            return res.json({error: "Không tìm thấy khách hàng!!"})
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    login: async(req, res) => {
        try {
            const { email, matkhau } = req.body
            const [nguoidung] = await nguoidungService.getByEmail(email)
            if (!nguoidung[0]) return res.json({ error: "Tài khoản, mật khẩu không đúng!" })

            const { ten_nguoidung, ma_nguoidung, matkhau: matKhauDB, role, trang_thai, dienthoai } = nguoidung[0]

            const check = await bcrypt.compare(matkhau, matKhauDB)
            if (!check) return res.json({ error: 'Tài khoản, mật khẩu không đúng!' })


            if (trang_thai === "inactive" && role === 0) {
                return res.json({ error: "Tài khoản của bạn chưa được kích hoạt!",  data: { ma_nguoidung } })
            }

            if (trang_thai === "inactive" && role === 1) {
                return res.json({ error: "Tài khoản của bạn đã bị khóa! Vui lòng liên hệ người quản trị!" })
            }
            
            const accessToken = generateAccessToken({ userId: ma_nguoidung, role })

            res.status(200).json({
                message: 'Ok',
                accessToken,
                data: { ten_nguoidung, ma_nguoidung, email, role, dienthoai }
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    loginMobile: async(req, res) => {
        try {
            const { email, matkhau } = req.body
            const [nguoidung] = await nguoidungService.getByEmail(email)
            if (!nguoidung[0]) return res.json({ error: "Tài khoản, mật khẩu không đúng!" })

            const { ten_nguoidung, ma_nguoidung, matkhau: matKhauDB, role, trang_thai } = nguoidung[0]

            const check = await bcrypt.compare(matkhau, matKhauDB)
            if (!check || role !== 0) return res.json({ error: 'Tài khoản, mật khẩu không đúng!' })


            if (trang_thai === "inactive") {
                return res.json({ error: "Tài khoản của bạn chưa được kích hoạt!",  data: { ma_nguoidung } })
            }
            
            const accessToken = generateAccessToken({ userId: ma_nguoidung, role })

            res.status(200).json({
                message: 'Ok',
                accessToken,
                data: { ten_nguoidung, ma_nguoidung, email, role }
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    loginAdmin: async(req, res) => {
        try {
            const { email, matkhau } = req.body
            const [nguoidung] = await nguoidungService.getByEmail(email)
            if (!nguoidung[0]) return res.json({ error: "Tài khoản, mật khẩu không đúng!" })

            const { ten_nguoidung, ma_nguoidung, matkhau: matKhauDB, role, trang_thai } = nguoidung[0]

            const check = await bcrypt.compare(matkhau, matKhauDB)
            if (!check) return res.json({ error: 'Tài khoản, mật khẩu không đúng!' })


            if (role < 1) {
                return res.json({ error: "Tài khoản của bạn không đủ quyền!" })
            }
            
            const accessToken = generateAccessToken({ userId: ma_nguoidung, role })

            res.status(200).json({
                message: 'Ok',
                accessToken,
                data: { ten_nguoidung, ma_nguoidung, email, role }
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    getMe: async(req, res) => {
        try {
            const { user } = req
            const { userId } = user
            const [result] = await nguoidungService.getById(userId)
            const { matkhau, ...data } = result[0]
            return res.json({
                data: data,
                message: 'Ok'
            })
            
        } catch (error) {
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
}

module.exports = authController