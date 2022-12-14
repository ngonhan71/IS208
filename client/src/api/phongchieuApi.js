import axiosClient from "./axiosClient"

const phongchieuApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'phongchieu/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getGhe: (maPhongChieu) => {
        const url = `phongchieu/${maPhongChieu}/ds-ghe`
        return axiosClient.get(url)
    },
    getById: (maPhongChieu) => {
        const url = `phongchieu/${maPhongChieu}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `phongchieu/`
        return axiosClient.post(url, data)
    },
    importDanhSachGhe: (maPhongChieu, data, options) => {
        const url = `phongchieu/${maPhongChieu}/import-excel`
        return axiosClient.post(url, data, options)
    },
    update: (maPhongChieu, data) => {
        const url = `phongchieu/${maPhongChieu}`
        return axiosClient.put(url, data)
    },
}

export default phongchieuApi