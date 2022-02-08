import { useDispatch } from 'react-redux';

let initialState = [{}];

if (typeof window !== 'undefined') {
    initialState = JSON.parse(localStorage.getItem('cart'));
} else {
    initialState = [];
}

const cartReducer = (state = initialState, action) => {
    // const dispatch = useDispatch();
    switch (action.type) {
        case "ADD_TO_CART":
            return action.payload;
        // case "REMOVE_ITEM_FROM_CART": {
        //     // let cart = [];

        //     // if (typeof window !== 'undefined') {
        //     //     if (localStorage.getItem('cart'));
        //     //     cart = JSON.parse(localStorage.getItem('cart'));
        //     // }
        //     // if (cart && cart.length > 0) {
        //     return {

        //         state.map((p, i) => {
        //             if (p._id === action.payload) {
        //                  state.splice(i, 1);
        //             }
        //         });
        //         // }
        //         localStorage.setItem('cart', JSON.stringify(state));
        //     }

        // }
        default:
            return state;
    }
};

export default cartReducer;