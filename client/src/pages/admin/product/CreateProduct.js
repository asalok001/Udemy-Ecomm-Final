import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { LoadingOutlined } from "@ant-design/icons";

import { createProduct } from "../../../functions/product";
import { getCategories, getCateorySubs } from "../../../functions/category";
import AdminNav from "../../../components/nav/AdminNav";
import CreateProductForm from "../../../components/forms/CreateProductForm";
import FileUpload from "../../../components/forms/FileUpload";

const initialState = {
    title: "Surface Pro",
    description: "New Laptop",
    price: "12000",
    categories: [],
    category: "",
    subs: [],
    shipping: "",
    quantity: "12",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenove", "ASUS"],
    color: "",
    brand: "",
};

const CreateProduct = () => {
    const [values, setValues] = useState(initialState);
    const [subOptions, setSubOptions] = useState([]);
    const [showsubs, setShowSubs] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    // laoding components at the time of component mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        getCategories().then((cat) => {
            console.log(cat.data);
            // setting caategories name at categories array from loaded categories
            setValues({ ...values, categories: cat.data });
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // console.log('Response', JSON.stringify({ response }));
        createProduct(values, user.token)
            .then((res) => {
                console.log("product created", res.data);
                // toast.success(`${res.data.title} Succeessfully Created`);

                window.alert(`${res.data.title} Succeessfully Created`);

                // It will reloads after alert button is clicked
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.err);
                // if (err.response.status === 400) toast.error(err.response.data);
            });
    };

    const handleChange = (event) => {
        // dynamicaly setting all values of target objects
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleCategoryChange = (event) => {
        event.preventDefault();
        console.log("Category Clicked", event.target.value);
        setValues({ ...values, subs: [], category: event.target.value });
        getCateorySubs(event.target.value).then((res) => {
            console.log("Sub options", res);
            setSubOptions(res.data);
        });
        setShowSubs(true);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                {/* {JSON.stringify(values.images)} */}

                <div className="col-md-10 mb-5">
                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        <h4>Create Product</h4>
                    )}

                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>

                    {/* <br /> */}

                    <CreateProductForm
                        values={values}
                        setValues={setValues}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleCategoryChange={handleCategoryChange}
                        subOptions={subOptions}
                        showsubs={showsubs}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
