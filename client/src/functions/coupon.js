import axios from "axios";

export const getCoupon = async () => {
    return axios.get(`${process.env.REACT_APP_API}/coupons`);
};

export const addCoupon = async (coupon, authtoken) => {
    return axios.post(`${process.env.REACT_APP_API}/coupons`, { coupon }, {
        headers: {
            authtoken
        }
    });
};

export const removeCoupon = async (couponId, authtoken) => {
    return axios.delete(`${process.env.REACT_APP_API}/coupons/${couponId}`, {
        headers: {
            authtoken
        }
    });
};