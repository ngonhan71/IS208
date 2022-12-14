const pool = require("../database/index")

const phongchieuService = {
    getAll: async ({maRapChieu}) => {
        const query = ""
        const params = []
        if (maRapChieu) {
            query += " and phongchieu.ma_rapchieu = ?"
            params.push(maRapChieu)
        }
        const sql = `     select phongchieu.*, ten_rapchieu from phongchieu, rapchieu 
                        where phongchieu.ma_rapchieu = rapchieu.ma_rapchieu ${query} order by ten_rapchieu, ten_phongchieu`
        
        return await pool.query(sql, params)
    },
    getById: async (maPhongChieu) => {
        return await pool.query("select * from phongchieu where ma_phongchieu = ?", [maPhongChieu])
      
    },
    getByName: async ({tenPhongChieu, maRapChieu}) => {
        const sql = "select * from phongchieu where ten_phongchieu = ? and ma_rapchieu = ?"
        return await pool.query(sql, [tenPhongChieu, maRapChieu])
        
    },
    create: async ({tenPhongChieu, maRapChieu}) => {
        const sql = "insert into phongchieu (ten_phongchieu, ma_rapchieu) values (?, ?)"
        return await pool.query(sql, [tenPhongChieu, maRapChieu])
       
    },
    update: async (maPhongChieu, {tenPhongChieu, maRapChieu}) => {
        const sql = "update phongchieu set ten_phongchieu = ?, ma_rapchieu = ? where ma_phongchieu = ?"
        return await pool.query(sql, [tenPhongChieu, maRapChieu, maPhongChieu])
    }, 
    delete: async (maPhongChieu) => {
        return await pool.query("delete from phongchieu where ma_phongchieu = ?", [maPhongChieu])
    }

}

module.exports = phongchieuService