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
  addHelpful,
  removeHelpful,
  addUnhelpful,
  removeUnhelpful,
  addMisleading,
  removeMisleading,
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
  addHelpful,
  removeHelpful,
  addUnhelpful,
  removeUnhelpful,
  addMisleading,
  removeMisleading,
  helpful,
  unhelpful,
  misleading,
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
  const [helpfulCount, setHelpfulCount] = React.useState(postData.hlp_c || 0);
  const [unhelpCount, setUnhelpCount] = React.useState(postData.unhlp_c || 0);
  const [misleadingCount, setMisleadingCount] = React.useState(
    postData.misld_c || 0
  );

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
    if (helpful.includes(id)) {
      removeHelpful(id);
      setHelpfulCount((p) => p - 1);
      addUnhelpful(id);
      setUnhelpCount((p) => p + 1);
    } else if (misleading.includes(id)) {
      removeMisleading(id);
      setMisleadingCount((p) => p - 1);
      addUnhelpful(id);
      setUnhelpCount((p) => p + 1);
    } else {
      if (unhelpful.includes(id)) {
        removeUnhelpful(id);
        setUnhelpCount((p) => p - 1);
      } else {
        addUnhelpful(id);
        setUnhelpCount((p) => p + 1);
      }
    }
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
        // setPinnedPost(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle helpfull information
  const handlehelpfullNews = (id) => {
    if (unhelpful.includes(id)) {
      removeUnhelpful(id);
      setUnhelpCount((p) => p - 1);
      addHelpful(id);
      setHelpfulCount((p) => p + 1);
    } else if (misleading.includes(id)) {
      removeMisleading(id);
      setMisleadingCount((p) => p - 1);
    } else {
      if (helpful.includes(id)) {
        removeHelpful(id);
        setHelpfulCount((p) => p - 1);
      } else {
        addHelpful(id);
        setHelpfulCount((p) => p + 1);
      }
    }
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
    if (helpful.includes(id)) {
      removeHelpful(id);
      setHelpfulCount((p) => p - 1);
      addMisleading(id);
      setMisleadingCount((p) => p + 1);
    } else if (unhelpful.includes(id)) {
      removeUnhelpful(id);
      setUnhelpCount((p) => p - 1);
      addMisleading(id);
      setMisleadingCount((p) => p + 1);
    } else {
      if (misleading.includes(id)) {
        removeMisleading(id);
        setMisleadingCount((p) => p - 1);
      } else {
        addMisleading(id);
        setMisleadingCount((p) => p + 1);
      }
    }
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
        // setPinnedPost(response.data)
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
      {/* Post comment modal */}
      {openCommentModal && (
        <CustomPostFormModal
          title={
            <div className='comment_modal_title_section'>
              <div className='modal_comment_box'>
                <button
                  className='modal_header_btn'
                  onClick={closeCommentModal}>
                  <BiArrowBack />
                </button>
                <span className='modal_header_title'>Comment</span>
              </div>
              {!isBtnDisable && (
                <button
                  className='comment_post_btn'
                  onClick={() => handlePostComment(postData.id)}>
                  {isBtnLoading ? (
                    <span class='icon-loading'></span>
                  ) : (
                    <>Post</>
                  )}
                </button>
              )}
            </div>
          }
          body={
            <div className='comment_modal_body_section'>
              {/* Commennt sorting section */}
              <div className='comment_sorting_section'></div>
              <div className='comment_card_container'>
                {(comments || []).length > 0 ? (
                  <React.Fragment>
                    <div
                      className='comment_card_section'
                      onScroll={(e) => scrollHandler(e)}>
                      {[...new Set(comments)].map((data) => (
                        <PostCommentCard key={data.id} commentData={data} />
                      ))}
                    </div>
                  </React.Fragment>
                ) : (
                  <div className='empty_comment_card_section'>
                    {t("No Comment found")}
                  </div>
                )}
              </div>
            </div>
          }
          footer={
            <div className='comment_modal_footer_section'>
              {!isVisble ? (
                <div>
                  <input
                    type='text'
                    placeholder='Enter your comment'
                    className='comment_input'
                    onFocus={() => setIsVisble(true)}
                  />
                </div>
              ) : (
                <div className='comment_form_section'>
                  {/* Preview image */}
                  {prevImage && (
                    <div className='prev_image_section'>
                      <img src={prevImage} className='prev_image_box' />
                      <button
                        className='close_btn_prev'
                        onClick={closeCmntImage}>
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
                  <label
                    htmlFor='post_comment_file'
                    className='modal_file_icon'>
                    <span class='icon-gallery'></span>
                  </label>
                  <input
                    type='file'
                    id='post_comment_file'
                    className='input_file'
                    onChange={(e) => handleImageChange(e)}
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
                </div>
              )}
            </div>
          }
        />
      )}

      <div
        className='social_post_footer_one'
        onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
        {/* Ḥelpfull information */}
        <button className='info_post_btn' id='helpful'>
          <FaHandHoldingHeart />
        </button>

        {/* Comment information */}
        <button className='info_post_btn' id='comment'>
          <GoComment />
        </button>

        {/* Unhelpfull information */}
        <button className='info_post_btn' id='unhelpful'>
          <AiOutlineDislike />
        </button>

        {/* Misleading information */}
        <button className='info_post_btn' id='unhelpful'>
          <AiOutlineDislike />
        </button>
      </div>

      <div
        className='social_post_footer_one'
        onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
        <button className='info_post_text_btn' id='helpful'>
          Helpfull
          <span className='helpfull_count'>{helpfulCount}</span>
        </button>

        <button className='info_post_text_btn' id='comment'>
          Comment
          <span className='helpfull_count'>{postData.c_c}</span>
        </button>

        <button className='info_post_text_btn' id='unhelpful'>
          Unelpfull
          <span className='helpfull_count'>
            {postData.hlp_c > 0 ? (
              <>{calculatePercentage(unhelpCount, helpfulCount)}%</>
            ) : (
              "0"
            )}
          </span>
        </button>

        <button className='info_post_text_btn' id='misleading'>
          Misleading
          <span className='helpfull_count'>{misleadingCount}</span>
        </button>
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
  helpful: state.user.helpful,
  unhelpful: state.user.unhelpful,
  misleading: state.user.misleading,
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

  addHelpful: (data) => dispatch(addHelpful(data)),
  removeHelpful: (data) => dispatch(removeHelpful(data)),
  addUnhelpful: (data) => dispatch(addUnhelpful(data)),
  removeUnhelpful: (data) => dispatch(removeUnhelpful(data)),
  addMisleading: (data) => dispatch(addMisleading(data)),
  removeMisleading: (data) => dispatch(removeMisleading(data)),

  setComments: (data) => dispatch(addNewComment(data)),
  removeAllComments: (data) => dispatch(removeAllComments(data)),
  putCommentLast: (data) => dispatch(putCommentLast(data)),
  selectPost: (data) => dispatch(selectPost(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InformationPostCardFooter);
