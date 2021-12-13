import {combineReducers} from "redux";
import thunk from "redux-thunk";
import {initialState} from "./slices/usersSlice";
import {loadFromLocalStorage, saveToLocalStorage} from "./localStorage";
import axiosApi from "../axiosApi";
import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {rootSagas} from "./rootSagas";
import usersSlice from "./slices/usersSlice";
import eventsSlice from "./slices/eventsSlice";
import subscribeSlice from "./slices/subscribeSlice";

const rootReducer = combineReducers({
  'users': usersSlice.reducer,
  'event': eventsSlice.reducer,
  'subscribe': subscribeSlice.reducer,
});

const persistedState = loadFromLocalStorage();

const sagaMiddleware = createSagaMiddleware();

const middleware = [
    thunk,
    sagaMiddleware,
];

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: true,
  preloadedState: persistedState,
});


sagaMiddleware.run(rootSagas);

store.subscribe(() => {
  saveToLocalStorage({
    users: {
      ...initialState,
      user: store.getState().users.user
    },
  });
});

axiosApi.interceptors.request.use(config => {
  try {
    config.headers['Authorization'] = store.getState().users.user.token
  } catch (e) {}

  return config;
});

axiosApi.interceptors.response.use(res => res, e => {
  if (!e.response) {
    e.response = {data: {global: 'No internet'}};
  }

  throw e;
});

export default store;