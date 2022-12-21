import axiosClient from "./axiosClient"

const ngayleApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'ngayle/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getById: (id) => {
        const url = `ngayle/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `ngayle/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `ngayle/${id}`
        return axiosClient.put(url, data)
    },
    delete: (id) => {
        const url = `ngayle/${id}`
        return axiosClient.delete(url)
    },
}

export default ngayleApi