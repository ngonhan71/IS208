const pool = require("../database/index")

const nguoidungService = {
    getAll: async () => {
        const sql = "select * from nguoidung"
        return await pool.query(sql)
    },
    getAllKH: async () => {
        const sql = "select * from nguoidung where role = 0"
        return await pool.query(sql)
    },
    getById: async (id) => {
        const sql = "select * from nguoidung where ma_nguoidung = ?"
        return await pool.query(sql, [id])
    },
    getByEmail: async (email) => {
        const sql = "select * from nguoidung where email = ? "
        return await pool.query(sql, [email])
        
    },
    getByPhone: async (dienthoai) => {
        const sql = "select * from nguoidung where dienthoai = ? "
        return await pool.query(sql, [dienthoai])
    },
    create: async ({tenNguoiDung, dienthoai, email, matkhau}) => {
        const sql = `   insert into nguoidung (ten_nguoidung, dienthoai, email, matkhau) 
                        values (?, ?, ?, ?) `
        return await pool.query(sql, [tenNguoiDung, dienthoai, email, matkhau])
    },
    updateStatus: async (maNguoiDung, {trangthai}) => {
        const sql = "update nguoidung set trang_thai = ? where ma_nguoidung = ?"
        return await pool.query(sql, [trangthai, maNguoiDung])
    },
    // update: async (maSuatChieu, {gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu}) => {
    //     try {
    //         const sql = `   update suatchieu set gio_chieu = ?, ngay_chieu = ?, ma_phongchieu = ?,
    //                         ma_phim = ?, ma_loaisuatchieu = ?
    //                         where ma_suatchieu = ?
    //                         `
    //          return await pool.query(sql, [gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu, maSuatChieu])
    //         return { result: rows, error: null }
    //     } catch (error) {
    //         console.log(error)
    //         return { error: error.message }
    //     }
    // }, 
    // delete: async (maSuatChieu) => {
    //     try {
    //          return await pool.query("delete from suatchieu where ma_suatchieu = ?", [maSuatChieu])
    //         return { result: rows, error: null }
    //     } catch (error) {
    //         console.log(error)
    //         return { error: error.message }
    //     }
    // }

}

module.exports = nguoidungService