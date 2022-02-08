import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import StripeCheckout from '../components/StripeCheckout';

import '../stripe.css';

// load stripe outside of components to avoid re-creating stripe onbject on every render
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
    return (
        <div className='container p-5 text-center'>
            <Elements stripe={promise}>
                <h4>Complete Your Purchase</h4>
                <div className='col-md-8 offset-md-2'>
                    <StripeCheckout />
                </div>
            </Elements>
        </div>
    );
};

export default Payment;