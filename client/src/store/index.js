import { combineReducers } from "redux";

import userReducer from './userReducer';
import searchReducers from './searchReducers';
import cartReducer from "./cartReducer";
import drawerReducer from "./drawerReducer";
import couponReducer from './couponReducer';

const rootReducer = combineReducers({
    user: userReducer,
    search: searchReducers,
    cart: cartReducer,
    drawer: drawerReducer,
    coupon: couponReducer
});

export default rootReducer;