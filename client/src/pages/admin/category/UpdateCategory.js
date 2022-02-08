import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useHistory, match, useParams } from 'react-router-dom';
import {
    getCategory,
    updateCategory
} from '../../../functions/category';
import CategoryForm from '../../../components/forms/CategoryForm';

import AdminNav from '../../../components/nav/AdminNav';
// import { useHistory } from 'react-router-dom';


const UpdateCategory = (props) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useSelector(state => ({ ...state }));

    // console.log('user at update', user.token);

    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        loadedCategory();
        console.log('Match', params);
    }, []);

    const loadedCategory = () => {
        getCategory(params.slug).then(category => {
            console.log('Ctry', category);
            setName(category.data.name);
        });
        // console.log('Name = ', cName);
    };

    const submitHandler = event => {
        event.preventDefault();

        setLoading(true);
        updateCategory(params.slug, { name }, user.token)
            .then(res => {
                console.log('Created Category'.res);
                setLoading(false);
                setName('');
                toast.success('Succesfully Updated category', res);
                history.push('/admin/category');
            })
            .catch(err => {
                console.log('Error from category', err);
                setLoading(false);
                if (err.response.status === 401) toast.error(err.response.data);
            });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Update Category</h4>
                    )}
                    <br />
                    <CategoryForm submitHandler={submitHandler} name={name} setName={setName} />
                </div>
            </div>
        </div>
    );
};

export default UpdateCategory;
