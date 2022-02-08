import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getCategory } from "../../functions/category";
import ProductCard from '../../components/cards/ProductCard';

const CategoryHome = () => {
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);

    const { slug } = useParams();

    useEffect(() => {
        setLoading(true);
        getCategory(slug)
            .then(res => {
                // console.log('Get Category at home', res.data);
                // console.log('Get Category at Category home', JSON.stringify(c.data, null, 0));
                setCategory(res.data.category);
                setProduct(res.data.products);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error at category home', err);
            });
    }, []);

    return (
        <>
            <div className="container-fluid">
                <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                    {product.length} Products {category.name} Category
                </h4>
                <div className="row">
                    {product.map(p => (
                        <div className="col-md-4 pt-3 pb-5" key={p._id}>
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CategoryHome;