import React from 'react';
import { Card, Skeleton } from 'antd';

const LoadingCard = ({ count }) => {
    const cards = () => {
        let totalcards = [];

        for (let i = 0; i < count; i++) {
            totalcards.push(
                <Card className='col-md-4' key={i}>
                    <Skeleton active></Skeleton>
                </Card>
            );
        };
        return totalcards;
    };

    return <div className='row pb-5'>{cards()}</div>;
};

export default LoadingCard;