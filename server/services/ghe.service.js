const pool = require("../database/index")

const gheService = {
    getAll: async () => {
        let sql = `select * from ghe, loai_ghe`
        return await pool.query("select * from ghe")
    },
    getById: async (maGhe) => {
        return await pool.query("select * from ghe where ma_ghe = ?", [maGhe])
    },
    getByMaPhongChieu: async (maPhongChieu) => {
        const sql = "select * from ghe, loaighe where ma_phongchieu = ? and ghe.ma_loaighe = loaighe.ma_loaighe"
        return await pool.query(sql, [maPhongChieu])
       
    },
    getHangByMaPhongChieu: async (maPhongChieu) => {
        const sql = "select distinct hang from ghe where ma_phongchieu = ? order by hang"
        return await pool.query(sql, [maPhongChieu])
    },
    getMaxThuTuByMaPhongChieu: async (maPhongChieu) => {
        const sql = "select max(thutu) as thutu_toida from ghe where ma_phongchieu = ?"
        return await pool.query(sql, [maPhongChieu])
        
    },
    getDaBanByMaSuatChieu: async (maSuatChieu) => {
        const sql = `   select ve.ma_ghe from suatchieu, ve 
                        where suatchieu.ma_suatchieu = ? and suatchieu.ma_suatchieu = ve.ma_suatchieu;`
      
        return await pool.query(sql, [maSuatChieu])
    },
    getByInfo: async ({hang, thutu, maPhongChieu}) => {
        const sql = "select * from ghe where hang = ? and thutu = ? and ma_phongchieu =  ?"
        return await pool.query(sql, [hang, thutu, maPhongChieu])
        
    },
    create: async function ({ hang, thutu, maLoaiGhe, maPhongChieu }) {
        const sql = "insert into ghe (hang, thutu, ma_loaighe, ma_phongchieu) values (?, ?, ?, ?)"
        return await pool.query(sql, [hang, thutu, maLoaiGhe, maPhongChieu])
    },
    delete: async (maGhe) => {
        return await pool.query("delete from ghe where ma_ghe = ?", [maGhe])
    }

}

module.exports = gheService