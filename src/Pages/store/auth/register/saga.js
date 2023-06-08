import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"

//Include Both Helper File with needed methods
import { initFirebaseBackend } from "../../../helpers/firebase_helper"

// // initialize relavant method of both Auth
const fireBaseBackend = initFirebaseBackend()

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }) {
  try {
    if (fireBaseBackend) {
      const response = yield call(
        fireBaseBackend.registerUser,
        user.email,
        user.password,
        user.username
      )
      yield put(registerUserSuccessful(response))
    }
  } catch (error) {
    yield put(registerUserFailed(error))
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
