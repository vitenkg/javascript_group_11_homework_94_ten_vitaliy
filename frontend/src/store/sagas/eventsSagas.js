import {takeEvery, put} from "redux-saga/effects";
import axiosApi from "../../axiosApi";
import {toast} from "react-toastify";
import {deleteEvent, userConnected} from "../actions/eventsActions";

export function* eventsSagas() {
    try {

    } catch (e) {

    }
}

export function* connectSagas() {
    try {

    } catch (e) {

    }
}

const eventSaga = [
    // takeEvery(deleteEvent, eventsSagas),
    // takeEvery(userConnected, connectSagas),

];

export default eventSaga;