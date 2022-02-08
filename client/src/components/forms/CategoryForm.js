import React from 'react';

const CategoryForm = (props) => {
    const { submitHandler, name, setName } = props;

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Name</label>
                <input
                    className="form-control"
                    // type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                    required
                />
                <br />
                <button type='submit' className="btn btn-outline-primary">Save</button>
            </div>
        </form>
    );
};

export default CategoryForm;
