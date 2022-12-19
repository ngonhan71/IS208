import axiosClient from "./axiosClient"

const suatchieuApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'suatchieu/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getByMaPhongChieuAndNgayChieu: ({maPhongChieu, ngayChieu}) => {
        const url = 'suatchieu/phongchieu-ngaychieu'
        return axiosClient.get(url, { params: {maPhongChieu, ngayChieu}})
    },
    getByPhim: (maPhim) => {
        const url = 'suatchieu/phim'
        return axiosClient.get(url, { params: {maPhim}})
    },
    getById: (id) => {
        const url = `suatchieu/${id}/mobile`
        return axiosClient.get(url)
    },
    getCountLifeTime: ({maRapChieu}) => {
        const url = 'suatchieu/chart/count'
        return axiosClient.get(url, { params: {maRapChieu}})
    },
    create: (data) => {
        const url = `suatchieu/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `suatchieu/${id}`
        return axiosClient.put(url, data)
    },
}

export default suatchieuApi