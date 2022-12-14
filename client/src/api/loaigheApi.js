import axiosClient from "./axiosClient"

const loaigheApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'loaighe/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getById: (id) => {
        const url = `loaighe/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `loaighe/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `loaighe/${id}`
        return axiosClient.put(url, data)
    },
}

export default loaigheApi