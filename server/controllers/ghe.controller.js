const fs = require('fs')
const excelToJson = require("convert-excel-to-json");
const gheService = require('../services/ghe.service')
const redisClient = require('../config/redis')

const gheController = {
    getAll: async (req, res) => {
        try {
            const [result] = await gheService.getAll()
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
    getAllByMaPhongChieu: async (req, res) => {
        try {
            const { maPhongChieu } = req.params
            const [result] = await gheService.getByMaPhongChieu(maPhongChieu)
            const [hang] = await gheService.getHangByMaPhongChieu(maPhongChieu)
            const [thutu] = await gheService.getMaxThuTuByMaPhongChieu(maPhongChieu)
            res.json({
                data: result,
                hang,
                thutu: thutu[0],
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
    getAllDaBan: async (req, res) => {
        try {
            const { maSuatChieu } = req.params
            const [result] = await gheService.getDaBanByMaSuatChieu(maSuatChieu)
       
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
            const [result] = await gheService.getById(id)
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
    importExcel: async (req, res) => {
        try {
            const { maPhongChieu } = req.params
            const { file } = req.files
            const excelData = await excelToJson({
                name: "dsGhe",
                sourceFile: file?.tempFilePath,
                header: { rows: 1 },
                columnToKey: {
                    A: "maGhe",
                    B: "hang",
                    C: "thutu",
                    D: "maLoaiGhe",
                }
            })["Sheet1"]

            if (excelData.length == 0) {
                fs.unlinkSync(file.tempFilePath)
                return res.json({ error: "File không có dữ liệu hoặc không đúng định dạng!!" });
            }
            let count = 0;
            const importError = []
            for(let i = 0; i < excelData.length; i++) {
                const { hang, thutu, maLoaiGhe } = excelData[i]

                const [check] = await gheService.getByInfo({hang, thutu, maPhongChieu})
                if (check.length > 0) {
                    importError.push(`Phòng chiếu ${maPhongChieu} đã có ghế ${hang}${thutu}`)
                    continue
                }
                const [result] = await gheService.create({hang, thutu, maLoaiGhe, maPhongChieu})
                if (result?.affectedRows) {
                    count++
                } else {
                    importError.push(error)
                } 
            }

            fs.unlinkSync(file.tempFilePath)
            return res.json({ message: `Import thành công ${count} ghế`, importError })
            
        } catch (error) {
            console.log(error)
            res.json({
                status: "error",
                error: error.message
            })
        }
    },
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
    create: async (req, res) => {
        try {
            const { hang, thutu, maLoaiGhe, maPhongChieu } = req.body

            const [check] = await gheService.getByInfo({hang, thutu, maPhongChieu})
            if (check.length > 0) return res.json({ error: `Phòng chiếu ${maPhongChieu} đã có ghế ${hang}${thutu}` })

            const [result] = await gheService.create({hang, thutu, maLoaiGhe, maPhongChieu})
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
   
    // importExcel: async (req, res) => {
    //     try {
    //         const { file } = req.files
    //         const excelData = await excelToJson({
    //             name: "dsGhe",
    //             sourceFile: file?.tempFilePath,
    //             header: { rows: 1 },
    //             columnToKey: {
    //                 A: "maGhe",
    //                 B: "hang",
    //                 C: "thutu",
    //                 D: "maLoaiGhe",
    //                 E: "maPhongChieu"
    //             }
    //         })["Sheet1"]

    //         if (excelData.length == 0) {
    //             fs.unlinkSync(file.tempFilePath)
    //             return res.json({ error: "File không có dữ liệu hoặc không đúng định dạng!!" });
    //         }
    //         let count = 0;
    //         const importError = []
    //         for(let i = 0; i < excelData.length; i++) {
    //             const { hang, thutu, maLoaiGhe, maPhongChieu } = excelData[i]

    //             const { result: check } = await gheService.getByInfo({hang, thutu, maPhongChieu})
    //             if (check.length > 0) {
    //                 importError.push(`Phòng chiếu ${maPhongChieu} đã có ghế ${hang}${thutu}`)
    //                 continue
    //             }
    //             const { result, error } = await gheService.create({hang, thutu, maLoaiGhe, maPhongChieu})
    //             if (result?.affectedRows) {
    //                 count++
    //             } else {
    //                 importError.push(error)
    //             } 
    //         }

    //         fs.unlinkSync(file.tempFilePath)
    //         return res.json({ message: `Import thành công ${count} ghế`, importError })
           
    //     } catch (error) {
    //         console.log(error)
    //         res.json({
    //             status: "error",
    //             error: error.message
    //         })
    //     }
    // },
    // update: async (req, res) => {
    //     try {
    //         const { hang, thutu, maLoaiGhe, maPhongChieu } = req.body
    //         const { maGhe } = req.params

    //         const { result, error } = await gheService.update(maGhe, {hang, thutu, maLoaiGhe, maPhongChieu})

    //         if (error) return res.json({ status: "error", error })

    //         if (result?.affectedRows) {
    //             res.json({
    //                 data: result,
    //                 message: "Ok",
    //             })
    //         } else {
    //             res.json({
    //                 status: "error",
    //                 error: "Không tìm thấy ghế!!"
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
    delete: async (req, res) => {
        try {
            const { id } = req.params
            const [result] = await gheService.delete(id)

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy ghế!!"
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

module.exports = gheController