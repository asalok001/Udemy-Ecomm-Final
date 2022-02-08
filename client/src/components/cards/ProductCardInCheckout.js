import React from "react";
import ModalImage from "react-modal-image";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
} from "@ant-design/icons";

import laptop from "../../images/laptop.jpg";

const ProductCardInCheckout = (props) => {
    const { title, price, images, count, shipping, color, brand } = props.product;
    const dispatch = useDispatch();

    const colors = ["Black", "Brown", "Silver", "White", "Blue"];

    console.log("product  in cart table", props.product);

    const handleColorChange = (event) => {
        let cart = [];

        if (typeof window !== "undefined") {
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }

            cart.map((p, i) => {
                if (p._id === props.product._id) {
                    cart[i].color = event.target.value;
                }
            });
            localStorage.setItem("cart", JSON.stringify(cart));

            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });
        }
    };

    const handleQuantityChange = (event) => {
        // console.log('Available Quantity', props.product.quantity);
        let count = event.target.value < 1 ? 1 : event.target.value;

        if (count > props.product.quantity) {
            toast.error(`Max Available quantity ${props.product.quantity}`);
            return;
        }

        let cart = [];

        if (typeof window !== "undefined") {
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }

            cart.map((p, i) => {
                if (p._id === props.product._id) {
                    cart[i].count = count;
                }
            });

            localStorage.setItem("cart", JSON.stringify(cart));
            dispatch({
                type: "ADD_TO_CART",
                payload: cart,
            });
        }
    };

    const handleRemove = () => {

        // dispatch({
        //     type: "REMOVE_ITEM_FROM_CART",
        //     payload: props.product._id
        // });
        // dispatch({
        //     type: "ADD_TO_CART",
        //     payload:
        // })
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart'));
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        // if (cart && cart.length > 0) {
        cart.map((p, i) => {
            if (p._id === props.product._id) {
                cart.splice(i, 1);
            }
        });
        // }
        localStorage.setItem('cart', JSON.stringify(cart));
        dispatch({
            type: "ADD_TO_CART",
            payload: cart
        });
    };

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: "120px", height: "auto" }}>
                        {images && images.length ? (
                            <ModalImage small={images[0].uril} large={images[0].uril} />
                        ) : (
                            <ModalImage small={laptop} large={laptop} />
                        )}
                    </div>
                </td>
                <td>{title}</td>
                <td>{price}</td>
                <td>{brand}</td>
                <td>
                    <select
                        onChange={handleColorChange}
                        name="color"
                        // menuPlacement="auto"
                        // menuPosition="fixed"
                        className="form-control"
                    >
                        {color ? (
                            <option value={color}>{color}</option>
                        ) : (
                            <option>Select</option>
                        )}
                        {colors
                            .filter((col) => col !== color)
                            .map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                    </select>
                </td>
                <td style={{ width: "100px", height: "auto" }}>
                    <input
                        type="number"
                        className="form-control input-sm text-center"
                        value={count}
                        onChange={handleQuantityChange}
                    />
                </td>
                <td className="text-center">
                    {shipping === "YES" ? (
                        <CheckCircleOutlined className="text-success" />
                    ) : (
                        <CloseCircleOutlined className="text-danger" />
                    )}
                </td>
                <td className="text-center">
                    <CloseOutlined
                        onClick={handleRemove}
                        className="text-danger pointer"
                    />
                </td>
            </tr>
        </tbody>
    );
};
export default ProductCardInCheckout;
