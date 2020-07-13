/* eslint-disable no-unused-vars */
import {
  all,
  takeLatest,
  put,
  delay,
  fork,
  call,
  throttle,
} from "redux-saga/effects";
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
} from "../reducers/post";
import axios from "axios";
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";
import shortid from "shortid";

function loadPostsAPI(data) {
  return axios.get("/posts");
}

function* loadPosts(action) {
  try {
    const result = yield call(loadPostsAPI, action.data);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: result.data,
      // data: generateDummyPost(10),
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_POSTS_FAILURE,
      data: error,
    });
  }
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function addPostAPI(data) {
  return axios.post(
    "http://localhost:3065/post",
    { content: data },
    {
      withCredentials: true,
    },
  );
}
function* addPost(action) {
  console.log("addpost");
  try {
    const result = yield call(addPostAPI, action.data);
    // const id = shortid.generate()
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
    console.log(result.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function removePostAPI() {
  return axios.post("/api/post");
}
function* removePost(action) {
  console.log("addpost");
  try {
    yield delay(1000);
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
    // const result = yield call(addPostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function addCommentAPI(data) {
  //POST /post/1/comment
  return axios.post(`http://localhost:3065/post/${data.postId}/comment`, data, {
    withCredentials: true,
  });
}
function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: err.response.data,
    });
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPosts),
  ]);
}
