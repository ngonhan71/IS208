const pool = require("../database/index")

const ngayleService = {
    getAll: async () => {
        return await pool.query("select * from ngayle")
      
    },
    getAllCurrent: async () => {
        const sql = `   select * from ngayle 
                        where ngayle.loai = "codinh" or 
                        (ngayle.loai="linhdong" and (year(ngayle.ngay) = YEAR(CURDATE()) or year(ngayle.ngay) = YEAR(CURDATE()) + 1 ) )`
        return await pool.query(sql)
      
    },
    getById: async (maNgayLe) => {
        return await pool.query("select * from ngayle where ma_ngayle = ?", [maNgayLe])
       
    },
    create: async ({tenNgayLe, loai, ngay}) => {
        const sql = "insert into ngayle (ten_ngayle, loai, ngay) values (?, ?, ?)"
        return await pool.query(sql, [tenNgayLe, loai, ngay])

    },
    update: async (maNgayLe, {tenNgayLe, loai, ngay}) => {
        const sql = "update ngayle set ten_ngayle = ?, loai = ?, ngay = ? where ma_ngayle = ?"
        return await pool.query(sql, [tenNgayLe, loai, ngay, maNgayLe])
      
    }, 
    delete: async (maNgayLe) => {
        return await pool.query("delete from ngayle where ma_ngayle = ?", [maNgayLe])
       
    }

}

module.exports = ngayleService