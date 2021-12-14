import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    subscriptionUsers: [],
    eventsUsers: [],
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
            state.subscriptionUsers = action.payload;
        },
        eraseAllSub(state, action) {
            state.subscriptionUsers = [];
            state.eventsUsers = [];
        }
    }
});

export default subscribeSlice;