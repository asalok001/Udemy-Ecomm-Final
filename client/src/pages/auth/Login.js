import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { createOrUpdateUser } from '../../functions/auth';

import { auth, googleAuthProvider } from '../../firebase';

const Login = () => {
    const [email, setEmail] = useState('punam.sonu03@gmail.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        let intended = history.location.state;
        if (intended) {
            return;
        }
        else {
            if (user && user.token) {
                history.push('/');
            }
        }
        // return () => { };
    }, [user, history]);

    const dispatch = useDispatch();

    const roleBasedRedirect = (res) => {
        // takes out the location from where redirected to this page
        // suppose login after click to rating a product and should be
        //  redirect back to the page 
        let intended = history.location.state;
        if (intended) {
            history.push(intended.from);   // pushed back to the intended page
        }
        else {
            if (res.data.role === 'admin') {
                history.push('/admin/dashboard');
            } else {
                history.push('/user/history');
            }
        }

    };

    const submitHandler = event => {
        event.preventDefault();

        const login = async () => {
            setLoading(true);

            try {
                const result = await auth.signInWithEmailAndPassword(email, password);

                const { user } = result;
                const idToken = await user.getIdTokenResult();

                createOrUpdateUser(idToken.token)
                    .then(res => {
                        setLoading(false);
                        dispatch({
                            type: 'LOGGED_IN_USER',
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                role: res.data.role,
                                _id: res.data._id,
                                token: idToken.token,
                            },
                        });
                        toast.success('Login Successfully');
                        roleBasedRedirect(res);
                        console.log('payload from login');
                    }).catch((err) => {
                        setLoading(false);
                        toast.error(err);
                    });
            } catch (error) {
                setLoading(false);
                toast.error(error);
            }
        };

        login();
        console.log('Login executed');
    };

    const googleLoginHandler = async () => {
        auth
            .signInWithPopup(googleAuthProvider)
            .then(async result => {
                const { user } = result;
                const idToken = await user.getIdTokenResult();

                createOrUpdateUser(idToken.token)
                    .then(res => {
                        dispatch({
                            type: 'LOGGED_IN_USER',
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                role: res.data.role,
                                _id: res.data._id,
                                token: idToken.token
                            }
                        });
                        roleBasedRedirect(res);
                    });

                // history.push('/');
            })
            .catch(error => {
                console.log(error);
                toast.error(error.message);
            });
    };

    const loginForm = () => (
        <form>
            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your Email"
                    autoFocus
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your Password"
                />
            </div>

            <Button
                onClick={submitHandler}
                type="primary"
                className="mb-5"
                block
                shape="round"
                icon={<MailOutlined />}
                size="large"
                disabled={!email || password.length < 6}
            >
                Login with Email and Password
            </Button>

            {/* <button type="submit" className="btn btn-primary btn-raised m-2 c-blue">
                Login */}
            {/* </button> */}
        </form>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {!loading ? (
                        <h4>Login</h4>
                    ) : (
                        <h4 className="text-danger">Loading...</h4>
                    )}
                    {loginForm()}

                    <Button
                        onClick={googleLoginHandler}
                        type="danger"
                        className="mb-5"
                        block
                        shape="round"
                        icon={<GoogleOutlined />}
                        size="large"
                    >
                        Login with Google
                    </Button>

                    <Link to="/forget/password" className="text-danger">
                        Forget Password
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
