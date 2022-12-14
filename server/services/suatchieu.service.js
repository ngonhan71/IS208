const pool = require("../database/index")

const suatchieuService = {
    getAll: async ({limit, offset = 0, maPhim, maPhongChieu}) => {
        let sql = `     select suatchieu.*, ten_phim, thoiluong, loaisuatchieu.*, ten_phongchieu, ten_rapchieu
                        from suatchieu, phongchieu, phim, loaisuatchieu, rapchieu
                        where suatchieu.ma_phim = phim.ma_phim
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and suatchieu.ma_loaisuatchieu = loaisuatchieu.ma_loaisuatchieu
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu`
        const params = []
        if (maPhim) {
            sql += ` and suatchieu.ma_phim = ?`
            params.push(maPhim)
        }
        if (maPhongChieu) {
            sql += ` and suatchieu.ma_phongchieu = ?`
            params.push(maPhongChieu)
        }
        sql += ` order by ma_suatchieu desc`
        if (limit) {
            sql += ` limit ? offset ?`
            params.push(limit, offset)
        }
        return await pool.query(sql, params)
    },
    getAllByPhimAndRapChieu: async ({maPhim, maRapChieu}) => {
        const sql = `   select suatchieu.*, rapchieu.ma_rapchieu, rapchieu.ten_rapchieu, ten_phongchieu, ten_loaisuatchieu
                        from suatchieu, phongchieu, rapchieu, phim, loaisuatchieu
                        where suatchieu.ma_phim = phim.ma_phim
			            and suatchieu.ma_loaisuatchieu = loaisuatchieu.ma_loaisuatchieu
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu
                        and phim.ma_phim = ? and rapchieu.ma_rapchieu in (?) 
                        and (suatchieu.ngay_chieu > CURRENT_DATE() or (suatchieu.ngay_chieu = CURRENT_DATE() 
                        and ADDTIME(CURRENT_TIME(), "00:30:00") < suatchieu.gio_chieu ))`
      
        return await pool.query(sql, [maPhim, maRapChieu])
    },
    getAllByPhim: async ({maPhim}) => {
        const sql = `   select suatchieu.*, rapchieu.ma_rapchieu, rapchieu.ten_rapchieu, ten_phongchieu, ten_loaisuatchieu
                        from suatchieu, phongchieu, rapchieu, phim, loaisuatchieu
                        where suatchieu.ma_phim = phim.ma_phim
			            and suatchieu.ma_loaisuatchieu = loaisuatchieu.ma_loaisuatchieu
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu
                        and phim.ma_phim = ?
                        and (suatchieu.ngay_chieu > CURRENT_DATE() or (suatchieu.ngay_chieu = CURRENT_DATE() 
                        and ADDTIME(CURRENT_TIME(), "00:30:00") < suatchieu.gio_chieu ))`
      
        return await pool.query(sql, [maPhim])
    },
    getCount: async ({maPhim, maPhongChieu}) => {
        let sql = `select count(*) as count from suatchieu where 1`
        const params = []
        if (maPhim) {
            sql += ` and ma_phim = ?`
            params.push(maPhim)
        }
        if (maPhongChieu) {
            sql += ` and ma_phongchieu = ?`
            params.push(maPhongChieu)
        }
        
        return await pool.query(sql, params)
    },
    getById: async (maSuatChieu) => {
        const sql = `   select * from suatchieu, phongchieu, phim, loaisuatchieu
                        where ma_suatchieu = ?
                        and suatchieu.ma_phim = phim.ma_phim
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and suatchieu.ma_loaisuatchieu = loaisuatchieu.ma_loaisuatchieu`
        return await pool.query(sql, [maSuatChieu])
    },
    getOnLySuatChieuById: async (maSuatChieu) => {
        const sql = `   select * from suatchieu where ma_suatchieu = ?`
        return await pool.query(sql, [maSuatChieu])
    },
    getByIdMobile: async (maSuatChieu) => {
        const sql = `   select suatchieu.*, ten_loaisuatchieu, gia, ten_rapchieu from suatchieu, loaisuatchieu, rapchieu, phongchieu 
                        where ma_suatchieu = ? 
                        and suatchieu.ma_loaisuatchieu = loaisuatchieu.ma_loaisuatchieu
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu`
        return await pool.query(sql, [maSuatChieu])
    },
    getByMaPhongChieuAndNgayChieu: async (maPhongChieu, ngayChieu) => {
        const sql = `   select suatchieu.*, phim.thoiluong, phim.ten_phim from suatchieu, phim
                        where ma_phongchieu = ? and ngay_chieu = ? and suatchieu.ma_phim = phim.ma_phim`
        return await pool.query(sql, [maPhongChieu, ngayChieu])
    },
    getCountLifeTime: async () => {
        const sql = `   select count(*) as count, DATE(ngay_chieu) as ngay_chieu from suatchieu 
                        group by DATE(ngay_chieu)
                        order by DATE(ngay_chieu)`
        return await pool.query(sql)
    },
    create: async ({gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu}) => {
        const sql = `   insert into suatchieu (gio_chieu, ngay_chieu, ma_phongchieu, ma_phim, ma_loaisuatchieu) 
                        values (?, ?, ?, ?, ?) `
        return await pool.query(sql, [gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu])
    },
    update: async (maSuatChieu, {gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu}) => {
        const sql = `   update suatchieu set gio_chieu = ?, ngay_chieu = ?, ma_phongchieu = ?,
                        ma_phim = ?, ma_loaisuatchieu = ?
                        where ma_suatchieu = ?
                        `
        return await pool.query(sql, [gioChieu, ngayChieu, maPhongChieu, maPhim, maLoaiSuatChieu, maSuatChieu])
    }, 
    delete: async (maSuatChieu) => {
        return await pool.query("delete from suatchieu where ma_suatchieu = ?", [maSuatChieu])
    }

}

module.exports = suatchieuService