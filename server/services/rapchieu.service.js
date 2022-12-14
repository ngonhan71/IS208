const pool = require("../database/index")

const rapchieuService = {
    getAll: async () => {
        return await pool.query("select * from rapchieu")
    },
    getThanhPho: async () => {
        return await pool.query("select distinct thanhpho from rapchieu")
    },
    getByThanhPho: async (thanhpho) => {
        return await pool.query("select * from rapchieu where thanhpho = ?", [thanhpho])
    },
    getById: async (maRapChieu) => {
        return await pool.query("select * from rapchieu where ma_rapchieu = ?", [maRapChieu])
    },
    create: async ({tenRapChieu, diachi, thanhpho, dienthoai}) => {
        const sql = "insert into rapchieu (ten_rapchieu, diachi, thanhpho, dienthoai) values (?, ?, ?, ?)"
        return await pool.query(sql, [tenRapChieu, diachi, thanhpho, dienthoai])
    },
    update: async (maRapChieu, {tenRapChieu, diachi, thanhpho, dienthoai}) => {
        const sql = "update rapchieu set ten_rapchieu = ?, diachi = ?, thanhpho = ?, dienthoai = ? where ma_rapchieu = ?"
        return await pool.query(sql, [tenRapChieu, diachi, thanhpho, dienthoai, maRapChieu])
      
    }, 
    delete: async (maRapChieu) => {
        return await pool.query("delete from rapchieu where ma_rapchieu = ?", [maRapChieu])
    }

}

module.exports = rapchieuService