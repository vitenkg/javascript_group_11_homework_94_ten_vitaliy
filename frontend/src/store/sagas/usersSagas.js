import {put, takeEvery} from "redux-saga/effects";
import axiosApi from "../../axiosApi";
import {historyPush} from "../actions/historyActions";
import {toast} from "react-toastify";
import {
    avatarUser,
    facebookUserRequest,
    googleUserRequest,
    loginUserFailure,
    loginUserRequest,
    loginUserSuccess,
    logoutUser,
    logoutUserRequest,
    registerUserFailure,
    registerUserRequest,
    registerUserSuccess
} from "../actions/usersActions";
import {apiURL} from "../../config";
import {eraseAllSub} from "../actions/subscribeActions";


export function* registerUserSaga({payload: data}) {
    try {
        const response = yield axiosApi.post('/users', data);
        yield put(registerUserSuccess(response.data));
        yield put(historyPush('/'));
        toast.success('Register successfully');
    } catch (e) {
        toast.error(e.response.data.global);
        yield put(registerUserFailure(e.response.data));
    }
}

export function* loginUserSaga({payload: data}) {
    try {
        const response = yield axiosApi.post('/users/sessions', data);
        yield put(loginUserSuccess(response.data.user));
        if (response.data.user.image) {
            yield put(avatarUser(apiURL + '/uploads/' + response.data.user.image));
        }

        yield put(historyPush('/'));
        toast.success('Login successfully');
    } catch (e) {
        toast.error(e.response.data.global);
        yield put(loginUserFailure(e.response.data));
    }
}

export function* facebookUserSaga({payload: data}) {
    try {
        const response = yield axiosApi.post('/users/facebookLogin', data);
        yield put(loginUserSuccess(response.data.user));
        yield put(avatarUser(data.picture.data.url));
        yield put(historyPush('/'));
        toast.success('Login successfully');
    } catch (e) {
        toast.error(e.response.data.global);
        yield put(loginUserFailure(e.response.data));
    }
}

export function* googleUserSaga({payload: data}) {

    try {
        const response = yield axiosApi.post('/users/googleLogin', {
            tokenId: data.tokenId,
            googleId: data.googleId,
        });
        yield put(loginUserSuccess(response.data.user));
        yield put(avatarUser(data.profileObj.imageUrl));
        yield put(historyPush('/'));
        toast.success('Login successfully');
    } catch (e) {
        toast.error(e.response.data.global);
        yield put(loginUserFailure(e.response.data));
    }
}

export  function* loginOut({payload: data}) {
    try {
        yield axiosApi.delete('/users/sessions', {
            headers: {
                'Authorization': data.token,
            },
        })
        yield put(logoutUser());
        yield put(eraseAllSub());
        yield put(historyPush('/'));
    } catch (e) {
        toast.error(e.response.data.global);
        yield put(loginUserFailure(e.response.data));
    }
}

const userSaga = [
    takeEvery(registerUserRequest, registerUserSaga),
    takeEvery(loginUserRequest, loginUserSaga),
    takeEvery(facebookUserRequest, facebookUserSaga),
    takeEvery(googleUserRequest, googleUserSaga),
    takeEvery(logoutUserRequest, loginOut)
];

export default userSaga;