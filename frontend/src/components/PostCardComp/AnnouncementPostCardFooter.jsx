/** @format */

import React from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { AiOutlineClose, AiOutlineDislike } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
  newComments,
  updateComments,
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

const AnnouncementPostCardFooter = ({
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
  const [sortedBy, setSortedBy] = React.useState("popular");
  const [message, setMessage] = React.useState("");
  const [isFocus, setIsFocus] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const [openCommentModal, setOpenCommentModal] = React.useState(false);
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
    } else if (value === "like") {
      // alert('reliable')
      handleLikeAnnouncement(id);
    } else if (value === "importent") {
      // alert('importent')
      hanldeImportantAnnouncement(id);
    } else if (value === "scam") {
      // alert('reliable')
      handleScamAnnouncement(id);
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

  // *** Handle like announcement
  const handleLikeAnnouncement = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/announcement/like/${id}`,
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

  // *** Handle important announcement
  const hanldeImportantAnnouncement = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/announcement/impotent/${id}`,
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

  // *** Handle Scam announcement
  const handleScamAnnouncement = (id) => {
    var axios = require("axios");

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/announcement/scam/${id}`,
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

  React.useEffect(() => {
    if (!text.trim()) {
      setIsBtnDisable(true);
    } else {
      setIsBtnDisable(false);
    }
  }, [text]);

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
                    <span class='ico-_loading'></span>
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
        {/* Like announcement */}
        <button className='info_post_btn' id='like'>
          <FaHandHoldingHeart />
        </button>

        {/* Comment announcement */}
        <button className='info_post_btn' id='comment'>
          <GoComment />
        </button>

        {/* Importent announcement */}
        <button className='info_post_btn' id='importent'>
          <AiOutlineDislike />
        </button>

        {/* Fake announcement */}
        <button className='info_post_btn' id='scam'>
          <AiOutlineDislike />
          <span className='helpfull_count'></span>
        </button>
      </div>

      <div
        className='social_post_footer_one'
        onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
        {/* Like announcement button */}
        <button className='info_post_text_btn' id='like'>
          {t("Like")}
          <span className='helpfull_count'>
            {postData.like_c ? postData.like_c : "0"}
          </span>
        </button>

        {/* Comment announcement button */}
        <button className='info_post_text_btn' id='like'>
          {t("Comment")}
          <span className='helpfull_count'>
            {postData.like_c ? postData.like_c : "0"}
          </span>
        </button>

        {/* Importent announcement button */}
        <button className='info_post_text_btn' id='like'>
          {t("Importent")}
          <span className='helpfull_count'>
            {postData.imp_c ? postData.imp_c : "0"}
          </span>
        </button>

        {/* Fake announcement button */}
        <button className='info_post_text_btn' id='like'>
          {t("Fake")}
          <span className='helpfull_count'>
            {/* {
            postData.postData.scam_c ?
            <>
            {
            postData.postData.scam_c > 0 ?
            <>{calculatePercentage(postData.imp_c, postData.scam_c)}%</> : '0'
          }
            </> : '0'
          } */}
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
  spamList: state.user.spam,

  emoji_likes: state.user.emoji_likes,
  emoji_heart: state.user.emoji_heart,
  emoji_haha: state.user.emoji_haha,
  emoji_party: state.user.emoji_party,
  emoji_dislikes: state.user.emoji_dislikes,
  selectComment: state.post.selectComment,
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
)(AnnouncementPostCardFooter);
