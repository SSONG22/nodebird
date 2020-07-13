import React, { useCallback, useEffect } from "react";
import { Input, Form, Button } from "antd";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import useInput from "../hooks/useInput";
// eslint-disable-next-line no-unused-vars
import { ADD_COMMENT_REQUEST, addComment } from "../reducers/post";

const CommentForm = ({ post }) => {
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentDone, addCommentLoading } = useSelector(
    (state) => state.post,
  );
  const dispatch = useDispatch();

  const [commentText, onChangeCommentText, setCommentText] = useInput("");

  const onSubmitComment = useCallback(() => {
    console.log(post.id, commentText);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    }); // 액션객체로 놓는 방법 / 불러오는 방법
  }, [commentText, id]);

  useEffect(() => {
    if (addCommentDone) setCommentText("");
  }, [addCommentDone]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} />
        <Button type="primary" htmlType="submit" loading={addCommentLoading}>
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
