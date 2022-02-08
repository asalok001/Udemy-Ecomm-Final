import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import laptop from "../images/laptop.jpg";

import { createPaymentIntent } from "../functions/stripe";
import { createOrder, emptyUserCart } from "../functions/user";

const StripeCheckout = (props) => {
    const dispatch = useDispatch();
    const { user, coupon } = useSelector((state) => ({ ...state }));

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState("");

    const [cartTotal, setCartTotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [payable, setPayable] = useState(0);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        createPaymentIntent(user.token, coupon).then((res) => {
            console.log("create payment intent", res.data);
            setClientSecret(res.data.clientSecret);

            // additional response recieved on successfull payment
            setCartTotal(res.data.cartTotal);
            setTotalAfterDiscount(res.data.totalAfterDiscount);
            setPayable(res.data.payable);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: e.target.name.value,
                },
            },
        });
        if (payload.error) {
            setError("Payment Failed ", payload.error.message);
            console.log("Payment Failed ", payload.error.message);
            setProcessing(false);
        } else {
            // here you get result after successfull payment then

            // 1- create order and save in database for admin to process
            createOrder({ paymentIntent: payload }, user.token).then((res) => {
                if (res.data.ok) {
                    // 2-  empty user cart from redux and local storage
                    if (typeof window !== "undefined") localStorage.removeItem("cart");

                    // 3- empty cart from redux
                    dispatch({
                        type: "ADD_TO_CART",
                        payload: []
                    });

                    // 4- reset coupon to false
                    dispatch({
                        type: 'COUPON_APPLIED',
                        payload: false
                    });

                    // 5- empty user cart from backend
                    emptyUserCart(user.token);
                }
            });
            console.log(JSON.stringify(payload, null, 4));
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    const handleChange = (e) => {
        // listen for change in the card element
        // and display any errors as the customer types their card details
        setDisabled(e.empty);
        setError(e.error ? e.error.message : "");
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: "Arial, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    return (
        <>
            {!succeeded && (
                <div>
                    {coupon && totalAfterDiscount !== undefined ? (
                        <p className="alert alert-success">{`Total After Disocount: ₹${totalAfterDiscount}`}</p>
                    ) : (
                        <p className="alert alert-danger">No Coupon Applied</p>
                    )}
                </div>
            )}

            <Card
                cover={
                    <img
                        src={laptop}
                        style={{
                            height: "200px",
                            objectFit: "cover",
                            marginBottom: "-50px",
                        }}
                    />
                }
                actions={[
                    <>
                        <CurrencyRupeeOutlinedIcon className="text-info" /> <br /> Total : ₹
                        {cartTotal}
                    </>,
                    <>
                        <CheckOutlined className="text-info" /> <br /> Total Payable : ₹{" "}
                        {(payable / 100).toFixed(2)}
                    </>,
                ]}
            />

            <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
                <CardElement
                    id="card-element"
                    options={cardStyle}
                    onChange={handleChange}
                />
                <button
                    className="stripe-button"
                    disabled={processing || succeeded || disabled}
                >
                    <span id="button-text">
                        {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
                    </span>
                </button>
                <br />
                {error && (
                    <div className="card-error text-danger" role="alert">
                        {error}
                    </div>
                )}

                <br />
                <p className={succeeded ? "result-message" : "result-message hidden"}>
                    Payment successfull{" "}
                    <Link to="/user/history">See it in your Purchase history</Link>
                </p>
            </form>
        </>
    );
};

export default StripeCheckout;
