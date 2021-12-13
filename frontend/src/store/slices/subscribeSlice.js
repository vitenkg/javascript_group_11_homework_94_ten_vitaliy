import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    subscriptionUsers: [],
    eventsUsers: null,

};

const name = 'subscribe';

const subscribeSlice = createSlice({
    name,
    initialState,
    reducers: {
        addNewSubscribe(state, action) {
            state.subscriptionUsers = [...state.subscriptionUsers, action.payload];
        },
        userConnectedSub(state, action) {
            console.log(action.payload);
            state.subscriptionUsers = [...state.subscriptionUsers, action.payload];
        },
    }
});

export default subscribeSlice;