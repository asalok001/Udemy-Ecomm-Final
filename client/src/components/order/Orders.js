import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ShowPaymentInfo from "../cards/ShowPaymentInfo";

const Orders = (props) => {
    const { orders, changeOrderStatus } = props;

    const showOrderTable = (order) => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                </tr>
            </thead>
            <tbody>
                {order.products.map((p, i) => (
                    <tr key={i}>
                        <td>
                            <b>{p.product.title}</b>
                        </td>
                        <td>{p.product.price}</td>
                        <td>{p.product.brand}</td>
                        <td>{p.color}</td>
                        <td>{p.count}</td>
                        <td>
                            {p.product.shipping === "YES" ? (
                                <CheckCircleOutlined className="text-success" />
                            ) : (
                                <CloseCircleOutlined className="text-danger" />
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // const styles = (
    //     orders.orderStatus === 
    // )

    return (
        <>
            {orders.map((order, i) => (
                <div key={order._id} className="row pb-5">
                    <div className="btn btn-block bg-light">

                        <ShowPaymentInfo order={order} showStatus={false} />

                        <div className="row">
                            <div className="col-md-4">Delivery Status</div>
                            <div className="col-md-8">
                                <select
                                    onChange={(e) => changeOrderStatus(order._id, e.target.value)}
                                    className="form-control"
                                    defaultValue={order.orderStatus}
                                    name="status"
                                >
                                    {/* {console.log("Status is ", order.orderStatus)} */}
                                    <option value="Not Processed">Not Processed</option>
                                    <option value="Cash On Delivery">Cash On Delivery</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Dispatched">Dispatched</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {showOrderTable(order)}
                </div>
            ))}
        </>
    );
};

export default Orders;
