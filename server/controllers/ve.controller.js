const redisClient = require('../config/redis')

const veController = {
    giuGhe: async (req, res) => {
        try {
            const { maSuatChieu, maGhe, seconds, maNguoiDung } = req.body
            console.log(seconds)
            const key = `${maSuatChieu}-${maGhe}`
            console.log(key)

            const data = await redisClient.get(key)
            if (data) {
                return res.json({ error: "Ghế này đã được chọn từ người khác. Vui lòng chọn ghế khác!" })
            }
            const result = await redisClient.setex(key, seconds, maNguoiDung)

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
    boChonGhe: async (req, res) => {
        try {
            const { maSuatChieu, maGhe } = req.body
            
            const key = `${maSuatChieu}-${maGhe}`
            console.log(key)
            const data = await redisClient.get(key)
            if (data) {
                const result = await redisClient.del(key)
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({ error: "Không tìm thấy!!" })
            }
          
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
    boChonTatCaGhe: async (req, res) => {
        try {
            const { dsGhe, maSuatChieu } = req.body
            if (dsGhe && dsGhe.length > 0) {
                for(let i = 0; i < dsGhe.length; i++) {
                    const key = `${maSuatChieu}-${dsGhe[i].maGhe}`
                    const data = await redisClient.get(key)
                    if (data) {
                        await redisClient.del(key)
                     
                    } 
                }
            }
            res.json({
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
}

module.exports = veController