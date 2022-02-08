import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, Menu, Radio, Slider } from "antd";
import { DownSquareOutlined, StarOutlined } from "@ant-design/icons";

import {
    getProductsByCount,
    fetchProductsByFilter,
} from "../functions/product";
import { getCategories } from "../functions/category";
import { getSubs } from "../functions/sub";
import ProductCard from "../components/cards/ProductCard";
import Star from "../components/forms/Star";

const { SubMenu } = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState("");
    const [star, setStar] = useState("");
    const [brands, setBrands] = useState([
        "Apple",
        "Samsung",
        "Microsoft",
        "Lenove",
        "ASUS",
    ]);
    const [brand, setBrand] = useState({});
    const [colors, setColors] = useState([
        "Black",
        "Brown",
        "Silver",
        "White",
        "Blue",
    ]);
    const [color, setColor] = useState("");
    const [shippings, setShippings] = useState(["YES", "NO"]);
    const [shipping, setShipping] = useState("");

    let dispatch = useDispatch();
    const { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    //************************************************************** /
    // 1- load products by default on page load
    useEffect(() => {
        console.log("USe Effect Called");
        setLoading(true);
        loadAllProducts();

        // fetch categories
        getCategories().then((res) => {
            setCategories(res.data);
            // setCategories(res.data);
            setLoading(false);

        });

        // fetch sub Category
        getSubs().then((res) => {
            setSubs(res.data);
            // setSubs(res.data);

            setLoading(false);
        });
    }, []);


    const loadAllProducts = () => {
        setLoading(true);
        getProductsByCount(12)
            .then((res) => {
                console.log("All Products at Shop", res.data);
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fetchProducts = (arg) => {
        // setLoading(true);
        fetchProductsByFilter(arg).then((res) => {
            // console.log(
            //     "load products based on users search by text input",
            //     res.data
            // );
            // setProducts((prev) => ([...prev, ...res.data]));
            setProducts(res.data);
            // setLoading(false);
        });
    };

    //******************************************************************* */
    // 2- load products based on users search by text input
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({ query: text });
            if (!text) {
                loadAllProducts();
            }
        }, 1000);

        return () => clearTimeout(delayed);
    }, [text]);

    // 3- load products based on price range search

    useEffect(() => {
        // console.log("Ok request to search price");
        fetchProducts({ price });
    }, [ok]);

    const handleSlider = (value) => {
        // reset default
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setCategoryIds([]);
        setPrice(value);
        setStar("");
        setSub("");
        setBrand("");
        setColor("");
        setShipping("");

        setTimeout(() => {
            setOk(!ok);
        }, 500);
    };

    // 4- load products based on category seaech
    // show categories list on checkbox
    const showCategories = () =>
        categories.map((c) => (
            <div key={c._id}>
                <Checkbox
                    onChange={handleCheck}
                    className="pb-2  pt-2 pr-4"
                    value={c._id}
                    checked={categoryIds.includes(c._id)}
                    name="category"
                >
                    {c.name}
                </Checkbox>
                <br />
            </div>
            // <br/>
        ));

    // handling check for checkbox
    const handleCheck = (e) => {
        // reset
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0, 0]);
        setStar("");
        setSub("");
        setBrand("");
        setColor("");
        setShipping("");
        // console.log("checkbox value", e.target.value);

        let idsInState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInState = idsInState.indexOf(justChecked); //index or -1

        // indexof method ?? if not found returns -1 or return index [1,2,3,4,5]
        if (foundInState === -1) {
            idsInState.push(justChecked);
            // console.log('ids in 1', idsInState);
        } else {
            // if found pull out one item from index
            idsInState.splice(foundInState, 1);
            // console.log('ids in 2', idsInState);
        }

        setCategoryIds(idsInState);
        console.log("All categories ids ", idsInState);
        fetchProducts({ category: idsInState });
    };

    // 5- load products based on star rating
    const handleStarClick = (num) => {
        // reset
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice("");
        setCategoryIds([]);
        setSub("");
        setBrand("");
        setColor("");
        setShipping("");
        setStar(num);

        fetchProducts({ stars: num });
    };

    const showStars = () => (
        <div className="pb-2 pt-2 pr-4">
            <Star key="star-1" starClick={handleStarClick} numberOfStars={5} />
            <Star key="star-2" starClick={handleStarClick} numberOfStars={4} />
            <Star key="star-3" starClick={handleStarClick} numberOfStars={3} />
            <Star key="star-4" starClick={handleStarClick} numberOfStars={2} />
            <Star key="star-5" starClick={handleStarClick} numberOfStars={1} />
        </div>
    );

    // 6- load products based on sub category
    const showSubs = () =>
        subs.map((s) => (
            <div
                key={s._id}
                onClick={() => handleSub(s)}
                className="p-1 m-1 badge badge-secondary"
                style={{ cursor: "pointer" }}
            >
                {s.name}
            </div>
        ));

    const handleSub = (sub) => {
        // console.log("Sub--------->", s);
        setSub(sub);

        //   reset
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice(0, 0);
        setCategoryIds([]);
        setStar("");
        setBrand("");
        setColor("");
        setShipping("");

        fetchProducts({ sub });
    };

    // 7-  load products based on brands
    const showBrand = () =>
        brands.map((b) => (
            <Radio
                key={b}
                value={b}
                name={b}
                checked={b === brand}
                onChange={handleBrand}
                className="pb-1 ml-1 pr-1"
            >
                {b}
            </Radio>
        ));

    const handleBrand = (e) => {
        setBrand(e.target.value);
        //   reset
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice(0, 0);
        setCategoryIds([]);
        setStar("");
        setSub("");
        setColor("");
        setShipping("");

        fetchProducts({ brand: e.target.value });
    };

    // 8- load products based on color
    const showColor = () =>
        colors.map((c) => (
            // <div className="radio radio-inline">{c}</div>
            <Radio
                key={c}
                value={c}
                name={c}
                checked={c === color}
                onChange={handleColor}
                className="pl-5 pb-1 pr-1"
            >
                {c}
            </Radio>
        ));

    const handleColor = (e) => {
        setColor(e.target.value);
        //   reset
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice(0, 0);
        setCategoryIds([]);
        setStar("");
        setSub("");
        setBrand("");
        setShipping("");

        fetchProducts({ color: e.target.value });
    };

    // 9- load products based on Sipping
    const showShipping = () =>
        shippings.map((s) => (
            <Radio
                key={s}
                value={s}
                name={s}
                checked={s === color}
                onChange={handleShipping}
                className="pl-5 pb-5 mb-2 pr-1"
            >
                {s}
            </Radio>
        ));

    const handleShipping = (e) => {
        //   reset
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setColor("");
        setPrice(0, 0);
        setCategoryIds([]);
        setStar("");
        setSub("");
        setBrand("");

        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value });
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3 pt-2">
                        <h4> Search/Filter </h4>
                        <hr />

                        <Menu
                            mode="inline"
                            defaultOpenKeys={[
                                "first",
                                "second",
                                "third",
                                "fourth",
                                "fifth",
                                "sixth",
                                "seventh",
                            ]}
                        >
                            {/* flter for Price slider */}
                            <SubMenu key="first" title={<span className="h6">Price</span>}>
                                <div>
                                    <Slider
                                        key="sslider"
                                        className="ml-4 mr-4"
                                        tipFormatter={(v) => `₹${v}`}
                                        range
                                        value={price}
                                        max="150000"
                                        onChange={handleSlider}
                                    />
                                </div>
                            </SubMenu>

                            {/* Filter options  For Categories */}
                            <SubMenu
                                key="second"
                                title={
                                    <span className="h6">
                                        <DownSquareOutlined /> Categories
                                    </span>
                                }
                            >
                                <div key="cat-div" style={{ marginTop: "-10px" }}>
                                    {showCategories()}
                                </div>
                                {/* <br /> */}
                            </SubMenu>

                            {/* filter option foe rating stars */}

                            <SubMenu
                                key="third"
                                title={
                                    <span className="h6">
                                        <StarOutlined /> Rating
                                    </span>
                                }
                            >
                                <div key="star-div" style={{ marginTop: "-10px" }}>
                                    {showStars()}
                                </div>
                            </SubMenu>

                            {/* Filter options  For Sub Categories */}
                            <SubMenu
                                key="fourth"
                                title={
                                    <span className="h6">
                                        <DownSquareOutlined /> Sub Categories
                                    </span>
                                }
                            >
                                <div
                                    key="sub-div"
                                    style={{ marginTop: "-10px" }}
                                    className="pl-4 pr-4"
                                >
                                    {showSubs()}
                                </div>
                                {/* <br /> */}
                            </SubMenu>

                            {/* Filter options  For Brands */}
                            <SubMenu
                                key="fifth"
                                title={
                                    <span className="h6">
                                        <DownSquareOutlined /> Brands
                                    </span>
                                }
                            >
                                <div
                                    key="brand-di"
                                    style={{ marginTop: "-10px" }}
                                    className=" pr-5"
                                >
                                    {showBrand()}
                                </div>
                                {/* <br /> */}
                            </SubMenu>

                            {/* Filter options  For Colors */}
                            <SubMenu
                                key="sixth"
                                title={
                                    <span className="h6">
                                        <DownSquareOutlined /> Colors
                                    </span>
                                }
                            >
                                <div
                                    key="color-div"
                                    style={{ marginTop: "-10px" }}
                                    className="pr-5"
                                >
                                    {showColor()}
                                </div>
                                {/* <br /> */}
                            </SubMenu>

                            {/* filter option for shipping */}
                            <SubMenu
                                key="seventh"
                                title={
                                    <span className="h6">
                                        <DownSquareOutlined /> Shipping
                                    </span>
                                }
                            >
                                <div
                                    key="ship-div"
                                    style={{ marginTop: "-10px" }}
                                    className="pr-5"
                                >
                                    {showShipping()}
                                </div>
                            </SubMenu>
                        </Menu>
                    </div>

                    <div className="col-md-9 pt-2">
                        {loading ? (
                            <h4 className="text-danger">Loading....</h4>
                        ) : (
                            <h4 className="text-danger">Products</h4>
                        )}

                        {products && products.length < 1 && <p>No Products found</p>}

                        <div className="row pb-5">
                            {products &&
                                products.length &&
                                products.map((p) => (
                                    <div className="col-md-4 mt-3" key={p._id}>
                                        <ProductCard product={p} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;
