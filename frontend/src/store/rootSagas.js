import {all} from "redux-saga/effects";
import registerUserSaga from "./sagas/usersSagas";
import facebookUserSaga from "./sagas/usersSagas";
import loginUserSaga from "./sagas/usersSagas";
// import eventsSagas from "./sagas/eventsSagas";

export function* rootSagas() {
    yield all([
        // ...eventsSagas,
        ...registerUserSaga,
        ...loginUserSaga,
        ...facebookUserSaga,
    ])
}