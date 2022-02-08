import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../functions/category";

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCategories().then((category) => {
            //   console.log("Loaded categories", category);
            setCategories(category.data);
            setLoading(false);
        });
    }, []);

    const showCategories = () =>
        categories.map((c) => (
            <div
                key={c._id}
                className="col btn btn-raised btn-outline-primary btn-block  m-3"
            >
                {<Link to={`/category/${c.slug}`}> {c.name} </Link>}
            </div>
        ));
    // console.log('cat', cat);

    return (
        <div className="container">
            <div className="row">
                {loading ? (
                    <h4 className="text-center">Loading...</h4>
                ) : (
                    showCategories()
                )}
            </div>
        </div>
    );
};

export default CategoriesList;
