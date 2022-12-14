export const updatePhim = (phim) => {
    return  {
        type: 'UPDATE_PHIM',
        payload: phim
    }
}

export const updateSuatChieu = (suatchieu) => {
    return  {
        type: 'UPDATE_SUAT_CHIEU',
        payload: suatchieu
    }
}

export const updateGiaSuatChieu = (payload) => {
    return  {
        type: 'UPDATE_GIA_SUAT_CHIEU',
        payload: payload
    }
}

export const addGhe = (ghe) => {
    return  {
        type: 'ADD_GHE',
        payload: ghe
    }
}

export const removeGhe = (ghe) => {
    return  {
        type: 'REMOVE_GHE',
        payload: ghe
    }
}

export const updateStartTime = (time) => {
    return  {
        type: 'UPDATE_START_TIME',
        payload: time
    }
}

export const destroy = () => {
    return {
        type: 'DESTROY',
    }
}



