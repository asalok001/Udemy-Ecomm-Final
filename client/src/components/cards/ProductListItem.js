import React from "react";
import { Link } from "react-router-dom";

const ProductListItem = (props) => {
    const { price, category, subs, shipping, quantity, color, brand, sold } =
        props.product;

    // console.log("Products at List Item Product", props.product);

    return (
        <ul className="list-group">
            <li className="list-group-item">
                Price{" "}
                <span className="label label-default label-pill float-right">
                    $ {price}
                </span>
            </li>

            {category && (
                <li className="list-group-item">
                    Category{" "}
                    <Link
                        to={`/category/${category.slug}`}
                        className="label label-default label-pill float-right"
                    >
                        $ {category.name}
                    </Link>
                </li>
            )}

            {subs && (
                <li className="list-group-item">
                    Sub Categores
                    {subs.map((sub) => (
                        <Link
                            key={sub._id}
                            to={`/subs/${sub.slug}`}
                            className="label label-default label-pill float-right"
                        >
                            {sub.name}
                        </Link>
                    ))}
                </li>
            )}

            <li className="list-group-item">
                Shipping{" "}
                <span className="label label-default label-pill float-right">
                    {shipping}
                </span>
            </li>

            <li className="list-group-item">
                Colour{" "}
                <span className="label label-default label-pill float-right">
                    {color}
                </span>
            </li>

            <li className="list-group-item">
                Brand{" "}
                <span className="label label-default label-pill float-right">
                    {brand}
                </span>
            </li>

            <li className="list-group-item">
                Available{" "}
                <span className="label label-default label-pill float-right">
                    {quantity}
                </span>
            </li>

            <li className="list-group-item">
                Sold{" "}
                <span className="label label-default label-pill float-right">
                    {sold}
                </span>
            </li>
        </ul>
    );
};

export default ProductListItem;
