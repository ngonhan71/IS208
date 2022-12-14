import axiosClient from "./axiosClient"

const hoadonApi = {
    getAll: ({page = 1, limit = 10,}) => {
        const url = 'hoadon/'
        return axiosClient.get(url, { params: {page, limit}})
    },
    getCount: () => {
        const url = 'hoadon/count'
        return axiosClient.get(url)
    },
    getRevenue: () => {
        const url = 'hoadon/revenue'
        return axiosClient.get(url)
    },
    getRevenueLifeTime: ({maRapChieu}) => {
        const url = 'hoadon/chart/revenue'
        return axiosClient.get(url, { params: {maRapChieu}})
    },
    getCountLifeTime: () => {
        const url = 'hoadon/chart/count'
        return axiosClient.get(url)
    },
    getPhimBanChay: ({by, maRapChieu}) => {
        const url = 'hoadon/chart/phim-ban-chay'
        return axiosClient.get(url, { params: {by, maRapChieu}})
    },
    getRapChieuBanChay: ({by}) => {
        const url = 'hoadon/chart/rapchieu-ban-chay'
        return axiosClient.get(url, { params: {by}})
    },
    getById: (id) => {
        const url = `hoadon/${id}`
        return axiosClient.get(url)
    },
    getByUserId: (maNguoiDung) => {
        const url = `hoadon/nguoidung/${maNguoiDung}`
        return axiosClient.get(url)
    },
    getPayUrlMoMo: (data) => {
        const url = `hoadon/thanhtoan/momo`
        return axiosClient.post(url, data)
    },
    create: (data) => {
        const url = `hoadon`
        return axiosClient.post(url, data)
    },
    verifyMoMo: (data) => {
        const url = `hoadon/thanhtoan/momo/verify`
        return axiosClient.post(url, data)
    },
    updateMaThanhToan: (maHoaDon, data) => {
        const url = `hoadon/${maHoaDon}/ma-thanhtoan`
        return axiosClient.put(url, data)
    },
}

export default hoadonApi