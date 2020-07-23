/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-pattern */
import { Form, Input, Button } from "antd";
import React, { useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE,
  ADD_POST_REQUEST,
  UPDATE_POST_REQUEST,
} from "../reducers/post";
import useInput from "../hooks/useInput";
import PropTypes from "prop-types";
import Router from "next/router";

const PostForm = ({ postContent, postImage, postId, setUpdateForm }) => {
  const { imagePaths, addPostDone, updatePostDone } = useSelector(
    (state) => state.post,
  );
  const [text, onChangeText, setText] = useInput("");
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    const formData = new FormData();
    imagePaths.forEach((i) => {
      formData.append("image", i);
    });
    formData.append("content", text);
    console.log(formData);
    // console.log(text, formData.append("content", text));

    if (postContent === undefined) {
      dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
    } else {
      dispatch({
        type: UPDATE_POST_REQUEST,
        id: postId,
        data: { content: text },
      });
    }
  }, [text, imagePaths]);

  const imageInput = useRef();

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: REMOVE_IMAGE,
        data: index,
      });
    },
    [],
  );

  const onChangeImages = useCallback((e) => {
    let imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  useEffect(() => {
    if (addPostDone) setText("");
  }, [addPostDone]);

  useEffect(() => {
    if (updatePostDone) {
      console.log(setUpdateForm);
      if (setUpdateForm) setUpdateForm(false);
    }
  }, [updatePostDone]);

  useEffect(() => {
    if (postContent !== undefined) {
      setText(postContent);
      // dispatch({
      //   type: UPLOAD_IMAGES_REQUEST,
      //   data: postImage
      // })
    }
  }, []);

  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        name="image"
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
      />
      <div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          {postContent !== undefined ? "수정" : "짹짹"}
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img src={v} style={{ width: "200px" }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

PostForm.propTypes = {
  postId: PropTypes.number,
  postContent: PropTypes.string,
  postImage: PropTypes.arrayOf(PropTypes.object),
  // setUpdateForm: PropTypes.undefined,
  post: PropTypes.shape({
    // shape 로 객체 구체화
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.object,
  }).isRequired,
};

export default PostForm;
