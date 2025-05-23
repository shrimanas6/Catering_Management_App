import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customerInfo: {},
    sessionDetails: {},
    sessionFood: { morning: [], afternoon: [], night: [] },
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setSessionDetails: (state, action) => {
            state.sessionDetails = action.payload;
        },
        addFoodItem: (state, action) => {
            const { session, food } = action.payload;
            state.sessionFood[session].push(food);
        },
        removeFoodItem: (state, action) => {
            const { session, index } = action.payload;
            state.sessionFood[session].splice(index, 1);
        },
    },
});

export const { setCustomerInfo, setSessionDetails, addFoodItem, removeFoodItem } = orderSlice.actions;
export default orderSlice.reducer;
