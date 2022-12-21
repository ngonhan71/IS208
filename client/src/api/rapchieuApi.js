import axiosClient from "./axiosClient"

const rapchieuApi = {
    getAll: () => {
        const url = 'rapchieu/'
        return axiosClient.get(url)
    },
    getThanhPho: () => {
        const url = 'rapchieu/thanhpho'
        return axiosClient.get(url)
    },
    getById: (id) => {
        const url = `rapchieu/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `rapchieu/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `rapchieu/${id}`
        return axiosClient.put(url, data)
    },
    delete: (id) => {
        const url = `rapchieu/${id}`
        return axiosClient.delete(url)
    },
}

export default rapchieuApi