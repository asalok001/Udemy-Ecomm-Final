import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrUpdateUser } from '../../functions/auth';

const CompleteRegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const { user } = useSelector(state => ({ ...state }));

    const history = useHistory();

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'));
    }, []);

    const submitHandler = (event => {
        event.preventDefault();
        const verifyEmail = async () => {
            if (!email && !password) {
                toast.error('Email and password is required');
            }

            if (password.length < 6) {
                toast.error('Password must be 6 characters long');
            }

            try {
                const result = await auth.signInWithEmailLink(
                    email,
                    window.location.href
                );

                console.log('Result', result);

                if (result.user.emailVerified) {
                    window.localStorage.removeItem('emailForRegistration');

                    let user = auth.currentUser;  // extracting current user
                    await user.updatePassword(password);  // updating password

                    const IdToken = await user.getIdTokenResult();  // getting token

                    console.log('user', user, 'token', IdToken);
                    // Setting Redux Store

                    createOrUpdateUser(IdToken.token)
                        .then(res => {
                            dispatch({
                                type: 'LOGGED_IN_USER',
                                payload: {
                                    name: res.data.name,
                                    email: res.data.email,
                                    role: res.data.role,
                                    _id: res.data._id,
                                    token: IdToken.token
                                }
                            });
                            console.log('payload from registration');
                        }).catch(err => {
                            console.log(err);
                        });

                    // redirect
                    history.push('/');
                }
            } catch (error) {
                // console.log(error);
                toast.error(error.message);
            }

            console.log('Email', email);
        };

        verifyEmail();
    });

    const completeRegistrationForm = () => (
        <form onSubmit={submitHandler}>
            <input
                type="email"
                className="form-control"
                value={email}
                disabled
            />

            <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
            />
            <b />
            <button type="submit" className="btn btn-raised m-2">
                Complete Registration
            </button>
        </form>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {completeRegistrationForm()}
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationForm;
