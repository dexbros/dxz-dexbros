/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../Assets/userAvatar.webp";
import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineHeart, AiOutlineSend } from "react-icons/ai";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import CustomModal from "../modal/CustomModal";
import { BiArrowBack } from "react-icons/bi";
import EmojiLike from "../EmojiLike/EmojiLike";
import { useNavigate } from "react-router-dom";
import CustomPostFormModal from "../modal/CustomPostForm";
import PostCommentCard from "../PostCommentCard/PostCommentCard";
import { AiOutlineStar } from "react-icons/ai";
import { BsGraphDown } from "react-icons/bs";
import { AiFillHeart, AiFillDislike } from "react-icons/ai";
import { BsEmojiLaughingFill, BsEmojiAngryFill } from "react-icons/bs";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import {
  BiFilterAlt,
  BiCommentDetail,
  BiLoaderAlt,
  BiRadioCircleMarked,
  BiRadioCircle,
} from "react-icons/bi";
import axios from "axios";
import { socket, useSocket, isSocketConnected } from "../../socket/socket";

import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectToken,
  selectFollowing,
  selectLike,
  selectAngry,
  selectHaha,
  selectDislikes,
} from "../../redux/_user/userSelectors";
import { selectSpam } from "../../redux/_user/userSelectors";
import { FaDatabase } from "react-icons/fa";
import {
  updateSpamPost,
  updateDonatePost,
  updateLikePost,
  updateAngryPost,
  updateHahaPost,
  updateDislikePost,
  postComment,
  fetchPostComment,
  removeComments,
  fetchLikedUser,
} from "../../redux/_post/postSlice";
import {
  setAddSpam,
  setRemoveSpam,
  addLike,
  removeLike,
  addAngry,
  removeAngry,
  addHAHA,
  removeHaha,
  addDislikes,
  removeDislikes,
} from "../../redux/_user/userSlice";
import {
  selectComments,
  selectCurrentCommentCount,
  selectCommentUpdate,
} from "../../redux/_post/postSelectors";
const NormalPostCardFooter = ({ postData }) => {
  useSocket();
  const dispatch = useDispatch();
  const commentUpdatedData = useSelector(selectCommentUpdate);
  const comments = useSelector(selectComments);
  const currentCommentCount = useSelector(selectCurrentCommentCount);
  const like = useSelector(selectLike);
  const haha = useSelector(selectHaha);
  const dislike = useSelector(selectDislikes);
  const angry = useSelector(selectAngry);
  // const isPost = useSelector(selectPosts);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const following = useSelector(selectFollowing);
  const spam = useSelector(selectSpam);
  const navigate = useNavigate();
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
  const [page, setPage] = React.useState(1);
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
  const [sortType, setSortType] = React.useState("new");
  const [fetchPostCount, setFetchPostCount] = React.useState(0);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);
  const [commentPrivacy, setCommentPrivacy] = React.useState(
    postData.cmnt_prv || "all"
  );
  const [sharePrivacy, setSharePrivacy] = React.useState(
    postData.shr_prv || "all"
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
      // fetchComments();
      // selectPost(data);
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
  const handlePostSpamHandler = async () => {
    const data = { token, postId };
    if (spam.includes(postId)) {
      dispatch(setRemoveSpam(postId));
      setSpamCount((prev) => prev - 1);
      dispatch(updateSpamPost(data));
    } else {
      dispatch(setAddSpam(postId));
      setSpamCount((prev) => prev + 1);
      dispatch(updateSpamPost(data));
    }
    setOpenSpamModal(false);
  };

  const onClose = () => {
    setOpenShareModal(false);
    setOpenDonatModal(false);
    setOpenSpamModal(false);
    setOpneLikeModal(false);
  };

  const closeCommentModal = () => {
    setOpenCommentModal(false);
    dispatch(removeComments());
    setPage(1);
    setOpneLikeModal(false);
    setPostId("");
  };

  // *** Handle like post
  const likePost = (value, id) => {
    const data = { token, id };
    if (value === "like") {
      if (likeCount === 0) {
        dispatch(addLike(id));
        setLikeCount((prev) => prev + 1);
      } else {
        if (!like.includes(id)) {
          if (dislike.includes(id) || haha.includes(id) || angry.includes(id)) {
            dispatch(addLike(id));
            dispatch(removeAngry(id));
            dispatch(removeHaha(id));
            dispatch(removeDislikes(id));
          } else {
            setLikeCount((prev) => prev + 1);
            dispatch(addLike(id));
          }
        } else {
          dispatch(removeLike(id));
          setLikeCount((prev) => prev - 1);
        }
      }
      dispatch(updateLikePost(data));
    } else if (value === "angry") {
      if (likeCount === 0) {
        dispatch(addAngry(id));
        setLikeCount((prev) => prev + 1);
      } else {
        if (!angry.includes(id)) {
          if (dislike.includes(id) || haha.includes(id) || like.includes(id)) {
            dispatch(addAngry(id));
            dispatch(removeLike(id));
            dispatch(removeHaha(id));
            dispatch(removeDislikes(id));
          } else {
            dispatch(addAngry(id));
            setLikeCount((prev) => prev + 1);
          }
        } else {
          dispatch(removeAngry(id));
          setLikeCount((prev) => prev - 1);
        }
      }
      dispatch(updateAngryPost(data));
    } else if (value === "haha") {
      if (likeCount === 0) {
        dispatch(addHAHA(id));
        setLikeCount((prev) => prev + 1);
      } else {
        if (!haha.includes(id)) {
          if (dislike.includes(id) || like.includes(id) || angry.includes(id)) {
            dispatch(removeLike(id));
            dispatch(removeAngry(id));
            dispatch(addHAHA(id));
            dispatch(removeDislikes(id));
          } else {
            setLikeCount((prev) => prev + 1);
            dispatch(addHAHA(id));
          }
        } else {
          dispatch(removeHaha(id));
          setLikeCount((prev) => prev - 1);
        }
      }
      dispatch(updateHahaPost(data));
    } else if (value === "dislike") {
      if (likeCount === 0) {
        dispatch(addDislikes(id));
        setLikeCount((prev) => prev + 1);
      } else {
        if (!dislike.includes(id)) {
          if (haha.includes(id) || like.includes(id) || angry.includes(id)) {
            dispatch(removeLike(id));
            dispatch(removeAngry(id));
            dispatch(removeHaha(id));
            dispatch(addDislikes(id));
          } else {
            setLikeCount((prev) => prev + 1);
            dispatch(addDislikes(id));
          }
        } else {
          dispatch(removeDislikes(id));
          setLikeCount((prev) => prev - 1);
        }
      }
      dispatch(updateDislikePost(data));
    }
  };

  // *** Handle post comment
  const handlePostComment = async (id) => {
    setIsBtnDisable(true);
    const data = {
      token,
      post: { comment: text, c_img: image, gif: gif, postId: id },
    };
    await dispatch(postComment(data));
    setText("");
  };

  // *** Fetch comments
  const fetchComments = async () => {
    const data = { postId, token, sortedBy, page, limit };
    dispatch(fetchPostComment(data));
  };

  React.useEffect(() => {
    if (openCommentModal) {
      fetchComments();
    } else {
      // removeAllComments([]);
    }
  }, [postId, page, sortedBy, commentUpdatedData]);

  const scrollHandler = (e) => {
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    if (cl + sy + 1 >= sh) {
      // setPage((page) => page + 1);
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

  const handleDonatPost = async () => {
    const data = { postId, donateValue, postUserId, custommessage };
    await updateDonatePost(FaDatabase);
    setDonateBtnVisible(false);
    setDonateValue(0);
    setOpenDonatModal(false);
  };

  // *** Fetch post like user
  const fetchPostLikeUsers = async () => {
    const data = { token, postId, likeType };
    const result = await dispatch(fetchLikedUser(data));
    setUsersList(result);
  };

  React.useEffect(() => {
    if (openLikeModal) {
      fetchPostLikeUsers();
    }
  }, [openLikeModal, likeType]);

  const redirectToProfile = (id) => {
    navigate(`/user/profile/${id}`);
  };

  // *** Handle sorting comment
  const handleSortComment = (value) => {
    setSortedBy(value);
    // set page to 1
    setPage(1);
    // remove all  comments
    removeAllComments([]);
    // remove all reply
    removeAllReply([]);
    // call fetchComment fn.
  };

  // *** Handle increment page count
  const incrementPage = () => {
    setIsLoadingBtn(true);
    setTimeout(() => {
      setIsLoadingBtn(false);
    }, 1000);
    setPage((prev) => prev + 1);
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

      {/* Post Comment modal */}
      {openCommentModal && (
        <CustomPostFormModal
          title={
            <div className='comment_modal_title_section'>
              <div className='cmnt_header_box'>
                <button
                  className='cmnt_modal_back_btn'
                  onClick={closeCommentModal}>
                  <BiArrowBack />
                </button>
                <button id='like_user' className='cmnt_like_post_count'>
                  {postData.like > 0 && (
                    <AiFillHeart
                      id='like_user'
                      className='cmnt_small_icon heart_small_icon'
                    />
                  )}
                  {postData.angry > 0 && (
                    <BsEmojiAngryFill
                      id='like_user'
                      className='cmnt_small_icon angry_small_icon'
                    />
                  )}
                  {postData.haha > 0 && (
                    <BsEmojiLaughingFill
                      id='like_user'
                      className='cmnt_small_icon haha_small_icon'
                    />
                  )}
                  {postData.dislike > 0 && (
                    <AiFillDislike
                      id='like_user'
                      className='cmnt_small_icon dislike_small_icon'
                    />
                  )}{" "}
                  {likeCount}
                </button>
              </div>

              <div className='cmnt_modal_title'>
                {sortedBy === "pop" ? (
                  <>Popular comments</>
                ) : (
                  <>
                    {sortedBy === "old" ? <>Oldest comments</> : <>Comments</>}
                  </>
                )}
              </div>

              <Menu
                menuButton={
                  <MenuButton className={"cmnt_modal_filter_btn"}>
                    <BiFilterAlt className='cmnt_modal_filter_icons' />{" "}
                    {/* {sortedBy === "new" ? (
                        <>Newest comment</>
                      ) : (
                        <>
                          {sortedBy === "pop" ? (
                            <>Most Popular </>
                          ) : (
                            <>Oldest Comment</>
                          )}
                        </>
                      )} */}
                  </MenuButton>
                }>
                <MenuItem
                  className='cmnt_sort_menu_item'
                  onClick={() => handleSortComment("new")}>
                  {sortedBy === "new" ? (
                    <BiRadioCircleMarked className='dropdown_radio_icon' />
                  ) : (
                    <BiRadioCircle className='dropdown_radio_icon' />
                  )}
                  <span className='menu_text'>Newest comment</span>
                </MenuItem>
                <MenuItem
                  className='cmnt_sort_menu_item'
                  onClick={() => handleSortComment("pop")}>
                  {sortedBy === "pop" ? (
                    <BiRadioCircleMarked className='dropdown_radio_icon' />
                  ) : (
                    <BiRadioCircle className='dropdown_radio_icon' />
                  )}
                  <span className='menu_text'>Most Popular</span>
                </MenuItem>
                <MenuItem
                  className='cmnt_sort_menu_item'
                  onClick={() => handleSortComment("old")}>
                  {sortedBy === "old" ? (
                    <BiRadioCircleMarked className='dropdown_radio_icon' />
                  ) : (
                    <BiRadioCircle className='dropdown_radio_icon' />
                  )}
                  <span className='menu_text'>Oldest Comment</span>
                </MenuItem>
              </Menu>
            </div>
          }
          body={
            <div
              className={
                isVisble
                  ? "focus_comment_modal_body_section"
                  : "comment_modal_body_section"
              }>
              {/* Commennt sorting section */}
              <div className='comment_card_container'>
                {(comments || []).length > 0 ? (
                  <React.Fragment>
                    <div
                      className='comment_card_section'
                      onScroll={(e) => scrollHandler(e)}>
                      {comments.map((data) => (
                        <PostCommentCard key={data.id} commentData={data} />
                      ))}

                      {/* Loading button */}
                      {currentCommentCount < limit ? null : (
                        <div className='load_more_btn_container'>
                          {isLoadingBtn ? (
                            <div className='loading'>
                              <BiLoaderAlt className='spinner' />
                            </div>
                          ) : (
                            <button
                              className='load_more_btn'
                              onClick={incrementPage}>
                              Load more
                            </button>
                          )}
                        </div>
                      )}
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

                  <div className='post_footer_btn_sections'>
                    <div>
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
                    {isBtnDisable ? null : (
                      <button
                        className='send_cmn_btn'
                        onClick={() => handlePostComment(postData.id)}>
                        <AiOutlineSend
                          className={isBtnDisable ? "disable" : "not_disable"}
                        />
                      </button>
                    )}
                  </div>
                </div>
              )}
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
        {postData.cmnt_prv === "all" ? (
          <button id='comment' className='post_footer_btn post_comment_btn'>
            {/* <BiCommentDetail id="comment" /> */}
            <BiCommentDetail
              id='comment'
              className='post_card_footer_icon cmnt_footer_icon'
            />{" "}
            {commentCount}
          </button>
        ) : null}

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
            {spanCount}
          </button>
        )}

        {/* donation button */}
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
    </React.Fragment>
  );
};

export default NormalPostCardFooter;
