import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { auth } from '../../firebase';
import UserNav from '../../components/nav/UserNav';

const Password = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async event => {
        event.preventDefault();
        setLoading(true);

        await auth.currentUser
            .updatePassword(password)
            .then(() => {
                setLoading(false);
                setPassword('');
                toast.success('Password updated Successfully');
            })
            .catch(err => {
                toast.error(err);
                setLoading(false);
            });
    };

    const passwordUpdateForm = () => {
        return (
            <form onSubmit={submitHandler}>
                Hello
                <div className="form-group">
                    <label>Your Password</label>
                    <input
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Password"
                        value={password}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="bn btn-primary m-1"
                        disabled={!password || password.length < 6 || loading}
                    >
                        Submit
                    </button>
                </div>
            </form>
        );
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    {loading ? <h4 className='text-danger'>Loading...</h4> : <h4>Password Update</h4>}
                    {passwordUpdateForm()}
                </div>
            </div>
        </div>
    );
};

export default Password;
