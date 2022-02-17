import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

import { getWishlist, removeFromWishlist } from "../../functions/user";
import UserNav from "../../components/nav/UserNav";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadWishlist();
    }, []);

    // console.log("my Wishlist", wishlist);

    const loadWishlist = () => {
        getWishlist(user.token)
            .then((res) => {
                // console.log('response at load wishlist', res.data);
                setWishlist(res.data.wishlist);
            })
            .catch((err) => {
                console.log("error a load wishlist", err);
            });
    };

    const handleRemoveWishlist = (productId) => {
        removeFromWishlist(productId, user.token)
            .then((res) => {
                loadWishlist();
                console.log("Deleted");
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    <h4>Wishlist</h4>
                    {wishlist.map((p) => (
                        <div key={p._id} className="alert alert-secondary">
                            <Link to={`/product/${p.slug}`}>{p.title}</Link>
                            <span
                                onClick={() => handleRemoveWishlist(p._id)}
                                className="btn btn-sm float-right"
                            >
                                <DeleteOutlined className="text-danger" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
