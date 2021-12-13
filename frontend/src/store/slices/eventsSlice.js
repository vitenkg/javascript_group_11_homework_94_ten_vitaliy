import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    events: null,

};

const name = 'event';

const eventsSlice = createSlice({
    name,
    initialState,
    reducers: {
        deleteEvent(state, action) {
            state.events = state.events.filter(e => e._id !== action.payload);
        },
        userConnected(state, action) {
            state.events = action.payload
        },
        addNewEvent(state, action) {
            state.events = [...state.events, action.payload];
            state.events = state.events.sort(function(a,b) {
                if ( a.datetime < b.datetime )
                    return 1;
                if ( a.datetime > b.datetime )
                    return -1;
                return 0;
            })
        }

    },
});

export default eventsSlice;