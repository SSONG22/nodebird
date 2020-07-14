/* eslint-disable react/react-in-jsx-scope */
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Router from "next/router";
import {
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWERS_REQUEST,
} from "../reducers/user";

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);
  if (!me) {
    return null;
  }
  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm></NicknameEditForm>
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
