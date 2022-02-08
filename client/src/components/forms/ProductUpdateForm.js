import React from 'react';
import { Select } from 'antd';
const { Option } = Select;

const ProductUpdateForm = props => {
    const {
        title,
        description,
        price,
        quantity,
        colors,
        color,
        category,
        brands,
        brand,
        shipping,
        subs,
    } = props.values;

    const {
        values,
        handleChange,
        handleSubmit,
        categories,
        handleCategoryChange,
        setValues,
        subOptions,
        showsubs,
        arrayOfSubs,
        setArrayOfSubs,
        selectedCategory
    } = props;

    // console.log('Cats 2 = ', category);

    return (
        <form onSubmit={handleSubmit}>
            <div className="from-group">
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={title}
                    onChange={handleChange}
                />
            </div>

            <div className="from-group">
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={description}
                    onChange={handleChange}
                />
            </div>

            <div className="from-group">
                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={price}
                    onChange={handleChange}
                />
            </div>

            <div className="from-group">
                <label>Shipping</label>
                <select
                    value={shipping === 'YES' ? 'YES' : 'NO'}
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                >
                    {/* <option>Please Select</option> */}
                    <option value="NO">No</option>
                    <option value="YES">Yes</option>
                </select>
            </div>

            <div className="from-group">
                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange}
                />
            </div>

            <div className="from-group">
                <label>Colors</label>
                <select value={color} name="color" className="form-control" onChange={handleChange}>

                    {colors.map(c => (
                        <option key={c} value={c.value}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div className="from-group">
                <label>Brands</label>
                <select value={brand} name="brand" className="form-control" onChange={handleChange}>
                    <option>Please Select</option>
                    {brands.map(b => (
                        <option key={b} value={b.value}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>

            <div className="from-group">
                <label>Category</label>
                <select
                    value={selectedCategory ? selectedCategory : category._id}
                    name="category"
                    className="form-control"
                    onChange={handleCategoryChange}
                >
                    {/* <option>{category ? category.name : 'Please Select'}</option> */}
                    {categories.length > 0 &&
                        categories.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                </select>
            </div>

            <div>
                <label>Sub Category</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Please Select"
                    value={arrayOfSubs}
                    onChange={value => setArrayOfSubs(value)}
                >

                    {subOptions.length &&
                        subOptions.map(s => (
                            <Option key={s._id} value={s._id}>
                                {s.name}
                            </Option>
                        ))}
                </Select>
            </div>

            <br />
            <button className="btn btn-outline-info">Save</button>
        </form>
    );
};

export default ProductUpdateForm;
