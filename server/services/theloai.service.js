const pool = require("../database/index")

const theloaiService = {
    getAll: async () => {
        return await pool.query("select * from theloai")
    },
    getById: async (maTheLoai) => {
        return await pool.query("select * from theloai where ma_theloai = ?", [maTheLoai])
     
    },
    create: async ({tenTheLoai}) => {
        const sql = "insert into theloai (ten_theloai) values (?)"
        return await pool.query(sql, [tenTheLoai])
    },
    update: async (maTheLoai, {tenTheLoai}) => {
        const sql = "update theloai set ten_theloai = ? where ma_theloai = ?"
        return await pool.query(sql, [tenTheLoai, maTheLoai])
    }, 
    delete: async (maTheLoai) => {
        return await pool.query("delete from theloai where ma_theloai = ?", [maTheLoai])
    }
}

module.exports = theloaiService