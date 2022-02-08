import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
    createCategory,
    getCategories,
    removeCategory
} from '../../../functions/category';

import CategoryForm from '../../../components/forms/CategoryForm';

import AdminNav from '../../../components/nav/AdminNav';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [keyword, setKeyword] = useState('');

    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        loadedCategories();
    }, []);

    const loadedCategories = () =>
        getCategories().then(category => setCategory(category.data));

    const submitHandler = event => {
        event.preventDefault();
        setLoading(true);

        createCategory({ name }, user.token)
            .then(res => {
                console.log('Created Category'.res);
                setLoading(false);
                setName('');
                toast.success('Succesfully Created category', res);
                loadedCategories();
            })
            .catch(err => {
                console.log('Error from category', err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };

    const deleteHandler = slug => {
        let answer = window.confirm('Are you sure to delete');
        if (answer) {
            setLoading(true);
            removeCategory(slug, user.token)
                .then(res => {
                    setLoading(false);
                    toast.error(`${res.data.name} deleted`);
                    loadedCategories();
                })
                .catch(err => {
                    if (err.response.status === 400) {
                        setLoading(false);
                        toast.error(err.response.data);
                    }
                });
        }
    };

    const searchHandler = (event) => {
        event.preventDefault();
        setKeyword(event.target.value.toLowerCase());
    };

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

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
                        <h4>Create Category</h4>
                    )}
                    <CategoryForm
                        submitHandler={submitHandler}
                        name={name}
                        setName={setName}
                    />

                    <input
                        type={search}
                        placeholder="filter"
                        value={keyword}
                        onChange={searchHandler}
                        className="form-control mb-4"
                    />

                    {category.filter(searched(keyword)).map(category => (
                        <div className="alert alert-primary" key={category._id}>
                            {category.name}
                            <span
                                onClick={() => deleteHandler(category.slug)}
                                className="btn btn-sm float-right"
                            >
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/category/${category.slug}`}>
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


