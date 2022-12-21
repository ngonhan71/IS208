const pool = require("../database/index")

const phimService = {
    getAll: async () => {
        return await pool.query("select * from phim order by ngay_khoichieu desc")
    },
    getCount: async () => {
        return await pool.query("select count(*) as count from phim")
    },
    search: async ({key = ""}) => {
        return await pool.query(`select * from phim where phim.ten_phim like ? order by ngay_khoichieu desc`, [key])
    },
    getAllDangChieuAndSapChieu: async () => {
        const sql = `   SELECT phim.* FROM phim, suatchieu 
                        where (phim.ngay_khoichieu <= CURRENT_DATE() and suatchieu.ma_phim = phim.ma_phim and suatchieu.ngay_chieu >= CURRENT_DATE()) 
                        or (phim.ngay_khoichieu >= CURRENT_DATE())
                        GROUP by phim.ma_phim, ten_phim
                        order by phim.ngay_khoichieu desc`
        return await pool.query(sql)
    },
    getById: async (maPhim) => {
        const sql = `select * from phim where phim.ma_phim = ?`
        return await pool.query(sql, [maPhim])
    },
    getTheLoaiByMaPhim: async (maPhim) => {
        const sql = `   select * from theloai, phim_theloai
                        where phim_theloai.ma_phim = ? and theloai.ma_theloai = phim_theloai.ma_theloai`
        return await pool.query(sql, [maPhim])
    },
    create: async ({tenPhim, poster, trailer, noidung, thoiluong, daodien, namSX, ngayKC, dotuoiQD, quocgia}) => {
        const sql = `   insert into phim (ten_phim, poster, trailer, noidung, thoiluong, 
                        daodien, nam_sx, ngay_khoichieu, dotuoi_quydinh, quocgia) 
                        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        return await pool.query(sql, 
            [tenPhim, poster, trailer, noidung, thoiluong, daodien, namSX, ngayKC, dotuoiQD, quocgia])
    },
    addPhimThuocTheLoai: async (maPhim, maTheLoai) => {
        const sql = "insert into phim_theloai (ma_phim, ma_theloai) values (?, ?)"
        return await pool.query(sql, [maPhim, maTheLoai])
    },
    removePimThuocTheLoai: async (maPhim, maTheLoai) => {
        const sql = "delete from phim_theloai where ma_phim = ? and ma_theloai = ?"
        return await pool.query(sql, [maPhim, maTheLoai])
    },
    update: async (maPhim, {tenPhim, poster, trailer, noidung, thoiluong, daodien, namSX, ngayKC, dotuoiQD, quocgia}) => {
        const sql = `   update phim set ten_phim = ?, poster = ?, trailer = ?, noidung = ?, thoiluong = ?, daodien = ?,
                        nam_sx = ?, ngay_khoichieu = ?, dotuoi_quydinh = ?, quocgia = ?
                        where ma_phim = ?`
        return await pool.query(sql, 
            [tenPhim, poster, trailer, noidung, thoiluong, daodien, namSX, ngayKC, dotuoiQD, quocgia, maPhim])
    }, 
}

module.exports = phimService