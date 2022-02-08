import React from "react";

const LocalSearchForm = (props) => {
    const { keyword, setKeyword } = props;

    const searchHandler = (event) => {
        event.preventDefault();
        setKeyword(event.target.value.toLowerCase());
    };

    return (
        <input
            type='search'
            placeholder="filter"
            value={keyword}
            onChange={searchHandler}
            className="form-control mb-4"
        />
    );
};

export default LocalSearchForm;