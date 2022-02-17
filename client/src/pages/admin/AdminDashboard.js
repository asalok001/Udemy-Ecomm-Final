import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';

import { getOrders, updatedOrderStatus } from "../../functions/admin";
import AdminNav from "../../components/nav/AdminNav";
import Orders from '../../components/order/Orders';


const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadAllOrders();
    }, []);

    // console.log("Order Checked", orders.orderStatus);
    const loadAllOrders = () => {
        getOrders(user.token)
            .then((res) => {
                // console.log(
                //     "All loaded products at admin dashboard",
                //     JSON.stringify(res.data, null, 4)
                // );
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const changeOrderStatus = (orderId, orderStatus) => {
        updatedOrderStatus(user.token, orderId, orderStatus).then(res => {
            // console.log("Updated status", res.data);
            toast.success("Status Updated");
            loadAllOrders();
        })
            .catch(err => console.log(err));
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    <h4>All Products</h4>
                    <Orders orders={orders} changeOrderStatus={changeOrderStatus} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
