import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(5);
    let history = useHistory();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
        }, 1000);

        count === 0 && history.push('/');
        console.log('user redirected from route 1');
        // cleanup
        return () => clearInterval(interval);
    }, [count, history]);

    return (
        <div className='container p-5 text-center'>
            <h4>Redirecting in {count} seconds</h4>
        </div>
    );
};

export default LoadingToRedirect;
