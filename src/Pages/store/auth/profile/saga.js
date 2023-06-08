import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { EDIT_PROFILE } from "./actionTypes"
import { profileSuccess, profileError } from "./actions"

//Include Both Helper File with needed methods
import { initFirebaseBackend } from "../../../helpers/firebase_helper"

const fireBaseBackend = initFirebaseBackend()

function* editProfile({ payload: { user } }) {
  try {
    if (fireBaseBackend) {
      const response = yield call(
        fireBaseBackend.editProfileAPI,
        user.username,
        user.idx
      )
      yield put(profileSuccess(response))
    }
  } catch (error) {
    yield put(profileError(error))
  }
}
export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile)
}

function* ProfileSaga() {
  yield all([fork(watchProfile)])
}

export default ProfileSaga
