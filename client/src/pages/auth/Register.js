import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';


const Register = () => {
    const [email, setEmail] = useState('');

    const history = useHistory();
    const { user } = useSelector((state) => ({ ...state }));


    useEffect(() => {
        if (user && user.token) {
            history.push('/');
        }
    }, [user, history]);
    // const auth = auth.getAuth();

    const submitHandler = (event => {
        event.preventDefault();

        if (!email && !email.includes('@')) {
            return toast.error('Please input a valid email');
        }

        console.log('process', process.env.REACT_APP_REGISTER_REDIRECT_URL);
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,
        };

        auth.sendSignInLinkToEmail(email, config);
        // showing toast
        toast.success(
            `Email sent to ${email}. Please click to the link to complete your registration`
        );

        // saving data to localstorage 
        window.localStorage.setItem('emailForRegistration', email);

        // clear state
        setEmail('');
    });

    const registerForm = () => (
        <form onSubmit={submitHandler}>
            <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
            />

            <button type="submit" className="btn btn-raised m-2">
                Register
            </button>
        </form>
    );

    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {registerForm()}
                </div>
            </div>
        </div>
    );
};

export default Register;
