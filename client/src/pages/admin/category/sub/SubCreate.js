import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getCategories } from '../../../../functions/category';

import CategoryForm from '../../../../components/forms/CategoryForm';
import LocalSearchForm from '../../../../components/forms/LocalSearchForm';

import AdminNav from '../../../../components/nav/AdminNav';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { createSub, getSubs, removeSub } from '../../../../functions/sub';

const SubCreate = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subs, setSubs] = useState([]);
    const [category, setCategory] = useState('');
    const [keyword, setKeyword] = useState('');

    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        loadedCategories();
        loadSubs();
    }, []);

    const loadedCategories = () =>
        getCategories().then(category => setCategories(category.data));

    const loadSubs = () => {
        getSubs().then(sub => setSubs(sub.data));
    };

    const submitHandler = event => {
        event.preventDefault();
        setLoading(true);

        createSub({ name, parent: category }, user.token)
            .then(res => {
                console.log('Sub Created Category', res);
                setLoading(false);
                setName('');
                loadSubs();
                toast.success('Succesfully Created Sub category', res);
            })
            .catch(err => {
                console.log('Error from sub category', err);
                setLoading(false);
                toast.error(err.response.data);
            });
    };

    const deleteHandler = async (slug) => {
        let answer = window.confirm('Are you sure to delete');
        console.log('Slug Delete', slug);
        if (answer) {
            setLoading(true);
            removeSub(slug, user.token)
                .then(res => {
                    console.log('response', res);
                    setLoading(false);
                    toast.error(`${res.data.name} deleted`);
                    loadSubs();
                })
                .catch(err => {

                    setLoading(false);
                    toast.error(err.response.data);

                });
        }
    };

    const searched = keyword => c => c.name.toLowerCase().includes(keyword);

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
                        <h4>Create Sub Category</h4>
                    )}

                    <div className="form-group">
                        <label> Parent Category</label>
                        <select
                            name="category"
                            className="form-control"
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option>Please Select</option>
                            {categories.length > 0 &&
                                categories.map(category => (
                                    <option key={category._id} value={category._id}>
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

                    <LocalSearchForm keyword={keyword} setKeyword={setKeyword} />

                    {subs.filter(searched(keyword)).map(sub => (
                        <div className="alert alert-primary" key={sub._id}>
                            {sub.name}
                            <span
                                onClick={() => deleteHandler(sub.slug)}
                                className="btn btn-sm float-right"
                            >
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/sub/${sub.slug}`}>
                                <span className="btn btn-sm float-right">
                                    <EditOutlined className="text-warning" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubCreate;
