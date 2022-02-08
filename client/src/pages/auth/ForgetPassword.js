import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'antd';

import { auth } from '../../firebase';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            history.push('/');
        }
    }, [user, history]);

    const forgetPasswordHandler = event => {
        event.preventDefault();
        const forgetPassword = async () => {
            setLoading(true);

            const config = {
                url: process.env.REACT_APP_FORGET_PASSWORD_REDIRECT_URL,
                handleCodeInApp: true
            };

            await auth
                .sendPasswordResetEmail(email, config)
                .then(() => {
                    setEmail('');
                    setLoading(false);
                    toast.success('Check Your email for passwowrd reset link');
                })
                .catch(error => {
                    setLoading(false);
                    toast.error(error.message);
                });
        };

        forgetPassword();
    };

    return (
        <div className="container col-md-6 offset-md-3 p-5">
            {loading ? (
                <h4 className="text-danger">Loading...</h4>
            ) : (
                <h4>Forget Password</h4>
            )}

            <form onSubmit={forgetPasswordHandler}>
                <input
                    type={email}
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Type Your Email"
                    autoFocus
                />
                <br />
                <Button type="primary" className="btn btn-raised" disabled={!email}>
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default ForgetPassword;
