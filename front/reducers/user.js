/* eslint-disable no-unused-vars */
import produce from "immer";

export const initialState = {
  logInLoading: false,
  logInDone: false,
  logInError: null,
  logOutLoading: false, //로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, //로그아웃 시도중
  signUpDone: false,
  signUpError: null,
  me: null,
  signUpData: {},
  loginData: {},
  followLoading: false,
  followDone: false,
  followError: null,
  unfollowLoading: false,
  unfollowDone: false,
  unfollowError: null,

  loadMyInfoLoading: false,
  loadMyInfoDone: false,
  loadMyInfoError: null,

  loadUserLoading: false,
  loadUserDone: false,
  loadUserError: null,
  userInfo: null,

  changeNicknameLoading: false,
  changeNicknameDone: false,
  changeNicknameError: null,

  loadFollowersLoading: false,
  loadFollowersDone: false,
  loadFollowersError: null,
  loadFollowingsLoading: false,
  loadFollowingsDone: false,
  loadFollowingsError: null,
};

//action
export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
export const FOLLOW_FAILURE = "FOLLOW_FAILURE";

export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";

export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST";
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS";
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST"; // 특정 사용자 정보
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
export const CHANGE_NICKNAME_FAILURE = "CHANGE_NICKNAME_FAILURE";

export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE";

export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

// const dummyUser = (data) => ({
//   ...data,
//   nickname: "chee99",
//   id: 1,
//   Posts: [{ id: 1, contents: "" }],
//   Followings: [{ nickname: "부기초" }, { nickname: "체리초" }],
//   Followers: [{ nickname: "부기초" }, { nickname: "체리초" }],
// });

export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

//reducer
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_FOLLOWERS_REQUEST:
        draft.loadFollowersDone = false;
        draft.loadFollowersLoading = true;
        draft.loadFollowersError = null;
        break;
      case LOAD_FOLLOWERS_SUCCESS:
        draft.me.Followers = action.data;
        draft.loadFollowersDone = true;
        draft.loadFollowersLoading = false;
        draft.loadFollowersError = null;
        break;
      case LOAD_FOLLOWERS_FAILURE:
        draft.loadFollowersDone = false;
        draft.loadFollowersLoading = false;
        draft.loadFollowersError = action.data;
        break;

      case LOAD_FOLLOWINGS_REQUEST:
        draft.loadFollowingsDone = false;
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_SUCCESS:
        draft.me.Followings = action.data;
        draft.loadFollowingsDone = true;
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_FAILURE:
        draft.loadFollowingsDone = false;
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsError = action.data;
        break;

      case LOAD_USER_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserDone = false;
        draft.loadUserError = null;
        break;
      case LOAD_USER_SUCCESS:
        draft.loadUserLoading = false;
        draft.loadUserDone = true;
        draft.userInfo = action.data;
        break;
      case LOAD_USER_FAILURE:
        draft.loadUserLoading = false;
        draft.loadUserDone = true;
        draft.loadUserError = action.data;
        break;

      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoDone = false;
        draft.loadMyInfoError = null;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.me = action.data;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.loadMyInfoError = action.data;
        break;

      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings.push({ id: action.data.UserId });
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followDone = true;
        draft.followError = action.data;
        break;

      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;
      case UNFOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings = draft.me.Followings.filter(
          (v) => v.id !== action.data.UserId,
        );
        break;
      case UNFOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followDone = true;
        draft.followError = action.data;
        break;

      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInDone = false;
        draft.logInError = null;
        break;
      case LOG_IN_SUCCESS:
        draft.me = action.data;
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.logInError = null;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInDone = true;
        draft.logInError = action.data;
        break;

      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.me = null;
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.logOutError = null;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.logOutError = action.data;
        break;

      case SIGN_UP_REQUEST:
        draft.signUpDone = false;
        draft.signUpLoading = true;
        draft.signUpError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpDone = true;
        draft.signUpLoading = false;
        draft.signUpError = null;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpDone = false;
        draft.signUpLoading = false;
        draft.signUpError = action.data;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameDone = false;
        draft.changeNicknameLoading = true;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.me.nickname = action.data.nickname;
        draft.changeNicknameDone = true;
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameDone = false;
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.data;
        break;
      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;
      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter(
          (v) => v.id !== action.data.PostId,
        );
        break;
      default:
        break;
    }
  });

export default reducer;
