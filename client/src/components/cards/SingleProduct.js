import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Card, Tabs, Tooltip } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import StarRatings from 'react-star-ratings';
import _ from 'lodash';
import { toast } from 'react-toastify';

import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import laptop from '../../images/laptop.jpg';
import ProductListItem from './ProductListItem';
import RatingModal from "../modal/RatingModal";
import { showRating } from '../../functions/rating';
import { addToWishlist } from "../../functions/user";

const { Meta } = Card;
const { TabPane } = Tabs;

const SingleProduct = (props) => {
    const [toolTip, setTooltip] = useState('Add To Cart');
    const { user, cart } = useSelector(state => ({ ...state }));

    const dispatch = useDispatch();

    const history = useHistory();

    const { title, images, description, _id, ratings } = props.product;
    // console.log('Products at Single Product', props.product);


    const addToCartHandler = () => {
        let cart = [];

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.push({
                ...props.product,
                count: 1
            });

            let unique = _.uniqWith(cart, _.isEqual);

            localStorage.setItem('cart', JSON.stringify(unique));

            setTooltip('Added');

            dispatch({
                type: 'ADD_TO_CART',
                payload: unique,
            });

            // show cart itemes in side drawer
            dispatch({
                type: 'SET_VISIBLE',
                payload: true,
            });
        };
    };

    const addToWishlistHandler = (e) => {
        e.preventDefault();
        addToWishlist(_id, user.token).then(res => {
            console.log("Added To Wishlist From SingleProduct Page ", res.data);
            toast.success("Added To Wishlist");
            history.push('/user/wishlist');
        }).catch(err => {
            console.log("Error at addToWishlitHandler ", err);
        });
    };

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? (
                    <Carousel showArrows={true} autoPlay infiniteLoop>
                        {images &&
                            images.map((i) => <img src={i.uril} key={i.public_id} />)}
                    </Carousel>
                ) : (
                    <Card cover={<img src={laptop} className="mb-3 card-image" />}></Card>
                )}

                <Tabs type="card">
                    <TabPane tab='Decription' key='1'>
                        {description && description}
                    </TabPane>
                    <TabPane tab='More' key='2'>
                        Call Us At xxxx xxxx xxxx for more information on this product
                    </TabPane>
                </Tabs>

            </div>

            <div className="col-md-5">
                <h1 className='bg-info p-3'>{title}</h1>
                {props.product && ratings && ratings.length ? showRating(props.product) :
                    <div className="text-center pt-2 pb-3">'No ratings Yet'</div>}
                <Card
                    actions={[
                        <Tooltip title={toolTip}>
                            <a onClick={addToCartHandler}>
                                <ShoppingCartOutlined className="text-success" /> <br /> Add To
                                Cart
                            </a>
                        </Tooltip>,
                        <a onClick={addToWishlistHandler}>
                            <HeartOutlined className="text-info" /> <br /> Add To Wishlist
                        </a>,
                        <RatingModal>
                            <StarRatings
                                name={_id}
                                numberOfStars={5}
                                rating={props.star}
                                changeRating={props.starChange}
                                isSelectable={true}
                                starRatedColor="red"
                            />
                        </RatingModal>

                    ]}
                >
                    <ProductListItem product={props.product} />
                </Card>
            </div>
        </>
    );
};

export default SingleProduct;
