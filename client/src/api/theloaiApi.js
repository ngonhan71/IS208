import axiosClient from "./axiosClient"

const theloaiApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'theloai/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getById: (id) => {
        const url = `theloai/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `theloai/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `theloai/${id}`
        return axiosClient.put(url, data)
    },
}

export default theloaiApi