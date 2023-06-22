/** @format */

import React from "react";
import { connect } from "react-redux";
import { t } from "i18next";
import {
  addGroupPost,
  updateGroupPost,
  deleteGroupPost,
  addPostComment,
  updatePostComment,
  deletePostComment,
} from "../../redux/Group/group.actions";
import ReplyCard from "./ReplyCard";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { GrMore } from "react-icons/gr";

const Reply = ({ cmntId, user, token }) => {
  const [content, setContent] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [replies, setReplies] = React.useState([]);

  // *** Handle submit reply
  const submitReply = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      content: content,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/${cmntId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setContent("");
        setIsDisable(true);
        setIsLoading(false);
        setReplies((prev) => [...prev, result.replies]);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    if (!content.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [content]);

  // *** Fetch all replies
  const fetchComments = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/${cmntId}?page=${page}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setReplies((prev) => [...result, ...prev]);
      })
      .catch((error) => console.log("error", error));
  };

  const scrollHandler = (e) => {
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    // console.log(sh)
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  React.useEffect(() => {
    if (cmntId) {
      fetchComments(cmntId);
    }
  }, [page, cmntId]);

  return (
    <div className='reply_container'>
      <div className='reply_form_container'>
        <input
          type='text'
          placeholder='Comment reply'
          className='reply_input'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className={isDisable ? "reply_btn disable_reply_btn" : "reply_btn"}
          disabled={isDisable}
          onClick={submitReply}>
          Send
        </button>
      </div>

      {/* Comment reply container */}
      <div className='reply_card_container' onScroll={(e) => scrollHandler(e)}>
        {(replies || []).length > 0 ? (
          <div>
            {replies.map((reply) => (
              <ReplyCard key={reply.id} replyData={reply} cmntId={cmntId} />
            ))}
          </div>
        ) : (
          <div>No reply found</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  likeList: state.user.likes,
  spamList: state.user.spam,
  sharesList: state.user.shares,
  dislikesList: state.user.dislikes,
  updatePost: state.group.updatePost,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  letePost: (post) => dispatch(deletePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),

  addToLikeArray: (post) => dispatch(addToLike(post)),
  removeToLike: (post) => dispatch(removeToLike(post)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  removeToSpam: (post) => dispatch(removeToSpam(post)),
  removeToShares: (post) => dispatch(removeToShares(post)),
  addToShares: (post) => dispatch(addToShares(post)),
  addToDislikes: (post) => dispatch(addToDislikes(post)),
  removeToDislikes: (post) => dispatch(removeToDislikes(post)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Reply);
