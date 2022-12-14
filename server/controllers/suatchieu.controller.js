const suatchieuService = require('../services/suatchieu.service')
const phimService = require('../services/phim.service')
const loaisuatchieuService = require('../services/loaisuatchieu.service')
const ngayleService = require('../services/ngayle.service')

const suatchieuController = {
    getAll: async (req, res) => {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 10
            const { maPhim, maPhongChieu } = req.query
            const offset = (page - 1) * limit

            const [a, b] = await Promise.all([
                suatchieuService.getCount({maPhim, maPhongChieu}),
                suatchieuService.getAll({limit, offset, maPhim, maPhongChieu})
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
    getAllByPhimAndRapChieu: async (req, res) => {
        try {
            const { maPhim, maRapChieu } = req.query
            const [result] = await suatchieuService.getAllByPhimAndRapChieu({maPhim, maRapChieu})
       
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
    getAllByPhim: async (req, res) => {
        try {
            const { maPhim } = req.query
            const [result] = await suatchieuService.getAllByPhim({maPhim})
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
    getByMaPhongChieuAndNgayChieu: async (req, res) => {
        try {
            const { maPhongChieu, ngayChieu } = req.query
            const [result] = await suatchieuService.getByMaPhongChieuAndNgayChieu(maPhongChieu, ngayChieu)
       
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
            const [result] = await suatchieuService.getById(id)
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
    getByIdMobile: async (req, res) => {
        try {
            const { id } = req.params
            const [result] = await suatchieuService.getByIdMobile(id)
            const suatChieu = result[0]
            const { ngay_chieu: ngayChieu } = suatChieu

            const nc = new Date(ngayChieu).toLocaleDateString("en-GB")
           
            const [dsNgayLe] = await ngayleService.getAllCurrent()

            let isNgayLe = false
            let tenNgayLe = ""
            dsNgayLe.forEach(item => {
                const ngayConvert = new Date(item.ngay).toLocaleDateString("en-GB")
                if (item.loai === "linhdong" && nc === ngayConvert) {
                    isNgayLe = true
                    tenNgayLe = item.ten_ngayle
                    return
                } 
                if (item.loai === "codinh") {
                    const [thang, ngay] = item.ngay.split("-")
                     if (+ngay === new Date(ngayChieu).getDate() && +thang === new Date(ngayChieu).getMonth()  + 1) {
                        isNgayLe = true
                        tenNgayLe = item.ten_ngayle
                        return
                     }
                }
            })

            let giaNgayLe = 0
            if (isNgayLe) {
                const [lscNgayLe] = await loaisuatchieuService.getNgayLe()
                giaNgayLe = lscNgayLe[0]['gia']           
            }

            res.json({
                data: suatChieu,
                message: "Ok",
                nc,
                isNgayLe,
                giaNgayLe,
                tenNgayLe
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
            const { maRapChieu } = req.query
            const [result] = await suatchieuService.getCountLifeTime({maRapChieu})
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
    create: async (req, res) => {
        try {
            const { gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu } = req.body

            const [phim] = await phimService.getById(maPhim)
            if (phim[0] && new Date(ngayChieu) < new Date(phim[0].ngay_khoichieu)) {
                return res.json({ error: "Ng??y chi???u ph???i >= ng??y kh???i chi???u!!!" })
            }

            const [lsc] = await loaisuatchieuService.getById(maLoaiSuatChieu)
            const { gio_batdau, gio_ketthuc, thu } = lsc[0]
            if (!(gioChieu >= gio_batdau && gioChieu < gio_ketthuc)) {
                return res.json({ 
                    error: `Gi??? chi???u kh??ng ph?? h???p lo???i su???t chi???u. B???t ?????u ${gio_batdau} - K???t th??c ${gio_ketthuc}!!!` 
                })
            }
            const day = new Date(ngayChieu).getDay()
            if (thu !== day) {
                const weekday = ["Ch??? nh???t","Th??? 2","Th??? 3","Th??? 4","Th??? 5","Th??? 6","Th??? 7"]
                return res.json({ error: `Ng??y chi???u kh??ng ph?? h???p v???i lo???i su???t chi???u. Ng??y chi???u ph???i l?? ${weekday[thu]}!!!` })
            }

            // kiem tra lsc
 
            const [dsSuatChieuHT] = await suatchieuService.getByMaPhongChieuAndNgayChieu(maPhongChieu, ngayChieu)
            const ngaygioChieuMoiTime = new Date(`${ngayChieu} ${gioChieu}`).getTime()
            for(let i = 0; i < dsSuatChieuHT.length; i++) {
                const thoiluongPhim = dsSuatChieuHT[i].thoiluong * 60000

                const nc = new Date(dsSuatChieuHT[i].ngay_chieu).toDateString()
                const ngaygioChieu = new Date(`${nc} ${dsSuatChieuHT[i].gio_chieu}`).getTime()

                if (ngaygioChieuMoiTime === ngaygioChieu) {
                    return res.json({ error: `Tr??ng gi??? chi???u. ???? c?? su???t chi???u ${dsSuatChieuHT[i].gio_chieu}!!!` })
                }

                if ((ngaygioChieuMoiTime > ngaygioChieu) 
                    && ngaygioChieuMoiTime < ngaygioChieu + thoiluongPhim + 30 * 60000) {
                    return res.json({ error: `Tr??ng gi??? chi???u. ???? c?? su???t chi???u ${dsSuatChieuHT[i].gio_chieu}!!!` })
                }
                // them vao truoc
                if ((ngaygioChieuMoiTime < ngaygioChieu)
                    && ngaygioChieuMoiTime + thoiluongPhim + 30 * 60000 >= ngaygioChieu) {
                    return res.json({ error: `Tr??ng gi??? chi???u. ???? c?? su???t chi???u ${dsSuatChieuHT[i].gio_chieu}!!!` })
                }
            }
            // return res.json({message : "OK"})
            const [result] = await suatchieuService.create({
                gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu
            })
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
            const { gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu } = req.body
            const { id } = req.params

            const [phim] = await phimService.getById(maPhim)
            if (phim[0] && new Date(ngayChieu) < new Date(phim[0].ngay_khoichieu)) {
                return res.json({ error: "Ng??y chi???u ph???i >= ng??y kh???i chi???u!!!" })
            }

            const [lsc] = await loaisuatchieuService.getById(maLoaiSuatChieu)
            const { gio_batdau, gio_ketthuc, thu } = lsc[0]
            if (!(gioChieu >= gio_batdau && gioChieu < gio_ketthuc)) {
                return res.json({ 
                    error: `Gi??? chi???u kh??ng ph?? h???p lo???i su???t chi???u. B???t ?????u ${gio_batdau} - K???t th??c ${gio_ketthuc}!!!` 
                })
            }
            const day = new Date(ngayChieu).getDay()
            if (thu !== day) {
                const weekday = ["Ch??? nh???t","Th??? 2","Th??? 3","Th??? 4","Th??? 5","Th??? 6","Th??? 7"]
                return res.json({ error: `Ng??y chi???u kh??ng ph?? h???p v???i lo???i su???t chi???u. Ng??y chi???u ph???i l?? ${weekday[thu]}!!!` })
            }

            const [dsSuatChieuHT] = await suatchieuService.getByMaPhongChieuAndNgayChieu(maPhongChieu, ngayChieu)
            const ngaygioChieuMoiTime = new Date(`${ngayChieu} ${gioChieu}`).getTime()
            for(let i = 0; i < dsSuatChieuHT.length; i++) {
                const thoiluongPhim = dsSuatChieuHT[i].thoiluong * 60000

                if (dsSuatChieuHT[i].ma_suatchieu === +id) continue
                const nc = new Date(dsSuatChieuHT[i].ngay_chieu).toDateString()
                const ngaygioChieu = new Date(`${nc} ${dsSuatChieuHT[i].gio_chieu}`).getTime()

                if (ngaygioChieuMoiTime === ngaygioChieu) {
                    return res.json({ error: `Tr??ng gi??? chi???u. ???? c?? su???t chi???u ${dsSuatChieuHT[i].gio_chieu}!!!` })
                }

                if ((ngaygioChieuMoiTime > ngaygioChieu) 
                    && ngaygioChieuMoiTime < ngaygioChieu + thoiluongPhim + 30 * 60000) {
                    return res.json({ error: `Tr??ng gi??? chi???u. ???? c?? su???t chi???u ${dsSuatChieuHT[i].gio_chieu}!!!` })
                }
                // them vao truoc
                if ((ngaygioChieuMoiTime < ngaygioChieu)
                    && ngaygioChieuMoiTime + thoiluongPhim + 30 * 60000 >= ngaygioChieu) {
                    return res.json({ error: `Tr??ng gi??? chi???u. ???? c?? su???t chi???u ${dsSuatChieuHT[i].gio_chieu}!!!` })
                }
            }
            const [result] = await suatchieuService.update(id, {
                gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu
            })

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Kh??ng t??m th???y su???t chi???u!!"
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
            const [result] = await suatchieuService.delete(id)

            if (result?.affectedRows) {
                res.json({
                    data: result,
                    message: "Ok",
                })
            } else {
                res.json({
                    status: "error",
                    error: "Kh??ng t??m th???y su???t chi???u!!"
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

module.exports = suatchieuController