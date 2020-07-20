import { HYDRATE } from "next-redux-wrapper";
import user from "./user";
import post from "./post";
import { combineReducers } from "redux";

// (이전상태, 액션) => 다음상태
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};
// const rootReducer = combinReducers({
// user,post
// }) 와 똑같다, 확장한느낌..
export default rootReducer;
