/** @format */

// import React from 'react';
// import { useTranslation } from "react-i18next";
import React from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import {
  setNewPinnedPost,
  updatePost,
  newPosts,
} from "../../redux/post/post.actions";
import {
  addReliableNews,
  removeReliableNews,
  addInterstingNews,
  removeInterstingNews,
  addFakeNews,
  removeFakeNews,
} from "../../redux/user/user.actions";
// import calculatePercentage  from "../../utils/calculatePercentage";
import calculatePercentage from "../../utils/calculatePercentage";
import { GoComment } from "react-icons/go";
import { FaHandHoldingHeart } from "react-icons/fa";
import {
  addNewComment,
  removeAllComments,
  putCommentLast,
} from "../../redux/comment/comment.actions";
import PostCommentCard from "../PostCommentCard/PostCommentCard";
import { selectPost } from "../../redux/post/post.actions";
import CustomPostFormModal from "../modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";

import { BiBlock } from "react-icons/bi";
import { FaRegHeart, FaHeart, FaRegCommentAlt } from "react-icons/fa";

const NewsPostCardFooter = ({
  postData,
  token,
  setPinnedPost,
  setComments,
  removeAllComments,
  comments,
  putCommentLast,
  selectPost,
  updatedComment,
  addReliableNews,
  removeReliableNews,
  addInterstingNews,
  removeInterstingNews,
  addFakeNews,
  removeFakeNews,
  fake,
  reliable,
  intersting,
}) => {
  const { t } = useTranslation(["common"]);
  const [postId, setPostId] = React.useState("");
  const [sortedBy, setSortedBy] = React.useState("new");
  const [openCommentModal, setOpenCommentModal] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [isBtnDisable, setIsBtnDisable] = React.useState(true);
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const [isVisble, setIsVisble] = React.useState(false);
  const [text, setText] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [reliableCount, setReliableCount] = React.useState(
    postData.relib_c || 0
  );
  const [intersetCount, setInterestCount] = React.useState(
    postData.intrst_c || 0
  );
  const [fakeCount, setFakeCount] = React.useState(postData.fake_c || 0);

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
    } else if (value === "delete") {
      setPostId(id);
      setOpenDeleteModal(true);
    } else if (value === "analytics") {
    } else if (value === "edit") {
      setOpenEditModal(true);
      setPostContent(data.content);
      setPostId(id);
      setPostGif(data.gif);
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
      // handlehelpfullNews(id);
    } else if (value === "unhelpful") {
      // setPostId(id);
      // handleUnhelpfullNews(id)
    } else if (value === "reliable") {
      // alert('reliable')
      handleRelibleNews(id);
    } else if (value === "interesting") {
      // alert('reliable')
      handleInterestingNews(id);
    } else if (value === "fake") {
      // alert('reliable')
      handleFakeNews(id);
    }
  };

  React.useEffect(() => {
    if (!message.trim()) {
      if (!image) {
        setIsDisable(true);
      } else {
        setIsDisable(false);
      }
    } else {
      setIsDisable(false);
    }
  }, [message, image]);

  React.useEffect(() => {
    if (!text.trim()) {
      setIsBtnDisable(true);
    } else {
      setIsBtnDisable(false);
    }
  }, [text]);

  // *** Handle reliable news
  const handleRelibleNews = (id) => {
    if (intersting.includes(id)) {
      removeInterstingNews(id);
      setInterestCount((prev) => prev - 1);
      addReliableNews(id);
      setReliableCount((prev) => prev + 1);
    } else if (fake.includes(id)) {
      removeFakeNews(id);
      setFakeCount((prev) => prev - 1);
      addReliableNews(id);
      setReliableCount((prev) => prev + 1);
    } else {
      if (reliable.includes(id)) {
        removeReliableNews(id);
        setReliableCount((prev) => prev - 1);
      } else {
        addReliableNews(id);
        setReliableCount((prev) => prev + 1);
      }
    }
    var axios = require("axios");
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/reliable/${id}`,
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

  // *** Handle intersting news
  const handleInterestingNews = (id) => {
    if (reliable.includes(id)) {
      removeReliableNews(id);
      setReliableCount((prev) => prev - 1);
      addInterstingNews(id);
      setInterestCount((prev) => prev + 1);
    } else if (fake.includes(id)) {
      removeFakeNews(id);
      setFakeCount((prev) => prev - 1);
      addInterstingNews(id);
      setInterestCount((prev) => prev + 1);
    } else {
      if (intersting.includes(id)) {
        removeInterstingNews(id);
        setInterestCount((prev) => prev - 1);
      } else {
        addInterstingNews(id);
        setInterestCount((prev) => prev + 1);
      }
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/interesting/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // setPinnedPost(result)
      })
      .catch((error) => console.log("error", error));
  };

  // *** Handle Fake news
  const handleFakeNews = (id) => {
    if (reliable.includes(id)) {
      removeReliableNews(id);
      setReliableCount((prev) => prev - 1);
      addFakeNews(id);
      setFakeCount((prev) => prev + 1);
    } else if (intersting.includes(id)) {
      removeInterstingNews(id);
      setInterestCount((prev) => prev - 1);
      addFakeNews(id);
      setFakeCount((prev) => prev + 1);
    } else {
      if (fake.includes(id)) {
        removeFakeNews(id);
        setFakeCount((prev) => prev - 1);
      } else {
        addFakeNews(id);
        setFakeCount((prev) => prev + 1);
      }
    }
    console.log("FAKE");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/fake/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // setPinnedPost(result)
      })
      .catch((error) => console.log("error", error));
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

  return (
    <React.Fragment>
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
                    <span class='icon-loading spinner'></span>
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
        className='social_post_footer_section'
        onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
        {/* Reliable button */}
        <button className='news_post_btn' id='reliable'>
          <FaRegHeart
            className={reliable.includes(postData.id) ? "help_icon" : ""}
            id='reliable'
          />
        </button>

        {/* Post comment icons */}
        <button id='comment' className='news_post_btn'>
          {/* <BiCommentDetail id="comment" /> */}
          <FaRegCommentAlt id='comment' />{" "}
        </button>

        {/* Post interesting icons */}
        <button className='news_post_btn' id='interesting'>
          <AiOutlineLike
            id='interesting'
            className={intersting.includes(postData.id) ? "unhelp_btn" : ""}
          />
        </button>

        {/* Post fake icons */}
        <button className='news_post_btn' id='fake'>
          <BiBlock
            id='fake'
            className={fake.includes(postData.id) ? "fake_btn" : ""}
          />
        </button>
      </div>

      <div
        className='social_post_footer_section'
        onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
        {/* Reliable button */}
        <button className='news_post_news_btn' id='reliable'>
          <span className='news_post_news_btn_count'>
            Reliable: {reliableCount || 0}
          </span>
        </button>

        {/* Comment button */}
        <button className='news_post_news_btn' id='reliable'>
          <span className='news_post_news_btn_count'>
            Comment: {postData.c_c || 0}
          </span>
        </button>

        {/* interesting button */}
        <button className='news_post_news_btn' id='reliable'>
          <span className='news_post_news_btn_count'>
            Interesting: {intersetCount || 0}
          </span>
        </button>

        {/* Reliable button */}
        <button className='news_post_news_btn' id='reliable'>
          <span className='news_post_news_btn_count'>
            Fake:
            {fakeCount > 0 ? (
              <>{calculatePercentage(reliableCount, fakeCount)}%</>
            ) : (
              "0"
            )}
          </span>
        </button>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  reliable: state.user.reliable,
  intersting: state.user.intersting,
  comments: state.comment.comments,
  updatedComment: state.comment.updateComment,
  fake: state.user.fake,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addReliableNews: (post) => dispatch(addReliableNews(post)),
  removeReliableNews: (post) => dispatch(removeReliableNews(post)),
  addInterstingNews: (post) => dispatch(addInterstingNews(post)),
  removeInterstingNews: (post) => dispatch(removeInterstingNews(post)),
  addFakeNews: (post) => dispatch(addFakeNews(post)),
  removeFakeNews: (post) => dispatch(removeFakeNews(post)),

  setComments: (data) => dispatch(addNewComment(data)),
  removeAllComments: (data) => dispatch(removeAllComments(data)),
  putCommentLast: (data) => dispatch(putCommentLast(data)),
  selectPost: (data) => dispatch(selectPost(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsPostCardFooter);
