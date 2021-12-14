import {all} from "redux-saga/effects";
import registerUserSaga from "./sagas/usersSagas";
import facebookUserSaga from "./sagas/usersSagas";
import loginUserSaga from "./sagas/usersSagas";

export function* rootSagas() {
    yield all([
        ...registerUserSaga,
        ...loginUserSaga,
        ...facebookUserSaga,
    ])
}