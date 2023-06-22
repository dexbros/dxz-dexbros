/** @format */
/** @format */

import React from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import UserAvatar from "../../Assets/userAvatar.webp";
import { Link, useParams } from "react-router-dom";
// import timeDifference from "../../utils/getCreateTime";
import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import CustomModal from "../modal/CustomModal";
import { BiArrowBack } from "react-icons/bi";
import {
  setNewPinnedPost,
  updatePost,
  newPosts,
  selectPost,
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
  addToLike,
  addEmojAngry,
  removeEmojiAngry,
} from "../../redux/user/user.actions";
import EmojiLike from "../EmojiLike/EmojiLike";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AllIcon } from "../../Assets/Icons/all.svg";
import CustomPostFormModal from "../modal/CustomPostForm";
import {
  setComments,
  removeAllComments,
  putCommentLast,
} from "../../redux/comment/comment.actions";
import PostCommentCard from "../PostCommentCard/PostCommentCard";
import { removeAllReply, addNewReply } from "../../redux/reply/reply.actions";
import { AiOutlineStar } from "react-icons/ai";
// Emoji icons
import Like from "../../Assets/emojiIcon/like.png";
import Heart from "../../Assets/emojiIcon/love.png";
import Haha from "../../Assets/emojiIcon/haha.png";
import Party from "../../Assets/emojiIcon/party.png";
import Dislike from "../../Assets/emojiIcon/angry.png";
import calculatePercentage from "../../utils/getSpamPercentage";
import { BsGraphDown } from "react-icons/bs";

import { AiFillHeart, AiFillDislike } from "react-icons/ai";
import { BsEmojiLaughingFill, BsEmojiAngryFill } from "react-icons/bs";

const NormalPostCardFooter = ({
  postData,
  myComments,
  user,
  token,
  setPinnedPost,
  addEmojiLike,
  addEmojiHeart,
  addEmojHaha,
  addEmojParty,
  addEmojiDislike,
  removeEmojiLike,
  removeEmojiHeart,
  removeEmojiHaha,
  removeEmojiDislike,
  removeEmojiParty,
  setComments,
  removeAllComments,
  comments,
  putCommentLast,
  selectPost,
  updatedComment,
  removeAllReply,
  addToSpam,
  removeToSpam,
  spam,
  like,
  haha,
  party,
  heart,
  dislike,
  setIsToxic,
  addEmojAngry,
  removeEmojiAngry,
  angry,
  setPage,
  setCmntPage,
  cmntPage,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation(["common"]);
  const [postId, setPostId] = React.useState("");
  const [post, setPost] = React.useState("");
  const [openEmojiIcons, setOpenEmojiIcons] = React.useState(false);
  const [commentCount, setCommentCount] = React.useState(postData.c_c);
  const [openCommentModal, setOpenCommentModal] = React.useState(false);
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isFocus, setIsFocus] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [lastResponseData, setLastResponseData] = React.useState(1);
  const [sortedBy, setSortedBy] = React.useState("new");
  const [prevSortedBy, setprevSortedBy] = React.useState("popular");
  const [query, setQuery] = React.useState("");
  const [isBtnDisable, setIsBtnDisable] = React.useState(true);
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const [isVisble, setIsVisble] = React.useState(false);
  const [text, setText] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [limit, setLimit] = React.useState(5);
  const [spanCount, setSpamCount] = React.useState(postData.sp_c || 0);
  const [likeCount, setLikeCount] = React.useState(postData.l_c);
  const [openDonatModal, setOpenDonatModal] = React.useState(false);
  const [donateValue, setDonateValue] = React.useState(0);
  const [donateBtnVisible, setDonateBtnVisible] = React.useState(false);
  const [openSpamModal, setOpenSpamModal] = React.useState(false);
  const [postUserId, setPostUserId] = React.useState("");
  const [custommessage, setCustomMessage] = React.useState("");
  const [openLikeModal, setOpneLikeModal] = React.useState(false);
  const [likeType, setLikeType] = React.useState("all");
  const [likePage, setLikePage] = React.useState(1);
  const [usersList, setUsersList] = React.useState([]);
  const [isCmntBtnDisable, setIsCmntBtnDisable] = React.useState(true);
  const [commentPrivacy, setCommentPrivacy] = React.useState(
    postData.cmnt_prv || "all"
  );

  React.useEffect(() => {
    if (donateValue > 0) {
      setDonateBtnVisible(true);
    } else {
      setDonateBtnVisible(false);
    }
  }, [donateValue]);

  React.useEffect(() => {
    if (!text.trim()) {
      setIsBtnDisable(true);
    } else {
      setIsBtnDisable(false);
    }
  }, [text]);

  const handleChange = (e) => {
    setContent(e.target.value.slice(0, 100));
  };

  const handleClick = (value, id, data) => {
    if (value === "pin") {
      setPostId(id);
      setOpenPinnedModal(true);
    } else if (value === "book") {
      setPostId(id);
      setOpenBookModal(true);
    } else if (value === "hide") {
      setPostId(id);
    } else if (value === "unhide") {
      setPostId(id);
    } else if (value === "spam") {
      // handlePostSpamHandler(id)
    } else if (value === "share") {
      if (postData.id === id) {
        setPost(postData);
      }
      setOpenShareModal(true);
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
      navigate(`/post/analytics/${id}`);
    } else if (value === "edit") {
      setPost(data);
      setOpenEditModal(true);
      setPostId(id);
    } else if (value === "likeList") {
      setOpenLikeList(true);
      setPostId(data.id);
      fetchUserLike();
    } else if (value === "visit") {
      navigate(`/user/profile/${data.u_dun}`);
    } else if (value === "post_body") {
      // alert(id)
      navigate(`/full/post/${id}`);
    } else if (value === "like") {
      setOpenEmojiIcons(true);
      setPostId(id);
    } else if (value === "donate") {
      handleDonateModal();
      setPostId(id);
      setPostUserId(data.u_dun);
    } else if (value === "like_user") {
      setOpneLikeModal(true);
      setPostId(id);
      console.log(id);
      // fetchPostLikeUsers();
    }
  };

  const handleOpenEmojis = (id) => {
    setOpenEmojiIcons(true);
    setPostId(id);
  };

  function useOutsideAlerter(ref) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenEmojiIcons(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  const handleMessageChange = (e) => {
    setMessage(e.target.value.slice(0, 100));
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

  const closeCmntImage = () => {
    setPrevImage("");
    setImage("");
  };

  const handleImageChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  // *** Post spam handler
  const handlePostSpamHandler = () => {
    console.log("call");
    if (spam.includes(postId)) {
      removeToSpam(postId);
      setSpamCount((prev) => prev - 1);
    } else {
      addToSpam(postId);
      setSpamCount((prev) => prev + 1);
    }

    // if (setSpamCount >= process.env.REACT_APP_MINIMUM_SPAM_COUNT) {
    //   setIsToxic(true);
    // } else {
    //   setIsToxic(false);
    // }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/spam/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // setPinnedPost(result)
      })
      .catch((error) => console.log("error", error));
  };

  // *** Post share handler
  const handleRepostWithQuoteHandler = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      content: content,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/repost/status/${postId}`,
      headers: {
        Authorization: "Berar " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setPinnedPost(response);
        setOpenShareModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onClose = () => {
    setOpenShareModal(false);
    setOpenDonatModal(false);
    setOpenSpamModal(false);
    setOpneLikeModal(false);
  };

  const closeCommentModal = () => {
    setOpenCommentModal(false);
    // removeAllComments([]);
    // removeAllReply([]);
    // setPage(1)
    setOpneLikeModal(false);
  };

  // *** Handle like post
  const likePost = (value, id) => {
    if (value === "like") {
      if (likeCount === 0) {
        addEmojiLike(id);
        setLikeCount((prev) => prev + 1);
      } else {
        if (!like.includes(id)) {
          if (dislike.includes(id) || haha.includes(id) || angry.includes(id)) {
            addEmojiLike(id);
            removeEmojiAngry(id);
            removeEmojiHaha(id);
            removeEmojiDislike(id);
          } else {
            setLikeCount((prev) => prev + 1);
            addEmojiLike(id);
          }
        } else {
          removeEmojiLike(id);
          setLikeCount((prev) => prev - 1);
        }
      }
    } else if (value === "angry") {
      if (likeCount === 0) {
        addEmojAngry(id);
        setLikeCount((prev) => prev + 1);
      } else {
        if (!angry.includes(id)) {
          if (dislike.includes(id) || haha.includes(id) || like.includes(id)) {
            addEmojAngry(id);
            removeEmojiLike(id);
            removeEmojiHaha(id);
            removeEmojiDislike(id);
          } else {
            addEmojAngry(id);
            setLikeCount((prev) => prev + 1);
          }
        } else {
          removeEmojiAngry(id);
          setLikeCount((prev) => prev - 1);
        }
      }
    } else if (value === "haha") {
      if (likeCount === 0) {
        addEmojHaha(id);
        setLikeCount((prev) => prev + 1);
      } else {
        if (!haha.includes(id)) {
          if (dislike.includes(id) || like.includes(id) || angry.includes(id)) {
            removeEmojiLike(id);
            removeEmojiAngry(id);
            addEmojHaha(id);
            removeEmojiDislike(id);
          } else {
            setLikeCount((prev) => prev + 1);
            addEmojHaha(id);
          }
        } else {
          removeEmojiHaha(id);
          setLikeCount((prev) => prev - 1);
        }
      }
    } else if (value === "dislike") {
      if (likeCount === 0) {
        addEmojiDislike(id);
        setLikeCount((prev) => prev + 1);
      } else {
        if (!dislike.includes(id)) {
          if (haha.includes(id) || like.includes(id) || angry.includes(id)) {
            removeEmojiLike(id);
            removeEmojiAngry(id);
            removeEmojiHaha(id);
            addEmojiDislike(id);
          } else {
            setLikeCount((prev) => prev + 1);
            addEmojiDislike(id);
          }
        } else {
          removeEmojiDislike(id);
          setLikeCount((prev) => prev - 1);
        }
      }
    }
    var axios = require("axios");
    const url =
      value === "like"
        ? `${process.env.REACT_APP_URL_LINK}api/posts/emoji/like/${id}`
        : value === "angry"
        ? `${process.env.REACT_APP_URL_LINK}api/posts/emoji/angry/${id}`
        : value === "haha"
        ? `${process.env.REACT_APP_URL_LINK}api/posts/emoji/haha/${id}`
        : value === "dislike"
        ? `${process.env.REACT_APP_URL_LINK}api/posts/emoji/dislike/${id}`
        : null;

    console.log(url);
    var config = {
      method: "put",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data);
        setOpenEmojiIcons(false);
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

  const handleDonateModal = () => {
    setOpenDonatModal(true);
  };

  const handleDonateChange = (value) => {
    setDonateValue(value);
  };

  const handleSpamButton = (id) => {
    setPostId(id);
    setOpenSpamModal(true);
  };

  const handleDonatPost = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/donate/${postId}?amount=${donateValue}&handleUn=${postUserId}&message=${custommessage}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setDonateBtnVisible(false);
        setDonateValue(0);
        setOpenDonatModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Fetch post like user
  const fetchPostLikeUsers = () => {
    console.log("Call ", postId);
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/posts/like/users/${postId}?type=${likeType}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setUsersList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (text.trim()) {
      setIsCmntBtnDisable(false);
    } else {
      if (image) {
        setIsCmntBtnDisable(false);
      } else {
        setIsCmntBtnDisable(true);
      }
    }
  }, [text, image]);

  React.useEffect(() => {
    if (openLikeModal) {
      fetchPostLikeUsers();
    }
  }, [openLikeModal, likeType]);

  const redirectToProfile = (id) => {
    navigate(`/user/profile/${id}`);
  };

  return (
    <React.Fragment>
      {/* Spam modal */}
      {openSpamModal && (
        <CustomModal
          title='Spam'
          onClose={onClose}
          body={<>{t("You want to add this post as toxic post " + postId)}</>}
          footer={
            <div className='modal_footer'>
              <button
                className='update_btn'
                onClick={() => handlePostSpamHandler()}>
                {t("Spam")}
              </button>
            </div>
          }
        />
      )}
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
                    <div className='comment_card_section'>
                      {comments.map((data) => (
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
      {/* Share modal */}
      {openShareModal && (
        <CustomModal
          title='Repost'
          onClose={onClose}
          body={
            <div className='modal_body_section'>
              <textarea
                type='text'
                placeholder={t("share_placeholder")}
                className='modal_textarea'
                value={content}
                onChange={(e) => handleChange(e)}></textarea>
              <div className='social_media_post_card'>
                <div className='social_media_post_card_header'>
                  <img
                    src={post.u_img ? post.u_img : UserAvatar}
                    className='posted_user_avatar'
                    id='profile'
                  />
                  {/* Post creator personal info */}
                  <div className='post_creator_info'>
                    <>
                      {/* creator name */}
                      <span className='creator_name' id='profile'>
                        {postData.u_fn} {post.u_ln}
                      </span>
                      {/* creator username */}
                      <span className='creator_username'>@{post.u_dun}</span>
                    </>
                    <div className='post_basic_info'>
                      {/* post privacy section */}
                      <span className='post_privacy'>
                        {postData.privacy === "Public" ? (
                          <AllIcon className='post_icon' />
                        ) : (
                          <>
                            {postData.privacy === "follower" ? (
                              <FollowersIcon className='post_icon' />
                            ) : (
                              <OnlyMeIcon className='post_icon' />
                            )}
                          </>
                        )}
                      </span>

                      {/* post paid promotion */}
                      <span className='post_paid_section'>
                        {postData.isPaid === "true" && (
                          <span className='paid_promotion'>
                            Paid promotion with
                            <Link
                              to={`/group/${postData.blockId}`}
                              className='cmpny_name'>
                              {postData.cName}
                            </Link>
                          </span>
                        )}
                      </span>
                    </div>
                    {/* post feelings */}
                    <div className='post_feelings'>
                      {postData.feelingIcon}
                      <span className='post_feelings_text'>
                        {postData.feeling}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='post_card_body' id='post_body'>
                  <span className='main_body_text' id='post_body'>
                    {post.content.split(" ").map((val, index) => (
                      <span
                        id='post_body'
                        key={index}
                        className={val.includes("#") ? "trend_tag" : ""}>
                        {val}{" "}
                      </span>
                    ))}
                  </span>
                  <br />
                  {post.image && (
                    <img
                      src={post.image}
                      className='post_card__body_image'
                      id='post_body'
                    />
                  )}
                  {post.gif && (
                    <img
                      src={post.gif}
                      className='post_card__body_image'
                      id='post_body'
                    />
                  )}
                </div>
              </div>
            </div>
          }
          footer={
            <div className='modal_footer'>
              <button
                className='update_btn'
                onClick={handleRepostWithQuoteHandler}>
                Share
              </button>
            </div>
          }
        />
      )}
      {/* Donate crypto */}
      {openDonatModal && (
        <CustomModal
          title='Repost'
          onClose={onClose}
          body={
            <div className='modal_body'>
              <div className='option_box'>
                <input
                  type='radio'
                  name='donateValue'
                  value='50'
                  checked={donateValue === "50"}
                  onChange={(e) => handleDonateChange(e.target.value)}
                />
                <div
                  className='options_text_scection'
                  id='Public'
                  onClick={(e) => handleDonateChange(e.target.id)}>
                  <span
                    className='options_text_scection_header'
                    id='50'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    50
                  </span>
                  <br />
                  <span
                    className='options_text_scection_text'
                    id='50'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    Donate $50 to your favourite creator
                  </span>
                </div>
              </div>

              <div className='option_box'>
                <input
                  type='radio'
                  name='donateValue'
                  value='100'
                  checked={donateValue === "100"}
                  onChange={(e) => handleDonateChange(e.target.value)}
                />
                <div
                  className='options_text_scection'
                  id='Public'
                  onClick={(e) => handleDonateChange(e.target.id)}>
                  <span
                    className='options_text_scection_header'
                    id='100'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    100
                  </span>
                  <br />
                  <span
                    className='options_text_scection_text'
                    id='100'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    Donate $100 to your favourite creator
                  </span>
                </div>
              </div>

              <div className='option_box'>
                <input
                  type='radio'
                  name='donateValue'
                  value='200'
                  checked={donateValue === "200"}
                  onChange={(e) => handleDonateChange(e.target.value)}
                />
                <div
                  className='options_text_scection'
                  id='200'
                  onClick={(e) => handleDonateChange(e.target.id)}>
                  <span
                    className='options_text_scection_header'
                    id='200'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    200
                  </span>
                  <br />
                  <span
                    className='options_text_scection_text'
                    id='200'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    Donate $200 to your favourite creator
                  </span>
                </div>
              </div>

              <div className='option_box'>
                <input
                  type='radio'
                  name='donateValue'
                  value='500'
                  checked={donateValue === "500"}
                  onChange={(e) => handleDonateChange(e.target.value)}
                />
                <div
                  className='options_text_scection'
                  id='500'
                  onClick={(e) => handleDonateChange(e.target.id)}>
                  <span
                    className='options_text_scection_header'
                    id='500'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    500
                  </span>
                  <br />
                  <span
                    className='options_text_scection_text'
                    id='500'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    Donate $500 to your favourite creator
                  </span>
                </div>
              </div>

              <div className='option_box'>
                <input
                  type='radio'
                  name='donateValue'
                  value='1000'
                  checked={donateValue === "1000"}
                  onChange={(e) => handleDonateChange(e.target.value)}
                />
                <div
                  className='options_text_scection'
                  id='1000'
                  onClick={(e) => handleDonateChange(e.target.id)}>
                  <span
                    className='options_text_scection_header'
                    id='1000'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    1000
                  </span>
                  <br />
                  <span
                    className='options_text_scection_text'
                    id='1000'
                    onClick={(e) => handleDonateChange(e.target.id)}>
                    Donate $1000 to your favourite creator
                  </span>
                </div>
              </div>
            </div>
          }
          footer={
            donateBtnVisible && (
              <>
                <textarea
                  type='text'
                  placeholder='Send message'
                  value={custommessage}
                  className='edit_form_section_textarea'
                  onChange={(e) =>
                    setCustomMessage(e.target.value.slice(0, 50))
                  }></textarea>
                <button className='donate_btn' onClick={handleDonatPost}>
                  Donate ${donateValue}{" "}
                </button>
              </>
            )
          }
        />
      )}
      {/* Post like modal */}
      {openLikeModal && (
        <CustomPostFormModal
          title={
            <div className='comment_modal_title_section'>
              <div className='modal_comment_box'>
                <button
                  className='modal_header_btn'
                  onClick={closeCommentModal}>
                  <BiArrowBack />
                </button>
                <span className='modal_header_title'>Post reactions</span>
              </div>
            </div>
          }
          onClose={onClose}
          body={
            <div className='user_list_container_section'>
              {/* Tab */}
              <div className='modal_tab'>
                <li
                  className={
                    likeType === "all"
                      ? "modal_list modal_list_active"
                      : "modal_list"
                  }
                  value='all'
                  onClick={(e) => setLikeType("all")}>
                  All {postData.l_c}
                </li>

                <li
                  className={
                    likeType === "likes"
                      ? "modal_list modal_list_active"
                      : "modal_list"
                  }
                  value='like'
                  onClick={(e) => setLikeType("likes")}>
                  Like
                </li>

                <li
                  className={
                    likeType === "haha"
                      ? "modal_list modal_list_active"
                      : "modal_list"
                  }
                  value='haha'
                  onClick={(e) => setLikeType("haha")}>
                  Haha
                </li>

                <li
                  className={
                    likeType === "angry"
                      ? "modal_list modal_list_active"
                      : "modal_list"
                  }
                  value='angry'
                  onClick={(e) => setLikeType("angry")}>
                  Angry
                </li>

                <li
                  className={
                    likeType === "dislikes"
                      ? "modal_list modal_list_active"
                      : "modal_list"
                  }
                  value='dislikes'
                  onClick={(e) => setLikeType("dislikes")}>
                  Dislikes
                </li>
              </div>
              <div className='user_modal_section'>
                {(usersList || []).length > 0 ? (
                  <div className='__modal_user_list_container'>
                    {usersList.map((data) => (
                      <div
                        className='__user_modal_card'
                        onClick={() =>
                          redirectToProfile(data.record.bins.handleUn)
                        }>
                        <img
                          src={data.record.bins.p_i || UserAvatar}
                          alt=''
                          srcset=''
                          className='modal_profile_avatar'
                        />
                        <span className='modal_user_name'>
                          {data.record.bins.fn} {data.record.bins.ln}
                        </span>
                        <span className='modal_user_username'>
                          @{data.record.bins.handleUn}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='empty_user_modal_list'>No user found</div>
                )}
              </div>
            </div>
          }
        />
      )}
      <div className='full_posts_footer_section'>
        <div
          className='post_footer_count_section'
          onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
          <button id='like_user' className='like_post_count'>
            {postData.like > 0 && (
              <AiFillHeart
                id='like_user'
                className='small_icon heart_small_icon'
              />
            )}
            {postData.angry > 0 && (
              <BsEmojiAngryFill
                id='like_user'
                className='small_icon angry_small_icon'
              />
            )}
            {postData.haha > 0 && (
              <BsEmojiLaughingFill
                id='like_user'
                className='small_icon haha_small_icon'
              />
            )}
            {postData.dislike > 0 && (
              <AiFillDislike
                id='like_user'
                className='small_icon dislike_small_icon'
              />
            )}{" "}
            {likeCount}
          </button>

          <div className='user_like_avatar'>
            {(postData.pop || []).length > 0 && (
              <>
                {postData.pop.slice(0, 3).map((data) => (
                  <div>
                    <img
                      src={data.pic || UserAvatar}
                      className='small_user_avatar'
                      onClick={() => navigate(`/user/profile/${data.handleUn}`)}
                    />
                  </div>
                ))}
              </>
            )}
            {(postData.ran || []).length > 0 && (
              <>
                {postData.ran.slice(0, 3).map((data) => (
                  <div>
                    <img
                      src={data.pic || UserAvatar}
                      className='small_user_avatar'
                      onClick={() => navigate(`/user/profile/${data.handleUn}`)}
                    />
                  </div>
                ))}
              </>
            )}{" "}
            {postData.l_c > postData.pop.length + postData.ran.length && (
              <span id='like_user'>
                +{postData.l_c - (postData.pop.length + postData.ran.length)}{" "}
                others
              </span>
            )}
          </div>
        </div>
        <div
          className='post_card_footer_section'
          onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
          {openEmojiIcons && (
            <div className='card_emoji_container' ref={wrapperRef}>
              <EmojiLike
                id={postId}
                setQuery={setQuery}
                clickHandler={likePost}
              />
            </div>
          )}
          {/* Like button */}
          {/* Like button */}
          <button id='like' className='post_footer_btn post_like'>
            {like.includes(postData.id) ? (
              <AiFillHeart id='like' className='post_like_active like_icon' />
            ) : (
              <>
                {dislike.includes(postData.id) ? (
                  <AiFillDislike
                    id='like'
                    className='post_like_active dislike_icon'
                  />
                ) : (
                  <>
                    {haha.includes(postData.id) ? (
                      <BsEmojiLaughingFill
                        id='like'
                        className='post_like_active funny_icon'
                      />
                    ) : (
                      <>
                        {angry.includes(postData.id) ? (
                          <BsEmojiAngryFill
                            id='like'
                            className='post_like_active angry_icon'
                          />
                        ) : (
                          <AiOutlineHeart id='like' />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}{" "}
            <br />
            {like.includes(postData.id) ? (
              <span className='like_count_text' id='like'>
                You react on this post
              </span>
            ) : (
              <>
                {dislike.includes(postData.id) ? (
                  <span className='like_count_text' id='like'>
                    You react on this post
                  </span>
                ) : (
                  <>
                    {haha.includes(postData.id) ? (
                      <span className='like_count_text' id='like'>
                        You react on this post
                      </span>
                    ) : (
                      <>
                        {angry.includes(postData.id) ? (
                          <span className='like_count_text' id='like'>
                            You react on this post
                          </span>
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </button>

          {/* Post comment icons */}
          <button className='post_footer_btn post_comment_btn'>
            {/* <BiCommentDetail id="comment" /> */}
            <span class='ico-_comment_one' id='comment'></span> {postData.c_c}
          </button>

          {/* Spam button */}
          {postData.u_dun !== user.handleUn && (
            <button
              className='post_footer_btn post_spam_btn'
              onClick={() => handleSpamButton(postData.id)}>
              {spam.includes(postData.id) ? (
                <RiSpam2Fill id='spam' />
              ) : (
                <RiSpam2Line id='spam' />
              )}{" "}
              {postData.sp_c}
            </button>
          )}

          {/* Share button */}
          {postData.u_dun !== user.handleUn && (
            <button id='donate' className='post_footer_btn post_share_btn'>
              {/* <AiOutlineShareAlt id="share" /> */}
              <AiOutlineStar className='post_card_footer_icon' id='donate' />
            </button>
          )}

          {/* Analytics button */}
          {postData.u_dun === user.handleUn && (
            <button id='analytics' className='post_footer_btn post_share_btn'>
              {/* <AiOutlineShareAlt id="share" /> */}
              <BsGraphDown className='post_card_footer_icon' id='analytics' />
            </button>
          )}
        </div>

        {/* Render comment form */}
        {commentPrivacy === "all" ? (
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

            <div className='cmnt_form_btns'>
              <div className='post_comnt_other_btn'>
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
              </div>
              {!isCmntBtnDisable && (
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

            {/* Rendering all the comments */}
            <div className='full_post_comment_section'>
              {(myComments || []).length > 0 && (
                <>
                  {myComments.map((data) => (
                    <PostCommentCard key={data.id} commentData={data} />
                  ))}
                </>
              )}
              {(comments || []).length > 0 && (
                <div className='full_post_comment_card_section'>
                  {comments.map((data) => (
                    <PostCommentCard key={data.id} commentData={data} />
                  ))}

                  {comments.length < postData.c_c && (
                    <button
                      className='load_more_btn'
                      onClick={() => setCmntPage((prev) => prev + 1)}>
                      Load more
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  spam: state.user.spam,

  like: state.user.emoji_likes,
  angry: state.user.emoji_angry,
  heart: state.user.emoji_heart,
  haha: state.user.emoji_haha,
  party: state.user.emoji_party,
  dislike: state.user.emoji_dislikes,
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
  addToSpam: (data) => dispatch(addToSpam(data)),
  removeToSpam: (data) => dispatch(removeToSpam(data)),
  addEmojAngry: (data) => dispatch(addEmojAngry(data)),
  removeEmojiAngry: (data) => dispatch(removeEmojiAngry(data)),

  setComments: (data) => dispatch(setComments(data)),
  removeAllComments: (data) => dispatch(removeAllComments(data)),
  removeAllReply: (data) => dispatch(removeAllReply(data)),
  putCommentLast: (data) => dispatch(putCommentLast(data)),
  selectPost: (data) => dispatch(selectPost(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NormalPostCardFooter);
