import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import AdminProductCard from "../../../components/cards/AdminProductCard";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount } from "../../../functions/product";
import { removeProduct } from "../../../functions/product";

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        setLoading(true);
        getProductsByCount(10)
            .then((res) => {
                console.log("Fetched All Producs at AdminDashboard", res.data);
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log("Error Loading products At Admin Dashboard ", err);
            });
    };

    const removeProductHandler = (slug) => {
        let answer = window.confirm("Are You Sure To Delete");
        if (answer) {
            removeProduct(slug, user.token)
                .then(res => {
                    loadProducts();
                    toast.error(`${res.data.title} is deleted`);
                    console.log('Product Successfully Deleted And Response ', res);
                })
                .catch(err => {
                    toast.error(err.response.data);
                    console.log('Deletion Failed at removeProductHandler', err);
                });

            // console.log("Deleted by removeProductHandler", slug);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>All Products</h4>
                    )}

                    <div className="row">
                        {products.map((product) => (
                            <div key={product._id} className="col-md-4 pb-4">
                                <AdminProductCard
                                    product={product}
                                    removeProductHandler={removeProductHandler}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
