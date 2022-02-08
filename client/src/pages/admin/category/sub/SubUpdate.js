import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getCategories } from '../../../../functions/category';

import CategoryForm from '../../../../components/forms/CategoryForm';
import AdminNav from '../../../../components/nav/AdminNav';
import { useHistory, useParams } from 'react-router-dom';
import { getSub, updateSub } from '../../../../functions/sub';

const SubUpdate = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState('');

    const { user } = useSelector(state => ({ ...state }));

    let params = useParams();
    let history = useHistory();

    useEffect(() => {
        loadedCategories();
        loadSub();
    }, []);

    const loadedCategories = () =>
        getCategories().then(category => setCategories(category.data));

    const loadSub = () => {
        getSub(params.slug).then(sub => {
            setName(sub.data.name);
            setParent(sub.data.parent);
        });
    };

    const submitHandler = event => {
        event.preventDefault();
        setLoading(true);

        updateSub(params.slug, { name, parent }, user.token)
            .then(res => {
                console.log('Sub Created Category', res);
                setLoading(false);
                setName('');
                toast.success('Succesfully Created Sub category', res);
                history.push('/admin/sub');
            })
            .catch(err => {
                console.log('Error from sub category', err);
                setLoading(false);
                toast.error(err.response.data);
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
                        <h4>Update Sub Category</h4>
                    )}

                    <div className="form-group">
                        <label> Parent Category</label>
                        <select
                            name="category"
                            className="form-control"
                            onChange={e => setParent(e.target.value)}
                        >
                            <option>Please Select</option>
                            {categories.length > 0 &&
                                categories.map(category => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                        selected={category._id === parent}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <CategoryForm
                        submitHandler={submitHandler}
                        name={name}
                        setName={setName}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubUpdate;
