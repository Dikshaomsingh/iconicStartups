import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN  } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess  } from "./actions";

//Include Both Helper File with needed methods
import { initFirebaseBackend } from "../../../helpers/firebase_helper";

const fireBaseBackend = initFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  try {
    if (fireBaseBackend) {
      const response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      );
      yield put(loginSuccess(response));
    }
    history('/');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("isAdmin");

    if (fireBaseBackend) {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (fireBaseBackend) {
      //const fireBaseBackend = getFirebaseBackend();
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      );
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
    history('/dashboard');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
