import React from "react";
import StarRatings from "react-star-ratings";

export const showRating = (p) => {
    if (p && p.ratings) {
        let ratingArray = p && p.ratings;
        let total = [];

        let length = ratingArray.length;
        // console.log('Length of rating array', length);

        ratingArray.map(r => total.push(r.star));
        // suppose [1,2,3,4,5,7] then for reduced loops like wise
        // 1+2 = 3, 
        // 3+3 = 6,
        // 6+4 = 10,
        // 10+5 = 15
        // 15 + 7 = 22
        let totalReduced = total.reduce((prev, next) => prev + next, 0);
        // console.log('total Reduced', totalReduced);

        let highest = length * 5;
        // console.log('Highest rating possible', highest);

        let result = (totalReduced * 5) / highest;
        // console.log('Rating result', result);


        return (
            <div className="text-center pt-3 pb-5">
                <span>
                    <StarRatings starDimension="20px" starSpacing="2px" starRatedColor="red" rating={result} editing={false} />{" "}({p.ratings.length})
                </span>
            </div>
        );
    }
};