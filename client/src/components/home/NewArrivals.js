import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { getProducts, getProductsCount } from "../../functions/product";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { PercentageOutlined } from "@ant-design/icons";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsCount, setProductsCount] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAllProducts();
    }, [page]);

    useEffect(() => {
        getProductsCount().then((res) => {
            setProductsCount(res.data);
            console.log('Total Product on New Arrials', res.data);
        })
            .catch((err) => {
                console.log("Error at getProducts count", err);
            });
    }, []);

    const loadAllProducts = () => {
        setLoading(true);
        // sort, order, limit
        getProducts("createdAt", "desc", page)
            .then((res) => {
                setProducts(res.data);
                console.log("Loaded Products at New Arrivals ", res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log("Error at loadProducts in New Arrivals", err);
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
                <div className="col-md-4 offset-md-4 text-center pt-5  p-3">
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

export default NewArrivals;
