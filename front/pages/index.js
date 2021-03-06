// import React from 'react'; next는 이 구문이 필요없다.

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import AppLayout from "../components/AppLayout";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import wrapper from "../store/configureStore";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const {
    mainPosts,
    hasMorePosts,
    loadPostsLoading,
    retweetError,
  } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  // useEffect(() => {
  // dispatch({
  //   type: LOAD_MY_INFO_REQUEST,
  // });
  // dispatch({
  //   type: LOAD_POSTS_REQUEST,
  // });
  // }, []);

  useEffect(() => {
    function onScroll() {
      // console.log(
      //   window.scrollY,
      //   document.documentElement.clientHeight, //화면에 보이는 부분
      //   document.documentElement.scrollHeight,
      // );

      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      )
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;

          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    console.log(
      context.req.cookie,
      "getServersideProps, index!!",
      context.store.user,
    );

    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
); // 화면을 그리기전에 서버쪽에서 먼저 실행
export default Home;
