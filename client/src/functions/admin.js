import axios from "axios";

export const getOrders = async (authtoken) => {
    return axios.get(`${process.env.REACT_APP_API}/admin/orders`, {
        headers: {
            authtoken,
        },
    });
};

export const updatedOrderStatus = async (authtoken, orderId, orderStatus) => {
    return axios.put(
        `${process.env.REACT_APP_API}/admin/order-status`,
        { orderId, orderStatus },
        {
            headers: {
                authtoken,
            },
        }
    );
};
