import userReducer from "./user";
import bookingReducer from "./booking";
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    user: userReducer,
    booking: bookingReducer
})

export default rootReducer