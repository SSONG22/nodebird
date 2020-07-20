/* eslint-disable react/react-in-jsx-scope */
import AppLayout from "../components/AppLayout";
import Head from "next/head";
import { useCallback, useState } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { Form, Input, Checkbox, Button } from "antd";
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { useEffect } from "react";
import wrapper from "../store/configureStore";
import axios from "axios";
import { END } from "redux-saga";

const FormWrapper = styled(Form)`
  padding: 10px;
`;
const ButtonWrapper = styled.div`
  margin-top: 10px;
`;
const ErrorMsg = styled.div`
  color: red;
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me && me.id) {
      Router.replace("/"); // 기록에서 사라짐
    }
  }, [me && me.id]);
  useEffect(() => {
    if (signUpDone) {
      Router.replace("/");
    }
  }, [signUpDone]);
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [nickname, onChangeNickname] = useInput("");

  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password],
  );

  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) return setPasswordError(true);
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, nickname, password },
    });
  }, [email, password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <FormWrapper onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">아이다</label>
          <br />
          <Input
            name="user-email"
            type="email" //자동으로 이메일 타입 검사
            value={email}
            required
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="nickname">닉네임</label>
          <br />
          <Input
            name="nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <Input
            name="password"
            type="password"
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호 체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
          />
          {passwordError && <ErrorMsg>비밀번호가 일치하지 않습니다.</ErrorMsg>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            약관에 동의합니다.
          </Checkbox>
          {termError && <ErrorMsg>약관에 동의하셔야 합니다.</ErrorMsg>}
        </div>
        <ButtonWrapper>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            가입하기
          </Button>
        </ButtonWrapper>
      </FormWrapper>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
); // 화면을 그리기전에 서버쪽에서 먼저 실행

export default SignUp;
