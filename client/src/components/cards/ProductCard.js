import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop.jpg";
import { showRating } from "../../functions/rating";
import _ from "lodash";

const { Meta } = Card;

const ProductCard = (props) => {
    const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    const { images, title, description, slug, ratings, price, quantity } =
        props.product;
    // console.log(`title: ${title} and quantity: ${quantity}`);

    const [toolTip, setToolTip] = useState("Add To Cart");

    // props.product.map((p) => {
    //     if (p.quantity < 1) {

    //     }
    // })
    const addToCartHandler = () => {
        // create a cart array
        // console.log('Clicked on cart');
        let cart = [];

        if (typeof window !== "undefined") {
            //extracting localstorage
            // if cart in localStorage get it
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
                // console.log("Existing cart item,", cart);
            }

            // if not- push  new to cart
            cart.push({
                ...props.product,
                count: 1,
            });
            // console.log("After pushed", cart);
            // remove duplicates
            let unique = _.uniqWith(cart, _.isEqual);
            // console.log("unique cart items", unique);
            // save to local
            localStorage.setItem("cart", JSON.stringify(unique));
            setToolTip("Added");

            // console.log('Cart items in local storage ', localStorage.getItem('cart'));

            dispatch({
                type: "ADD_TO_CART",
                payload: unique,
            });

            // show cart itemes in side drawer
            dispatch({
                type: "SET_VISIBLE",
                payload: true,
            });
        }
    };

    return (
        <>
            {props.product && ratings && ratings.length ? (
                showRating(props.product)
            ) : (
                <div className="text-center p-4 m-2">No ratings</div>
            )}
            <Card
                // onRateChange={ }
                cover={
                    <img
                        src={images && images.length ? images[0].uril : laptop}
                        style={{ height: "150px", objectFit: "cover" }}
                        className="p-1"
                    />
                }
                actions={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className="text-danger border-0" /> <br /> View Product
                    </Link>,
                    <Tooltip title={toolTip}>
                        <a
                            onClick={addToCartHandler}
                            style={quantity < 1 ? { pointerEvents: "none" } : { pointerEvents: "auto " }}
                        >
                            <ShoppingCartOutlined className="text-warning" /> <br />
                            {quantity < 1 ? "Out of Stock" : "Add to cart"}
                        </a>
                        ,
                    </Tooltip>,
                ]}
            >
                <Meta
                    title={`${title} -   ₹${price}`}
                    description={`${description && description.substring(0, 20)} `}
                />
            </Card>
        </>
    );
};

export default ProductCard;
