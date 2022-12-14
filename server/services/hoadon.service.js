const pool = require("../database/index")

const hoadonService = {
    getAll: async ({limit = 5, offset = 0}) => {
        const sql = `   select hoadon.*, hoadon.trang_thai as ttthanhtoan, nguoidung.*, suatchieu.*,  ten_phim, poster, ten_phongchieu, ten_rapchieu
                        from hoadon, phim, suatchieu, ve, phongchieu, rapchieu, nguoidung
                        where hoadon.ma_hoadon = ve.ma_hoadon
                        and ve.ma_suatchieu = suatchieu.ma_suatchieu
                        and suatchieu.ma_phim = phim.ma_phim
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and rapchieu.ma_rapchieu = phongchieu.ma_rapchieu
                        and hoadon.ma_nguoidung = nguoidung.ma_nguoidung
                        group by hoadon.ma_hoadon
                        order by ngay_mua desc
                        limit ? offset ?`
        return await pool.query(sql, [limit, offset])
    },
    getById: async (maHoaDon) => {
        const sql = `   select ve.*, ghe.*, loaighe.ten_loaighe
                        from hoadon, ve, ghe, loaighe
                        where hoadon.ma_hoadon = ve.ma_hoadon
                        and ve.ma_ghe = ghe.ma_ghe
                        and ghe.ma_loaighe = loaighe.ma_loaighe
                        and hoadon.ma_hoadon = ?`
        return await pool.query(sql, [maHoaDon])
    },
    getByUserId: async (maNguoiDung) => {
        const sql = `   select hoadon.*, suatchieu.*,  ten_phim, poster, ten_phongchieu, ten_rapchieu
			            from hoadon, phim, suatchieu, ve, phongchieu, rapchieu
                        where hoadon.ma_hoadon = ve.ma_hoadon
                        and ve.ma_suatchieu = suatchieu.ma_suatchieu
                        and suatchieu.ma_phim = phim.ma_phim
			            and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and rapchieu.ma_rapchieu = phongchieu.ma_rapchieu
                        and hoadon.ma_nguoidung = ?
                        group by hoadon.ma_hoadon
			            order by ngay_mua desc`
        return await pool.query(sql, [maNguoiDung])
    },
    getCount: async () => {
        const sql = `select count(*) as count from hoadon`
        return await pool.query(sql)
    },
    getRevenue: async () => {
        const sql = `select sum(trigia) as revenue from hoadon WHERE trang_thai = 1`
        return await pool.query(sql)
    },
    create: async ({maNguoiDung, triGia, thanhtoan = "", maThanhToan}) => {
        const sql = "insert into hoadon (ma_nguoidung, trigia, thanhtoan, ma_thanhtoan) values (?, ?, ?, ?)"
        return await pool.query(sql, [maNguoiDung, triGia, thanhtoan, maThanhToan])
    },
    createDetail: async ({maHoaDon, maSuatChieu, maGhe, triGia}) => {
        const sql = "insert into ve (ma_hoadon, ma_suatchieu, ma_ghe, trigia) values (?, ?, ?, ?)"
        return await pool.query(sql, [maHoaDon, maSuatChieu, maGhe, triGia])
    },
    updateQRCodeVe: async (maVe, {qrcode, public_id}) => {
        const sql = "update ve set qrcode = ?, public_id = ? where ma_ve = ?"
        return await pool.query(sql, [qrcode, public_id, maVe])
    }, 
    updateStatus: async (maThanhToan, {trangThai, thanhtoan, transId}) => {
        const sql = "update hoadon set trang_thai = ?, thanhtoan = ?, transId = ? where ma_thanhtoan = ?"
        return await pool.query(sql, [trangThai, thanhtoan, transId, maThanhToan])
    }, 
    updateMaThanhToan: async (maHoaDon, {maThanhToan}) => {
        const sql = "update hoadon set ma_thanhtoan = ? where ma_hoadon = ?"
        return await pool.query(sql, [maThanhToan, maHoaDon])
    }, 
    getRevenueLifeTime: async ({maRapChieu}) => {
        const params = []
        let sql = `     select sum(ve.trigia) as trigia, DATE(ngay_mua) as ngay_mua from hoadon, ve, suatchieu, phongchieu, rapchieu 
                        where trang_thai = 1
                        and hoadon.ma_hoadon = ve.ma_hoadon
                        and ve.ma_suatchieu = suatchieu.ma_suatchieu
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu`
        if (maRapChieu) {
            sql += ` and rapchieu.ma_rapchieu = ?`
            params.push(maRapChieu)
        }
        sql += `    group by DATE(ngay_mua)
                    order by DATE(ngay_mua)`
        return await pool.query(sql, params)
    },
    getCountLifeTime: async () => {
        const sql = `   select count(*) as count, DATE(ngay_mua) as ngay_mua from hoadon 
                        where trang_thai = 1 
                        group by DATE(ngay_mua)
                        order by DATE(ngay_mua)`
        return await pool.query(sql)
    },
    getPhimBanChayBySoLuong: async ({maRapChieu}) => {
        const params = []
        let sql = `     SELECT phim.ma_phim, phim.ten_phim, count(*) as value from ve, suatchieu, phim, phongchieu, rapchieu
                        where ve.ma_suatchieu = suatchieu.ma_suatchieu
                        and suatchieu.ma_phim = phim.ma_phim
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu`
        if (maRapChieu) {
            sql += ` and rapchieu.ma_rapchieu = ?`
            params.push(maRapChieu)
        }
        sql += `    GROUP by phim.ma_phim
                    order by count(*) desc`
        return await pool.query(sql, [maRapChieu])
    },
    getPhimBanChayByGia: async ({maRapChieu}) => {
        const params = []
        let sql = `     SELECT phim.ma_phim, phim.ten_phim, sum(ve.trigia) as value from ve, suatchieu, phim, phongchieu, rapchieu
                        where ve.ma_suatchieu = suatchieu.ma_suatchieu
                        and suatchieu.ma_phim = phim.ma_phim
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu`
        if (maRapChieu) {
            sql += ` and rapchieu.ma_rapchieu = ?`
            params.push(maRapChieu)
        }
        sql += `    GROUP by phim.ma_phim
                    order by sum(ve.trigia) desc`
        return await pool.query(sql, [maRapChieu])
    },
    getRapChieuBanChayTheoGia: async () => {
        const sql = `   SELECT rapchieu.ma_rapchieu, rapchieu.ten_rapchieu, sum(ve.trigia) as value 
                        from ve, suatchieu, phongchieu, rapchieu 
                        where ve.ma_suatchieu = suatchieu.ma_suatchieu 
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu 
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu 
                        GROUP by rapchieu.ma_rapchieu 
                        order by sum(ve.trigia) desc`
        return await pool.query(sql)
    },
    getRapChieuBanChayTheoSoLuong: async () => {
        const sql = `   SELECT rapchieu.ma_rapchieu, rapchieu.ten_rapchieu, count(*) as value 
                        from ve, suatchieu, phongchieu, rapchieu 
                        where ve.ma_suatchieu = suatchieu.ma_suatchieu 
                        and suatchieu.ma_phongchieu = phongchieu.ma_phongchieu 
                        and phongchieu.ma_rapchieu = rapchieu.ma_rapchieu 
                        GROUP by rapchieu.ma_rapchieu 
                        order by count(*) desc`
        return await pool.query(sql)
    },
    // delete: async (maTheLoai) => {
    //     return await pool.query("delete from theloai where ma_theloai = ?", [maTheLoai])
    // }
}

module.exports = hoadonService