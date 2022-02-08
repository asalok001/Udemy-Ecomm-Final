import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
    emptyUserCart,
    getUserCart,
    saveUserAddress,
    applyCoupon,
} from "../functions/user";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const CheckOut = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [addressOk, setAddressOk] = useState(false);
    const [coupon, setCoupon] = useState("");

    // discount total state
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountCouponError, setDiscountCouponError] = useState("");

    const { user } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            // console.log("new response", JSON.stringify(res.data, null, 4));
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });
    }, []);

    const emptyCart = () => {
        // remove from local storage
        if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
        }

        //remove from redux
        dispatch({
            type: "ADD_TO_CART",
            payload: [],
        });

        // remove from backend
        emptyUserCart(user.token)
            .then((res) => {
                // console.log('Token =------', user.token);
                // console.log('Cart items removed', res.data);
                setProducts([]);
                setTotal(0);
                setTotalAfterDiscount(0);
                setCoupon('');
                toast.success("Cart is empty. Continue Shopping");

                // update redux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false
                });
            })
            .catch((err) => {
                console.log("err or on deleting cart", err);
            });
    };

    const saveAddressToDb = () => {
        // console.log(address);
        saveUserAddress(user.token, address).then((res) => {
            if (res.data.ok) {
                setAddressOk(true);
                toast.success("Address Saved");
            }
        });
    };

    const showAddressArea = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
                Save Address
            </button>
        </>
    );

    const applyDiscountCoupon = () => {
        console.log("Coupon Applied", coupon);

        applyCoupon(user.token, coupon).then((res) => {
            console.log("Applied Coupon response at checkout", res.data);
            if (res.data) {
                setTotalAfterDiscount(res.data);
                // update redux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true
                });
            }

            if (res.data.err) {
                setDiscountCouponError(res.data.err);
                // update redux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false
                });
            }
        });
    };

    const showApplyCoupons = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value);
                    setDiscountCouponError("");
                }}
                value={coupon}
                type="text"
                className="form-control"
            />
            <button className="btn btn-primary mt-2" onClick={applyDiscountCoupon}>
                Apply
            </button>
        </>
    );

    const showProductSummary = () => {
        if (products && products.length) {
            return products.map((p, i) => (
                <div key={i}>
                    {p.product.title} ({p.color}) x {p.count} ={p.product.price * p.count}
                </div>
            ));
        }
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Addrss</h4>
                <br />
                <br />
                {showAddressArea()}
                <hr />
                <h4>Got Coupons ?</h4>
                <br />
                {showApplyCoupons()}
                {discountCouponError && (
                    <p className="bg-danger m-1 p-2">{discountCouponError}</p>
                )}
            </div>

            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products {products.length}</p>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart Total : ₹{total}</p>

                {totalAfterDiscount > 0 && (
                    <p className="bg-success m-1 p-2">
                        Discount Applied. Total Payable: {totalAfterDiscount}
                    </p>
                )}

                <div className="row">
                    <div className="col-md-6">
                        <button
                            className="btn btn-primary"
                            disabled={!addressOk || !products.length}
                            onClick={() => history.push('/payment')}
                        >
                            Place Order
                        </button>
                    </div>

                    <div className="col-md-6">
                        <button
                            className="btn btn-primary"
                            disabled={!products.length}
                            onClick={emptyCart}
                        >
                            Empty Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
