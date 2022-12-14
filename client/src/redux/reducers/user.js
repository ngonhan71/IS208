const initialState = {
    email: '',
    tenNguoiDung: '',
    dienthoai: '',
    maNguoiDung: '',
    role: 0,
    accessToken: ''
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {

        case "LOGIN": {
            console.log({
                ...state,
                ...action.payload,
            })
            return {
                ...state,
                ...action.payload,
            };
        }

        case "LOGOUT": {
            return {
                ...state,
                email: '',
                tenNguoiDung: '',
                dienthoai: '',
                maNguoiDung: '',
                role: 0,
                accessToken: ''
            };
        }

        default: {
            return state;
        }
    }
};
  
export default userReducer;
  