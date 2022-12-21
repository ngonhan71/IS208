import axiosClient from "./axiosClient"

const phongchieuApi = {
    getAll: () => {
        const url = 'phongchieu/'
        return axiosClient.get(url)
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
    delete: (id) => {
        const url = `phongchieu/${id}`
        return axiosClient.delete(url)
    },
}

export default phongchieuApi