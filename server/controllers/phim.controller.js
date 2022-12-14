const phimService = require('../services/phim.service')

const phimController = {
    getAll: async (req, res) => {
        try {
            const { key } = req.query
            let data = []
            if (key) {
                const paramSearch = `%${key.split(' ').join('%')}%`
                const [rows] = await phimService.search({key: paramSearch})
                data = rows
            } else {
                [data] = await phimService.getAll()
            }
            res.json({
                data,
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
    getCount: async (req, res) => {
        try {
            const [countResult] = await phimService.getCount()
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
    getAllDangChieuAndSapChieu: async (req, res) => {
        try {
            const [rows] = await phimService.getAllDangChieuAndSapChieu()
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
            const [a, b] = await Promise.all([
                await phimService.getById(id),
                await phimService.getTheLoaiByMaPhim(id)
            ])

            const [rows] = a
            const [theloai] = b

            res.json({
                data: rows[0],
                theloai,
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
    getTheLoaiByMaPhim: async (req, res) => {
        try {
            const { id } = req.params
            const [rows] = await phimService.getTheLoaiByMaPhim(id)
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
    create: async (req, res) => {
        try {
            const { tenPhim, poster, trailer, noidung, thoiluong, daodien, 
                namSX, ngayKC, dotuoiQD, quocgia, dsTheLoai } = req.body
          
            const [rows] = await phimService.create({
                tenPhim, poster, trailer, noidung, thoiluong, daodien, namSX, ngayKC, dotuoiQD, quocgia
            })
            if (rows?.affectedRows) {
                const maPhim = rows.insertId
                for(let i = 0; i < dsTheLoai.length; i++) {
                    await phimService.addPhimThuocTheLoai(maPhim, dsTheLoai[i].maTheLoai)
                }
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
            const { tenPhim, poster, trailer, noidung, thoiluong, daodien, 
                namSX, ngayKC, dotuoiQD, quocgia, dsTheLoai } = req.body
            const { maPhim } = req.params

            // Cap nhat thong tin phim
            const [rows] = await phimService.update(maPhim, {
                tenPhim, poster, trailer, noidung, thoiluong, daodien, namSX, ngayKC, dotuoiQD, quocgia
            })
            if (rows?.affectedRows) {
                // ds The loai dang luu trong DB
                const [dsTheLoaiBefore] = await phimService.getTheLoaiByMaPhim(maPhim)
                for (let i = 0; i < dsTheLoaiBefore.length; i++) {
                    const found = dsTheLoai.find(tl => tl['maTheLoai'] === dsTheLoaiBefore[i]['ma_theloai'])
                    if (!found) {
                        await phimService.removePimThuocTheLoai(maPhim, dsTheLoaiBefore[i]['ma_theloai'])
                    }
                }

                for (let i = 0; i < dsTheLoai.length; i++) {
                    const found = dsTheLoaiBefore.find(tl => tl['ma_theloai'] === dsTheLoai[i]['maTheLoai'])
                    if (!found) {
                        await phimService.addPhimThuocTheLoai(maPhim, dsTheLoai[i]['maTheLoai'])
                    }
                }

                res.json({
                    data: rows,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Không tìm thấy phim!!"
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
    //         const { result, error } = await theloaiService.delete(id)

    //         if (error) return res.json({ status: "error", error })

    //         if (result?.affectedRows) {
    //             res.json({
    //                 data: result,
    //                 message: "Ok",
    //             })
    //         } else {
    //             res.json({
    //                 status: "error",
    //                 error: "Không tìm thấy thể loại phim!!"
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

module.exports = phimController