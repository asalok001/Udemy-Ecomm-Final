import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../functions/user";

const Cart = () => {
    const { user, cart } = useSelector((state) => ({ ...state }));

    const dispatch = useDispatch();
    const history = useHistory();

    // console.log("products in cart", cart);

    let count = 0;
    if (cart !== null && cart.length > 0) {
        count = cart.length;
    }

    const getTotal = () => {
        if (cart !== null && cart.length > 0) {
            return cart.reduce((currentValue, nextValue) => {
                return currentValue + nextValue.count * nextValue.price;
            }, 0);
        }
    };

    const saveOrderToDb = () => {
        console.log('All items in cart', cart);
        userCart(cart, user.token)
            .then((res) => {
                console.log("Cart post response ", res);
                if (res.data.ok) history.push("/checkout");
            })
            .catch((err) => {
                console.log("Cart post Error", err);
            });
    };

    const showCartItems = () => (
        <table className="table tabel-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            {cart.map((p) => (
                <ProductCardInCheckout key={p._id} product={p} />
            ))}
        </table>
    );

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8 col-sm-12">
                    <h4>Cart / {count} Products</h4>
                    {!count ? (
                        <p>
                            No Products In Cart. <Link to="/shop">Continue Shopping</Link>
                        </p>
                    ) : (
                        showCartItems()
                    )}
                </div>
                <div className="col-md-4 col-sm-12">
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Products</p>
                    {cart && cart.map((c, i) => (
                        <div key={i}>
                            <p>
                                {c.title} x {c.count} = ₹{c.price * c.count}
                            </p>
                        </div>
                    ))}
                    <hr />
                    Total : <b>₹{getTotal()}</b>
                    <hr />
                    {user ? (
                        <button
                            onClick={saveOrderToDb}
                            disabled={!count}
                            className="btn btn-sm btn-primary mt-2"
                        >
                            Proceed To CheckOut
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-outline-primary mt-2">
                            <Link
                                to={{
                                    pathname: "/login",
                                    state: { from: "cart" },
                                }}
                            >
                                Login To CheckOut
                            </Link>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
