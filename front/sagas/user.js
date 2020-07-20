/* eslint-disable no-unused-vars */
import { all, takeLatest, put, fork, call } from "redux-saga/effects";
import axios from "axios";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  FOLLOW_FAILURE,
  FOLLOW_SUCCESS,
  UNFOLLOW_SUCCESS,
  UNFOLLOW_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_SUCCESS,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_FAILURE,
  LOAD_USER_SUCCESS,
} from "../reducers/user";

function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_USER_FAILURE,
      data: error.response.data,
    });
  }
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function loadMyInfoAPI() {
  return axios.get("/user");
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      data: error.response.data,
    });
  }
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function logInAPI(data) {
  return axios.post("/user/login", data);
}
function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}
function logOutAPI() {
  return axios.post("/user/logout");
}
function* logOut(action) {
  try {
    const result = yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function signUpAPI(data) {
  console.log(data);
  return axios.post("/user", data);
}
function* signUp(action) {
  console.log(action.data);
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result.data);
    // yield delay(1000);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}
function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}
function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}
function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}
function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function changeNicknameAPI(data) {
  return axios.patch("/user/nickname", data);
}
function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      data: error.response.data,
    });
  }
}
function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}
function loadFollowersAPI() {
  return axios.get("/user/followers");
}
function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      data: error.response.data,
    });
  }
}
function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function loadFollowingsAPI() {
  return axios.get("/user/followings");
}
function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      data: error.response.data,
    });
  }
}
function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadUser),
    fork(watchLoadMyInfo),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchChangeNickname),
    fork(watchLoadFollowings),
    fork(watchLoadFollowers),
  ]);
}
