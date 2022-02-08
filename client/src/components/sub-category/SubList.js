import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";

const SubList = () => {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSubs()
            .then(s => {
                console.log('Sub Category at home', s.data);
                setSubs(s.data);
                setLoading(false);
            });
    }, []);

    const showSubs = () =>
        subs.map(s => (
            <div key={s._id}
                className='col btn btn-outline-primary btn-block m-3'
            >
                {<Link to={`/subs/${s.slug}`}>{s.name}</Link>}
            </div>
        ));


    return (
        <div className="container">
            <div className="row">
                {loading ? (
                    <h4 className="tet-center">Loading...</h4>
                ) : (
                    showSubs()
                )}
            </div>
        </div>
    );
};

export default SubList;