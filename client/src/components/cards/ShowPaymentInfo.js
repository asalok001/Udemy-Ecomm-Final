import React from "react";

const ShowPaymentInfo = (props) => {

    return (
        <div>
            <p>
                <span>Order Id: {props.order.paymentIntent.paymentIntent.id}</span>{"  /  "}
                <span>
                    Amount:{"  /  "}
                    {(props.order.paymentIntent.paymentIntent.amount /= 100).toLocaleString(
                        "en-US",
                        {
                            style: "currency",
                            currency: "INR",
                        }
                    )}
                </span>{"  /  "}

                <span>
                    Currency:{"  /  "}
                    {props.order.paymentIntent.paymentIntent.currency.toUpperCase()}
                </span>{"  /  "}

                <span>
                    Method:{"  /  "}
                    {props.order.paymentIntent.paymentIntent.payment_method_types[0]}
                </span>{"  / "}

                <span>
                    Payment:{"  /  "}
                    {props.order.paymentIntent.paymentIntent.status.toUpperCase()}
                </span>{"  /  "}

                <span>
                    Ordered On:{"  /  "}
                    {new Date(props.order.paymentIntent.paymentIntent.created * 1000).toLocaleString()}
                </span>{"  / "}

                <span className="badge bg-primary text-white">
                    Status:{"  /  "} {props.order.orderStatus}
                </span>
            </p>
        </div>
    );
};

export default ShowPaymentInfo;
