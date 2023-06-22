/** @format */

import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import {
  setNewPinnedPost,
  updatePost,
  newPosts,
} from "../../redux/post/post.actions";
import {
  addToSpam,
  removeToSpam,
  addEmojiLike,
  removeEmojiLike,
  addEmojiDislike,
  removeEmojiDislike,
  addEmojiHeart,
  removeEmojiHeart,
  addEmojParty,
  removeEmojiParty,
  addEmojHaha,
  removeEmojiHaha,
} from "../../redux/user/user.actions";
import calculatePercentage from "../../utils/calculatePercentage";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GoComment } from "react-icons/go";
import { AiOutlineDislike } from "react-icons/ai";
import {
  addNewComment,
  removeAllComments,
  putCommentLast,
} from "../../redux/comment/comment.actions";
import PostCommentCard from "../PostCommentCard/PostCommentCard";
import { selectPost } from "../../redux/post/post.actions";
import CustomPostFormModal from "../modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";

const InformationPostCardFooter = ({
  postData,
  user,
  token,
  setPinnedPost,
  setComments,
  removeAllComments,
  comments,
  putCommentLast,
  selectPost,
  updatedComment,
}) => {
  const { t } = useTranslation(["common"]);
  const [postId, setPostId] = React.useState("");
  const [commentsData, setCommentsData] = React.useState([]);
  const [lastResponseData, setLastResponseData] = React.useState(1);
  const [sortedBy, setSortedBy] = React.useState("popular");
  const [openCommentModal, setOpenCommentModal] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [isBtnDisable, setIsBtnDisable] = React.useState(true);
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const [isVisble, setIsVisble] = React.useState(false);
  const [text, setText] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [gif, setGif] = React.useState("");

  const handleClick = (value, id, data) => {
    if (value === "pin") {
      setPostId(id);
      setOpenPinnedModal(true);
    } else if (value === "book") {
      setPostId(id);
      setOpenBookModal(true);
    } else if (value === "hide") {
      setPostId(id);
      setOpenHideModal(true);
    } else if (value === "unhide") {
      setPostId(id);
      setOpenHideModal(true);
    } else if (value === "spam") {
      // handlePostSpamHandler(id)
    } else if (value === "share") {
      // setPost(data);
      // setOpenShareModal(true);
      setPostId(id);
    } else if (value === "comment") {
      setPostId(id);
      setOpenCommentModal(true);
      fetchComments();
      selectPost(data);
      selectPost(data);
    } else if (value === "delete") {
      setPostId(id);
      setOpenDeleteModal(true);
    } else if (value === "analytics") {
      // alert(id);
      // navigate(`/post/analytics/${id}`)
    } else if (value === "edit") {
      setPost(data);
      setOpenEditModal(true);
      setPostContent(data.content);
      setPostImage(data.image);
      setPostId(id);
      // setPostGif(data.gif)
    } else if (value === "likeList") {
      setOpenLikeList(true);
      setPostId(id);
      fetchUserLike();
    } else if (value === "visit") {
      navigate(`/user/profile/${data.u_dun}`);
    } else if (value === "post_body") {
      // alert(id)
      navigate(`/full/post/${id}`);
    } else if (value === "helpful") {
      // setPostId(id);
      handlehelpfullNews(id);
    } else if (value === "unhelpful") {
      // setPostId(id);
      handleUnhelpfullNews(id);
    } else if (value === "misleading") {
      // setPostId(id);
      handleMisLeadingInfo(id);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value.slice(0, 100));
  };

  // *** Handle unhelpfull information
  const handleUnhelpfullNews = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/unhelpfull/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPinnedPost(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle helpfull information
  const handlehelpfullNews = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/helpfull/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle misleading information
  const handleMisLeadingInfo = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/misleading/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPinnedPost(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle post comment
  const handlePostComment = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("comment", text);
    formdata.append("c_img", image);
    formdata.append("gif", gif);
    formdata.append("postId", id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setText("");
        setImage("");
        setPrevImage("");
        putCommentLast(result);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Fetch comments
  const fetchComments = () => {
    console.log("Page ", page);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/${postId}?sortedBy=${sortedBy}&page=${page}&limit=${limit}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.length > 0) {
          setComments(result);
        } else {
          console.log("*** NOT ***");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const closeCommentModal = () => {
    setOpenCommentModal(false);
    removeAllComments([]);
    // setPage(1)
  };

  React.useEffect(() => {
    if (openCommentModal) {
      fetchComments();
    } else {
      removeAllComments([]);
    }
  }, [postId, page, updatedComment]);

  const scrollHandler = (e) => {
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
      // fetchComments();
    }
  };

  React.useEffect(() => {
    if (!text.trim()) {
      setIsBtnDisable(true);
    } else {
      setIsBtnDisable(false);
    }
  }, [text]);

  return (
    <div className='info_post_footer'>
      {/* Clickable buttos */}
      <div
        className='upper_footer_btn'
        onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
        <button className='info_post_btn help_btn' id='helpful'>
          Helpfull
        </button>
        <button className='info_post_btn cmnt_btn' id='comment'>
          Comment
        </button>
        <button className='info_post_btn unhelp_btn' id='unhelpful'>
          Unelpfull
        </button>
        <button className='info_post_btn misleading_btn' id='misleading'>
          Misleading
        </button>
      </div>

      {/* information post footer */}
      <div className='lower_footer_btn'>
        <button className='helpfull_count_icon info_post_btn'>
          <FaHandHoldingHeart />
          <span className='helpfull_count'>
            {postData.hlp_c ? postData.hlp_c : "0"}
          </span>
        </button>

        {/* Comment */}
        <button className='cmnt_count_icon info_post_btn'>
          <GoComment />
          <span className='helpfull_count'>{postData.c_c}</span>
        </button>

        {/* Unhelpefull */}
        <button className='unhelpfull_count_icon info_post_btn'>
          <AiOutlineDislike />
          <span className='helpfull_count'>
            {postData.hlp_c > 0 ? (
              <>{calculatePercentage(postData.unhlp_c, postData.hlp_c)}%</>
            ) : (
              "0"
            )}
          </span>
        </button>

        {/* MisLeading */}
        <button className='misleading_count_icon info_post_btn'>
          <AiOutlineDislike />
          <span className='helpfull_count'>{postData.misld_c}</span>
        </button>
      </div>

      {/* Render comment form */}
      <div className='comment_form_section'>
        {/* Preview image */}
        {prevImage && (
          <div className='prev_image_section'>
            <img src={prevImage} className='prev_image_box' />
            <button className='close_btn_prev' onClick={closeCmntImage}>
              <AiOutlineClose />
            </button>
          </div>
        )}

        <input
          type='text'
          placeholder='Enter your comment'
          className='comment_input'
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 100))}
        />

        {/* Gallery */}
        <label htmlFor='post_comment_file' className='modal_file_icon'>
          <span class='icon-gallery'></span>
        </label>
        <input
          type='file'
          id='post_comment_file'
          className='input_file'
          onChange={(e) => handleImageChange(e)}
          accept='image/*'
          required
        />

        {/* Emoji */}
        <button
          className='modal_post_icons_button'
          onClick={() => setOpenEmojiIcons(true)}>
          <span class='icon-emogy'></span>
        </button>

        {/* Gif */}
        <button className='modal_post_icons_button'>
          <span class='icon-gif'></span>
        </button>
        <button
          className='comment_post_btn'
          onClick={() => handlePostComment(postData.id)}>
          {isBtnLoading ? (
            <span class='icon-loading spinner'></span>
          ) : (
            <>Post</>
          )}
        </button>
      </div>

      {/* Rendering */}
      {/* Preview image */}
      {prevImage && (
        <div className='full_post_prev_image_section'>
          <img src={prevImage} className='full_postprev_image_box' />
          <button className='full_postclose_btn_prev' onClick={closeCmntImage}>
            <AiOutlineClose />
          </button>
        </div>
      )}

      {/* Rendering all the comments */}
      <div className='full_post_comment_section'>
        {(comments || []).length > 0 ? (
          <div className='full_post_comment_card_section'>
            {comments.map((data) => (
              <PostCommentCard key={data.id} commentData={data} />
            ))}

            {comments.length < postData.c_c && (
              <button
                className='load_more_btn'
                onClick={() => setPage((prev) => prev + 1)}>
                Load more
              </button>
            )}
          </div>
        ) : (
          <div className='empty_full_post_comment'>{t("No Comment found")}</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  spamList: state.user.spam,

  emoji_likes: state.user.emoji_likes,
  emoji_heart: state.user.emoji_heart,
  emoji_haha: state.user.emoji_haha,
  emoji_party: state.user.emoji_party,
  emoji_dislikes: state.user.emoji_dislikes,
  comments: state.comment.comments,
  updatedComment: state.comment.updateComment,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  removeToSpam: (post) => dispatch(removeToSpam(post)),

  addEmojiLike: (data) => dispatch(addEmojiLike(data)),
  removeEmojiLike: (data) => dispatch(removeEmojiLike(data)),
  addEmojiDislike: (data) => dispatch(addEmojiDislike(data)),
  removeEmojiDislike: (data) => dispatch(removeEmojiDislike(data)),
  addEmojiHeart: (data) => dispatch(addEmojiHeart(data)),
  removeEmojiHeart: (data) => dispatch(removeEmojiHeart(data)),
  addEmojParty: (data) => dispatch(addEmojParty(data)),
  removeEmojiParty: (data) => dispatch(removeEmojiParty(data)),
  addEmojHaha: (data) => dispatch(addEmojHaha(data)),
  removeEmojiHaha: (data) => dispatch(removeEmojiHaha(data)),

  setComments: (data) => dispatch(addNewComment(data)),
  removeAllComments: (data) => dispatch(removeAllComments(data)),
  putCommentLast: (data) => dispatch(putCommentLast(data)),
  selectPost: (data) => dispatch(selectPost(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InformationPostCardFooter);
