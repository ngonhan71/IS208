const crypto = require('crypto')
const fetch = require('node-fetch');

const generateQR = require("../helper/qrcode");
const { cloudinary } = require('../config/cloudinary')

const redisClient = require('../config/redis')
const suatchieuService = require('../services/suatchieu.service')
const hoadonService = require('../services/hoadon.service')

const hoadonController = {
    getAll: async (req, res) => {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10
            const offset = (page - 1) * limit

            const [a, b] = await Promise.all([
                hoadonService.getCount(),
                hoadonService.getAll({limit, offset})
            ])

            const [countResult] = a
            const count = countResult[0]
            const [result] = b
            const totalPage = Math.ceil(count.count / limit)
            res.json({
                data: result,
                message: "Ok",
                count: count.count,
                totalPage
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    getCount: async (req, res) => {
        try {
            const [countResult] = await hoadonService.getCount()
            const count = countResult[0]?.count
            res.json({
                count,
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
    getRevenue: async (req, res) => {
        try {
            const [revenueResult] = await hoadonService.getRevenue()
            const revenue = revenueResult[0]?.revenue
            res.json({
                revenue,
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
    getRevenueChart: async (req, res) => {
        try {
            const { maRapChieu, start, end } = req.query
            const [result] = await hoadonService.getRevenueChart({maRapChieu, start, end})
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
    getCountLifeTime: async (req, res) => {
        try {
            const [result] = await hoadonService.getCountLifeTime()
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
    getPhimBanChay: async (req, res) => {
        try {
            const { by, maRapChieu } = req.query
            let result = []
            if (by === "so-luong") {
                [result] = await hoadonService.getPhimBanChayBySoLuong({maRapChieu})
            } else if (by === "gia") {
                [result] = await hoadonService.getPhimBanChayByGia({maRapChieu})
            }
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
    getRapChieuBanChay: async (req, res) => {
        try {
            const { by } = req.query
            let result = []
            if (by === "so-luong") {
                [result] = await hoadonService.getRapChieuBanChayTheoSoLuong()
            } else if (by === "gia") {
                [result] = await hoadonService.getRapChieuBanChayTheoGia()
            }
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
    getAllByUserId: async (req, res) => {
        try {
            const { maNguoiDung } = req.params
            const [result] = await hoadonService.getByUserId(maNguoiDung)
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
            const [result] = await hoadonService.getById(id)
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
    getPayUrlMoMo: async (req, res) => {
        try {
            const { amount, maSuatChieu } = req.query

            const [suatchieuResult] = await suatchieuService.getOnLySuatChieuById(maSuatChieu)
            const suatchieu = suatchieuResult[0]

            const nc = new Date(suatchieu.ngay_chieu).toDateString()
            
            const ngaygioChieu = new Date(`${nc} ${suatchieu.gio_chieu}`).getTime()

            const after30Minutes = new Date().getTime() + 30 * 60000
            if (!(after30Minutes  < ngaygioChieu)) {
            return res.json({ error: "Qua thoi gian dat ve!" })
            }

            const partnerCode = "MOMO";
            const accessKey = "F8BBA842ECF85";
            const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            const requestId = partnerCode + new Date().getTime() + "19520800";
            const orderId = requestId;
            const orderInfo = "Thanh toán đặt vé tại UITCinema";
            const redirectUrl = "https://19520800cinema.com/thanhtoan/momo";
            const ipnUrl = "https://callback.url/notify";
            const requestType = "captureWallet"
            const extraData = "";

            const rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
           
            const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');
            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                accessKey : accessKey,
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                extraData : extraData,
                requestType : requestType,
                signature : signature,
                lang: 'en'
            });
          
            fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
                method: 'POST',
                body: requestBody,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json =>  res.json({ message: "Ok", payUrl: json.payUrl }))
            .catch (err => res.json({ error: err.message }))
            
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    getPayUrlMoMoPOST: async (req, res) => {
        try {
            const { amount, maSuatChieu, maThanhToan } = req.body

            const [suatchieuResult] = await suatchieuService.getOnLySuatChieuById(maSuatChieu)
            const suatchieu = suatchieuResult[0]

            const nc = new Date(suatchieu.ngay_chieu).toDateString()
            
            const ngaygioChieu = new Date(`${nc} ${suatchieu.gio_chieu}`).getTime()

            const after30Minutes = new Date().getTime() + 30 * 60000
            if (!(after30Minutes  < ngaygioChieu)) {
            return res.json({ error: "Qua thoi gian dat ve!" })
            }

            const host = req.get('origin')
            const link = `${host}/thanhtoan/momo/callback`

            const partnerCode = "MOMO";
            const accessKey = "F8BBA842ECF85";
            const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            const requestId = maThanhToan;
            const orderId = requestId;
            const orderInfo = "Thanh toán đặt vé tại UITCinema";
            const redirectUrl = link;
            const ipnUrl = "https://callback.url/notify";
            const requestType = "captureWallet"
            const extraData = "";

            const rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
           
            const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');
            const requestBody = JSON.stringify({
                partnerCode : partnerCode,
                accessKey : accessKey,
                requestId : requestId,
                amount : amount,
                orderId : orderId,
                orderInfo : orderInfo,
                redirectUrl : redirectUrl,
                ipnUrl : ipnUrl,
                extraData : extraData,
                requestType : requestType,
                signature : signature,
                lang: 'en'
            });
          
            fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
                method: 'POST',
                body: requestBody,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(json =>  res.json({ message: "Ok", payUrl: json.payUrl }))
            .catch (err => res.json({ error: err.message }))
            
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    verifyMoMo: async (req, res) => {
        try {
            const { maThanhToan } = req.body

            const partnerCode = "MOMO";
            const accessKey = "F8BBA842ECF85";
            const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

            const rawSignature = "accessKey=" + accessKey + "&orderId=" + maThanhToan + "&partnerCode=" + partnerCode + "&requestId=" + maThanhToan
            const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');
           
            const requestBody = JSON.stringify({
                partnerCode : "MOMO",
                requestId : maThanhToan,
                orderId : maThanhToan,
                signature : signature,
                lang: 'en'
            });
          
            fetch('https://test-payment.momo.vn/v2/gateway/api/query', {
                method: 'POST',
                body: requestBody,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(async (json) =>  {
                const { resultCode, transId } = json
                if (resultCode === 0) {
                    try {
                        await hoadonService.updateStatus(maThanhToan, {trangThai: 1, thanhtoan: "MoMo", transId})
                        return res.json({ message: "Ok" })
                    } catch (error) {
                        res.json({
                            status: "error",
                            error: error.message
                        })
                    }
                }
                res.json({ message: "Ok", json })
            })
            .catch (err => res.json({ error: err.message }))
            
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
            const { maSuatChieu, dsGhe, maNguoiDung, triGia, tenPhim, thanhtoan, maThanhToan } = req.body

            const [result] = await hoadonService.create({maNguoiDung, triGia, thanhtoan, maThanhToan})

            const maHoaDon = result?.insertId

            if (maHoaDon > 0) {
                for (let i = 0; i < dsGhe.length; i++) {
                    
                    const [data] = await hoadonService.createDetail({maHoaDon, maSuatChieu, maGhe: dsGhe[i].maGhe, triGia: dsGhe[i].gia})
                    const fileQrCode = await generateQR(
                        JSON.stringify({
                          maVe: data?.insertId,
                          tenPhim,
                          maSuatChieu,
                          tenGhe: dsGhe[i].tenGhe,
                          maGhe: dsGhe[i].maGhe,
                          gia: dsGhe[i].gia
                        })
                    );

                    const { secure_url: qrcode, public_id } = await cloudinary.uploader.upload(fileQrCode, {
                        folder: "IS208",
                    });

                    await hoadonService.updateQRCodeVe(data?.insertId, {qrcode, public_id})
                }
                for(let i = 0; i < dsGhe.length; i++) {
                    const key = `${maSuatChieu}-${dsGhe[i].maGhe}`
                    const data = await redisClient.get(key)
                    if (data) {
                        await redisClient.del(key)
                     
                    } 
                }
                return res.json({ message: "OK!" })
            }

            return res.json({ error: "Lỗi!" })

           
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    updateMaThanhToan: async (req, res) => {
        try {
            const { id } = req.params
            const { maThanhToan } = req.body
            const [rows] = await hoadonService.updateMaThanhToan(id, {maThanhToan})
            if (rows?.affectedRows) {
                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Thất bại"
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
    // delete: async (req, res) => {
    //     try {
    //         const { id } = req.params
    //         const [result] = await ngayleService.delete(id)

    //         if (result?.affectedRows) {
    //             res.json({
    //                 data: result,
    //                 message: "Ok",
    //             })
    //         } else {
    //             res.json({
    //                 status: "error",
    //                 error: "Không tìm thấy ngày lễ!!"
    //             })
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             status: "error",
    //             error: error.message
    //         })
    //     }
    // }

}

module.exports = hoadonController