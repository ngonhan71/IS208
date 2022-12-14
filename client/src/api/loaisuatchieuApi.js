import axiosClient from "./axiosClient"

const loaisuatchieuApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'loaisuatchieu/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getAllAddSc: ({page = 1, limit = 10,}) => {
        const url = 'loaisuatchieu/them-sc'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getById: (id) => {
        const url = `loaisuatchieu/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `loaisuatchieu/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `loaisuatchieu/${id}`
        return axiosClient.put(url, data)
    },
}

export default loaisuatchieuApi