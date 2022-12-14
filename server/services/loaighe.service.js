const pool = require("../database/index")

const loaigheService = {
    getAll: async () => {
        return await pool.query("select * from loaighe")
     
    },
    getById: async (maLoaiGhe) => {
        return await pool.query("select * from loaighe where ma_loaighe = ?", [maLoaiGhe])
      
    },
    create: async ({tenLoaiGhe, soCho, giaCongThem, color}) => {
        const sql = "insert into loaighe (ten_loaighe, socho, gia_congthem, color) values (?, ?, ?, ?)"
        return await pool.query(sql, [tenLoaiGhe, soCho, giaCongThem, color])
    },
    update: async (maLoaiGhe, {tenLoaiGhe, soCho, giaCongThem, color}) => {
        const sql = "update loaighe set ten_loaighe = ?, socho = ?, gia_congthem = ?, color = ? where ma_loaighe = ?"
        return await pool.query(sql, [tenLoaiGhe, soCho, giaCongThem, color, maLoaiGhe])
    }, 
    delete: async (maLoaiGhe) => {
        return await pool.query("delete from loaighe where ma_loaighe = ?", [maLoaiGhe])
    }

}

module.exports = loaigheService