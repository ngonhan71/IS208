import axiosClient from "./axiosClient"

const phimApi = {
    getAll: ({page = 1, limit = 10, key = ""}) => {
        const url = 'phim/'
        return axiosClient.get(url, { params: {page, limit, key}})
    },
    getCount: () => {
        const url = 'phim/count'
        return axiosClient.get(url)
    },
    getAllDangChieuAndSapChieu: () => {
        const url = 'phim/dangchieu-sapchieu'
        return axiosClient.get(url)
    },
    getById: (id) => {
        const url = `phim/${id}`
        return axiosClient.get(url)
    },
    getTheLoai: (id) => {
        const url = `phim/${id}/theloai`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `phim/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `phim/${id}`
        return axiosClient.put(url, data)
    },
}

export default phimApi