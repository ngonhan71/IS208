const pool = require("../database/index")

const loaisuatchieuService = {
    getAll: async () => {
        return await pool.query("select * from loaisuatchieu")
     
    },
    getAllAddSC: async () => {
        return await pool.query("select * from loaisuatchieu where thu != 7")
     
    },
    getByInfo: async ({maLoaiSuatChieu, tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia}) => {
        let sql = `   select * from loaisuatchieu where ten_loaisuatchieu = ? 
                        and gio_batdau = ? and gio_ketthuc = ? and thu = ? and gia = ?`
        if (maLoaiSuatChieu) sql += ` and ma_loaisuatchieu != ?`
        return await pool.query(sql, [tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia, maLoaiSuatChieu])
      
    },
    getById: async (maLoaiSuatChieu) => {
        return await pool.query("select * from loaisuatchieu where ma_loaisuatchieu = ?", [maLoaiSuatChieu])
    },
    getNgayLe: async () => {
        return await pool.query("select * from loaisuatchieu where thu = 7")
    },
    create: async function ({tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia}) {
        const sql = "insert into loaisuatchieu (ten_loaisuatchieu, gio_batdau, gio_ketthuc, thu, gia) values (?,?,?,?,?)"
        return await pool.query(sql, [tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia])
    },
    update: async function (maLoaiSuatChieu, {tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia}) {
        const sql = `   update loaisuatchieu set ten_loaisuatchieu = ?, gio_batdau = ?, gio_ketthuc = ?,
                        thu = ?, gia = ? where ma_loaisuatchieu = ?`
        return await pool.query(sql, [tenLoaiSuatChieu, gioBatDau, gioKetThuc, thu, gia, maLoaiSuatChieu])
    }, 
    delete: async (maLoaiSuatChieu) => {
        return await pool.query("delete from loaisuatchieu where ma_loaisuatchieu = ?", [maLoaiSuatChieu])
      
    }

}

module.exports = loaisuatchieuService