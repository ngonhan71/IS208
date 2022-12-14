const initialState = {
    phim: {},
    suatChieu: {},
    startTime: 0,
    dsVe: [],
    countDownRunning: false
};
const bookingReducer = (state = initialState, action) => {
    switch (action.type) {


        case "UPDATE_PHIM": {
            console.log({
                ...state,
                phim: action.payload
            })
            return {
                ...state,
                phim: action.payload
            };
        }

        case "UPDATE_SUAT_CHIEU": {
            console.log({
                ...state,
                suatChieu: action.payload,
            })
            return {
                ...state,
                suatChieu: action.payload,
            };
        }

        case "UPDATE_GIA_SUAT_CHIEU": {
            console.log({
                ...state,
                suatChieu: { ...state.suatChieu, ...action.payload },
            })
            return {
                ...state,
                suatChieu: { ...state.suatChieu, ...action.payload },
            };
        }

        case "UPDATE_START_TIME": {
            console.log({
                ...state,
                startTime: action.payload,
                countDownRunning: true
            })
            return {
                ...state,
                startTime: action.payload,
                countDownRunning: true
            };
        }

        case "ADD_GHE": {
            const newList = [...state.dsVe]
            newList.push(action.payload)
            console.log({
                ...state,
                dsVe: newList,
            })
            return {
                ...state,
                dsVe: newList,
            };
        }

        case "REMOVE_GHE": {
            const newList = [...state.dsVe].filter(item => item.ma_ghe !== action.payload.ma_ghe)
            console.log({
                ...state,
                dsVe: newList,
            })
            return {
                ...state,
                dsVe: newList,
            };
        }

        case "DESTROY": {
            console.log({
                ...state,
                phim: {},
                suatChieu: {},
                startTime: 0,
                dsVe: [],
                countDownRunning: false
            })
            return {
                ...state,
                phim: {},
                suatChieu: {},
                startTime: 0,
                dsVe: [],
                countDownRunning: false
            };
        }


        default: {
            return state;
        }
    }
};
  
export default bookingReducer;
  