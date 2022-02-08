import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop.jpg";

const SideDrawer = (props) => {
    const dispatch = useDispatch();
    const { drawer, cart } = useSelector((state) => ({ ...state }));

    const imageStyle = {
        width: "100%",
        height: "50px",
        objectFit: "cover",
    };

    let count = 0;
    if (cart !== null && cart.length > 0) {
        count = cart.length;
    }


    return (
        <Drawer
            className="text-center"
            title={`Cart / ${count} Products`}
            placement="right"
            // closable={false}
            onClose={() => {
                dispatch({
                    type: "SET_VISIBLE",
                    payload: false,
                });
            }}
            visible={drawer}
        >
            {cart &&
                cart.length &&
                cart.map((p) => (
                    <div className="row" key={p._id}>
                        <div className="col">
                            {p.images[0] ? (
                                <>
                                    <img src={p.images[0].uril} style={imageStyle} />
                                    <p className="text-center bg-secondary text-light">
                                        {p.title} x {p.count}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <img src={laptop} style={imageStyle} />
                                    <p className="text-center bg-secondary text-light">
                                        {p.title} x {p.count}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                ))}

            <Link to="/cart">
                <button
                    onClick={() =>
                        dispatch({
                            type: "SET_VISIBLE",
                            payload: false,
                        })
                    }
                    className="text-center btn btn-primary btn-raised btn-block"
                >
                    Go To Cart
                </button>
            </Link>
        </Drawer>
    );
};

export default SideDrawer;
