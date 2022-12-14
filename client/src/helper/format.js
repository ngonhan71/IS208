const format = {
    formatPrice: (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", }).format(price);
    },
    formatDate: (date) => {
        if (date) {
            const newDate = new Date(date)
            return newDate.toLocaleDateString('en-GB').slice(0, 10)
        } 
        return date
    },
    formatDateTime: (date) => {
        if (date) {
            const newDate = new Date(date)
            return newDate.toLocaleDateString('en-GB').slice(0, 10) + " " + newDate.toLocaleTimeString('en-GB')
        } 
        return date
    },
    convertToDay: (num) => {
        const weekday = ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7", "Ngày lễ"]
        return weekday[num]
    },
    convertToMMSS: (time) => {
        let minutes = Math.floor(time / 60)
        let seconds = Math.floor(time - minutes * 60)
        if (minutes < 10) minutes = '0' + minutes
        if (seconds < 10) seconds = '0' + seconds
        return minutes + ':' + seconds
    },
}

export default format