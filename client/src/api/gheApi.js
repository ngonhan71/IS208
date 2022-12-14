import axiosClient from "./axiosClient"

const gheApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'ghe/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getAllByMaPhongChieu: (maPhongChieu) => {
        const url = `ghe/phongchieu/${maPhongChieu}`
        return axiosClient.get(url)
    },
    getAllDaBan: (maSuatChieu) => {
        const url = `ghe/da-ban/${maSuatChieu}`
        return axiosClient.get(url)
    },
    getById: (id) => {
        const url = `ghe/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `ghe/`
        return axiosClient.post(url, data)
    },
    giuGhe: (data) => {
        const url = `ghe/giu-ghe`
        return axiosClient.post(url, data)
    },
    boChonGhe: (data) => {
        const url = `ghe/bo-chon-ghe`
        return axiosClient.post(url, data)
    },
    boChonTatCaGhe: (data) => {
        const url = `ghe/bo-chon-tat-ca-ghe`
        return axiosClient.post(url, data)
    },
    importExcel: (maPhongChieu, data, options) => {
        const url = `ghe/phongchieu/${maPhongChieu}`
        return axiosClient.post(url, data, options)
    },
    update: (id, data) => {
        const url = `ghe/${id}`
        return axiosClient.put(url, data)
    },
}

export default gheApi