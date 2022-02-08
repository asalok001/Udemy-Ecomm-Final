import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, productStar, getRelated } from '../functions/product';
import SingleProduct from '../components/cards/SingleProduct';
import { useSelector } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';

const ViewProduct = () => {
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);

    const [star, setStar] = useState(0);

    const { user } = useSelector(state => ({ ...state }));

    const { slug } = useParams();

    useEffect(() => {
        loadSingleProduct();
    }, [slug]);

    useEffect(() => {
        if (product.ratings && user) {
            let existingRatingObject = product.ratings.find(
                (ele) => ele.postedBy.toString() === user._id.toString()
            );
            existingRatingObject && setStar(existingRatingObject.star);
        };
    });

    const loadSingleProduct = () => {
        getProduct(slug).then((res => {
            setProduct(res.data);

            // load related product
            getRelated(res.data._id).then(res => setRelated(res.data));
        }));
    };

    const starChange = (newRating, name) => {
        setStar(newRating);

        productStar(name, newRating, user.token)
            .then(res => {
                // console.log('Response at productStar', res.data.title, res.data.ratings);
                // console.log('User ', user.name, user.token);
                loadSingleProduct();  // load at real time to show rating
            });
        // console.table(newRating, name);
    };

    return (
        <div className='container-fluid'>
            <div className='row pt-4'>
                <SingleProduct product={product} starChange={starChange} star={star} />
            </div>
            <div className='row'>
                <div className='col text-center pt-5 pb-5'>
                    <hr />
                    <h4>Related Product</h4>
                    <hr />
                </div>
            </div>
            <div className='row pb-3'>

                {related.length ? related.map(r => (
                    <div key={r._id} className='col-md-4 img'>
                        <ProductCard
                            product={r}
                        />
                    </div>
                ))
                    :
                    (
                        <div className='text-center text-info col pb-2'>No Products Pound</div>
                    )
                }
            </div>
        </div>
    );
};

export default ViewProduct;