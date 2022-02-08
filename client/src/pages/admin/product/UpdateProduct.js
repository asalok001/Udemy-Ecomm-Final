import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

import AdminNav from "../../../components/nav/AdminNav";
import { getProduct, updateProduct } from "../../../functions/product";
import { getCategories, getCateorySubs } from "../../../functions/category";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import FileUpload from "../../../components/forms/FileUpload";
import { toast } from "react-toastify";

const initialState = {
    title: "",
    description: "",
    price: "",
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenove", "ASUS"],
    color: "",
    brand: "",
};

const UpdateProduct = (props) => {
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    // const [showsubs, setShowSubs] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    const { slug } = useParams();
    const history = useHistory();

    useEffect(() => {
        loadProduct();
        loadCategories();
    }, []);

    const loadCategories = () => {
        getCategories().then((c) => {
            setCategories(c.data);
        });
    };
    // console.log("Cats =", values.category);

    const loadProduct = () => {
        let product = getProduct(slug).then((res) => {
            // console.log('Loaded Single Product at loadProduct() in Update Product', res);

            // load single product
            setValues({ ...values, ...res.data });

            // load sub-category of loaded product
            getCateorySubs(res.data.category._id).then((res) => {
                setSubOptions(res.data); // on First load, show default subs
            });
            // prepare array of sub ids to show default sub value in th array of antd Select
            let arr = [];
            res.data.subs.map((s) => arr.push(s._id));
            console.log("Array of sub ids", arr);
            setArrayOfSubs((prev) => arr);
        });
        // console.log("Single Product", product);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        values.subs = arrayOfSubs;
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
            .then(res => {
                setLoading(false);
                toast.success(`${res.data.title} is updated`);
                history.push('/admin/dashboard');
            })
            .catch(err => {
                setLoading(false);
                console.log(('Product Update Failed In UpdateProduct Component an handleSubmit', err));
                // toast.error(err.resposne.data.err);
            });
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleCategoryChange = (event) => {
        event.preventDefault();
        console.log("Category After Clicked", event.target.value);
        setValues({ ...values, subs: [] });

        setSelectedCategory(event.target.value);

        getCateorySubs(event.target.value).then((res) => {
            console.log("Sub options on Category Clicked", res);
            setSubOptions(res.data);
        });

        console.log("Existing Category", values.category);

        if (values.category._id === event.target.value) {
            loadProduct();
        }
        setArrayOfSubs([]);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <h4>Update Product</h4>
                    )}

                    {/* {JSON.stringify(values)} */}

                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>

                    <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        values={values}
                        categories={categories}
                        arrayOfSubs={arrayOfSubs}
                        setArrayOfSubs={setArrayOfSubs}
                        setValues={setValues}
                        subOptions={subOptions}
                        handleCategoryChange={handleCategoryChange}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
