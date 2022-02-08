import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProductCard from "../../components/cards/ProductCard";
import { productStar } from "../../functions/product";
import { getSub } from "../../functions/sub";

const SubCategoryHome = () => {
    const [sub, setSubs] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slug } = useParams();

    useEffect(() => {
        getSub(slug)
            .then(res => {
                console.log('Data on Sub Category Home', res.data);
                setSubs(res.data.sub);
                setProducts(res.data.products);
            })
            .catch(err => {
                console.log('Error at category home', err);
            });;
    }, []);

    return (
        <>
            <div className="container-fluid">
                <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                    {products.length} Products At {sub.name} Sub Category
                </h4>
                <div className="row">
                    {products.map(p => (
                        <div className="col-md-4 pt-3 pb-5">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SubCategoryHome;
