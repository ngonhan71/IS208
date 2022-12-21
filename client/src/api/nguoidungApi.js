import axiosClient from "./axiosClient"

const nguoidungApi = {
    getAllKH: () => {
        const url = 'nguoidung/khachhang'
        return axiosClient.get(url)
    },
    getAllNV: () => {
        const url = 'nguoidung/nhanvien'
        return axiosClient.get(url)
    },
    register: (data) => {
        const url = 'auth/register'
        return axiosClient.post(url, data)
    }, 
    createNV: (data) => {
        const url = 'nguoidung/nhan-vien'
        return axiosClient.post(url, data)
    }, 
    login: (data) => {
        const url = 'auth/login'
        return axiosClient.post(url, data)
    },
    getById: (maNguoiDung) => {
        const url = `nguoidung/${maNguoiDung}`
        return axiosClient.get(url)
    },
    resendEmail: (maNguoiDung) => {
        const url = `nguoidung/mobile/request-active/${maNguoiDung}`
        return axiosClient.get(url)
    },
    getMe: () => {
        const url = 'auth/me'
        return axiosClient.get(url)
    },
    changePassword: (id, data) => {
        const url = `nguoidung/${id}/password`
        return axiosClient.put(url, data)
    },
    forgotPassword: (data) => {
        const url = `nguoidung/quen-mat-khau`
        return axiosClient.post(url, data)
    },
    resetPassword: (data) => {
        const url = `nguoidung/dat-lai-mat-khau`
        return axiosClient.post(url, data)
    },
    updateStatus: (id, data) => {
        const url = `nguoidung/${id}/trang-thai`
        return axiosClient.put(url, data)
    },
    
}

export default nguoidungApi