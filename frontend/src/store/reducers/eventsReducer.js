
const initialState = {
    events: [],

};

const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'USER_CONNECTED':
            return {...state, users: action.payload.users, events: action.payload.messages};
        case 'NEW_EVENT':
            return {...state, messages: [...state.messages, action.payload]};
        case 'DELETE_EVENT':
            return {...state, messages: state.messages.filter(m => m._id !== action.payload)};
        default:
            return state;
    }
};

export default eventsReducer;

