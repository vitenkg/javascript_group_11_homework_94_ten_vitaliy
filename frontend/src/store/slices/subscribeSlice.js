import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    subscriptionUsers: [],
    eventsUsers: [],
    subscribeUserId: '',
};

const name = 'subscribe';

const subscribeSlice = createSlice({
    name,
    initialState,
    reducers: {
        addNewSubscribe(state, action) {
            state.subscriptionUsers = [...state.subscriptionUsers, action.payload];
            state.subscriptionUsers = state.subscriptionUsers.sort(function(a,b) {
                if (a.displayName < b.displayName)
                    return -1;
                if (a.displayName > b.displayName)
                    return 1;
                return 0;
            });
        },
        userConnectedSub(state, action) {
            state.subscriptionUsers = action.payload;
            state.subscriptionUsers = state.subscriptionUsers.sort(function(a,b) {
                if (a.displayName < b.displayName)
                    return -1;
                if (a.displayName > b.displayName)
                    return 1;
                return 0;
            });
        },
        eraseAllSub(state, action) {
            state.subscriptionUsers = [];
            state.eventsUsers = [];
        },
        eventsRequest(state, action) {
            state.subscribeUserId = action.payload;
        },
        loadSubEvents(state, action) {
            state.eventsUsers = action.payload;
            state.subscribeUserId = '';

        },
    }
});

export default subscribeSlice;