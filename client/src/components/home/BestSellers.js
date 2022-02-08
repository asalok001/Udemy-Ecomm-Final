import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../functions/product";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { Pagination } from "antd";

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAllProducts();
    }, [page]);

    useEffect(() => {
        getProductsCount()
            .then((res) => {
                setProductsCount(res.data);
                console.log('Count in best ', res.data);
            });
    });

    const loadAllProducts = () => {
        setLoading(true);
        // sort, order, limit
        getProducts("sold", "desc", page)
            .then((res) => {
                setProducts(res.data);
                console.log("Loaded Products at Best Sellers ", res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log("Error at loadProducts in Best Sellers", err);
            });
    };

    return (
        <>
            <div className="container">
                {loading ? (
                    <LoadingCard count={3} />
                ) : (
                    <div className="row">
                        {products.map((product) => (
                            <div key={product._id} className="col-md-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="row">
                <div className="col-md-4 offset-md-4 pt-5 p-3 text-center">
                    <Pagination
                        current={page}
                        total={(productsCount / 3) * 12}
                        onChange={(value) => setPage(value)}
                    />
                </div>
            </div>
        </>
    );
};

export default BestSellers;
