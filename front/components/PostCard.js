/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useCallback } from "react";
import { Card, Popover, Button, Avatar, List, Comment } from "antd";
import {
  RetweetOutlined,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
  SmileTwoTone,
} from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import FollowButton from "./FollowButton";
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
} from "../reducers/post";

const PostCard = ({ post }) => {
  // console.log("dd", post);
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const id = me?.id; // new!! optional changin 연산자
  // const id = useSelector ((state)=>state.user.me?.id);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const liked = post.Likers.find((v) => v.id === id);

  const onLike = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [post]);
  const onUnLike = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [post]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);
  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);
  return (
    <div>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartOutlined
              key="heart"
              twoToneColor="#eb2f96"
              onClick={onUnLike}
            />
          ) : (
            <SmileTwoTone key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <ButtonGroup>
                {id && post.User.id && (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      삭제
                    </Button>
                  </>
                )}
              </ButtonGroup>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          // eslint-disable-next-line react/prop-types
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
      {/* <CommentForm />
      <Comments /> */}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    // shape 로 객체 구체화
    id: PropTypes.number,
    User: PropTypes.object,
    contnet: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
export default PostCard;
