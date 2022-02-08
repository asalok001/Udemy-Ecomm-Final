import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AdminNav from "../../../components/nav/AdminNav";
import { getCoupon, removeCoupon, addCoupon } from "../../../functions/coupon";

const CreateCoupon = () => {
    const [name, setName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [discount, setDiscount] = useState("");
    const [loading, setLoading] = useState(false);
    const [coupon, setCoupon] = useState([]);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = () => {
        getCoupon().then((res) => {
            setCoupon(res.data);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.table(name, expiry, discount);
        setLoading(true);

        addCoupon({ name, expiry, discount }, user.token)
            .then((res) => {
                console.log("Response After adding coupon", res);
                setLoading(false);
                setName("");
                setDiscount("");
                setExpiry("");
                loadCoupons();
                toast.success(`${res.data.name} Is Created`);
            })
            .catch((err) => {
                console.log("Error after adding coupon", err);
                setLoading(false);
                toast.error(err);
            });
    };

    const handleRemove = (couponId) => {
        if (window.confirm("Delete")) {
            setLoading(true);

            removeCoupon(couponId, user.token).then(res => {
                loadCoupons();
                setLoading(false);
                toast.error(`${res.data.name} deleted`);
            })
                .catch(err => {
                    toast.error(err.data.response);
                });
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Coupon</h4>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="text-muted">Name</label>
                            <input
                                className="form-control"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted">Discount</label>
                            <input
                                className="form-control"
                                type="text"
                                onChange={(e) => setDiscount(e.target.value)}
                                value={discount}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-muted">Expiry</label>
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                value={expiry}
                                onChange={(date) => setExpiry(date)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-outline-primary">
                            Save
                        </button>
                    </form>

                    <br />

                    <h4>{coupon.length} Coupons</h4>
                    <table className="table table-bordered table-dark pb-4 mb-4" >
                        <thead className="thead-dark">
                            <tr >
                                <th className="table-active" scope="col">Name</th>
                                <th className="table-active" scope="col">Expiry</th>
                                <th className="table-active" scope="col">Discount</th>
                                <th className="table-active" scope="col">Actions</th>
                            </tr>
                        </thead>

                        <tbody style={{}}>
                            {coupon.map((c) => (
                                <tr key={c._id}>
                                    <td> {c.name}</td>
                                    <td> {new Date(c.expiry).toLocaleDateString()}</td>
                                    {/* <td> {`${new Date(c.expiry).getDate()} / ${new Date(c.expiry).getMonth()} / ${new Date(c.expiry).getFullYear()}`}</td> */}
                                    <td> {c.discount}%</td>
                                    <td>
                                        {" "}
                                        <DeleteOutlined onClick={handleRemove} className="text-danger pointer" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CreateCoupon;
