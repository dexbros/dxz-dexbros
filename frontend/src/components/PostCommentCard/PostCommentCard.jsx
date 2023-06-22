/** @format */

import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserAvatar from "../../Assets/userAvatar.webp";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  BsPinAngleFill,
  BsEmojiLaughingFill,
  BsEmojiAngryFill,
} from "react-icons/bs";
import {
  setNewPinnedPost,
  updatePost,
  newPosts,
} from "../../redux/post/post.actions";
import {
  addToLike,
  removeToLike,
  addToSpam,
  removeToSpam,
  removeToDislikes,
  addCommentLike,
  removeCommentLike,
  addCommentDislike,
  removeCommentDislike,
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
  addEmojAngry,
  removeEmojiAngry,
} from "../../redux/user/user.actions";
import {
  updateComment,
  removeAllComments,
} from "../../redux/comment/comment.actions";
import CustomSmallModal from "../modal/CustomSmallModal";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { HiReply } from "react-icons/hi";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import ReplyForm from "../CommentReplyComponent/ReplyForm";
import CommentReply from "../CommentReplyComponent/CommentReply";
import {
  removeAllReply,
  setReplies,
  addNewReply,
} from "../../redux/reply/reply.actions";
import timeDifference from "../../utils/getCreateTime";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";

import EmojiLike from "../EmojiLike/EmojiLike";

/**Toolkit imports */
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectToken,
  selectcommentSpam,
  selectLike,
  selectAngry,
  selectHaha,
  selectDislikes,
} from "../../redux/_user/userSelectors";
import { selectReply } from "../../redux/_post/postSelectors";
import {
  addcommentSpam,
  removecommentSpam,
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
  updatePinnedComment,
  setUpdateComment,
  handleCommentEditComment,
  handlePostCommentDelete,
  handlePostCommentSpam,
  handleCommentLike,
  handleCommentRemoveLike,
  appendReply,
  removeReply,
  handleFetchReplies,
} from "../../redux/_post/postSlice";

const PostCommentCard = ({
  commentData,
  selectedPost,
  cmntSpam,
  cmntLike,
  addCommentLike,
  removeCommentLike,
  cmntDislike,
  addCommentDislike,
  removeCommentDislike,
  removeAllReply,
  addNewReply,
  setCmntPage,
}) => {
  useSocket();
  const { t } = useTranslation(["common"]);
  // Tookit code start
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const commentSpam = useSelector(selectcommentSpam);
  const like = useSelector(selectLike);
  const angry = useSelector(selectAngry);
  const haha = useSelector(selectHaha);
  const dislike = useSelector(selectDislikes);
  const replies = useSelector(selectReply);

  // Toolkit end here....
  const [openPinModal, setOpenPinModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [text, setText] = React.useState("");
  const [cmntId, setCmntId] = React.useState("");
  const [cmntPin, setCmntPin] = React.useState(commentData.pinn);
  const [cmntDelete, setCmntDelete] = React.useState(commentData.delete);
  const [comment, setComment] = React.useState(commentData.comment);
  const [likeCount, setLikeCount] = React.useState(commentData.l_c);
  const [dislikeCount, setDisikeCount] = React.useState(commentData.d_c);
  const [spamCount, setSpamCount] = React.useState(commentData.s_c);
  const [replyCount, setReplyCount] = React.useState(commentData.reply_c);
  const [openReplyForm, setOpenReplyForm] = React.useState(false);
  const [visibleReply, setVisibleReply] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [isEditBtnDisable, setIsEditBtnDisable] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [cmntReplies, setCmntReplies] = React.useState([]);
  const [openEmojiIcons, setOpenEmojiIcons] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");

  // *** Handle close modal
  const closeModal = () => {
    setCmntId("");
    setOpenDeleteModal(false);
    setOpenEditModal(false);
    setOpenPinModal(false);
  };

  // *** Handle pinn and unpinn modal
  const handlePinnedModal = (id) => {
    setCmntId(id);
    setOpenPinModal(true);
  };
  const handlePinnComment = async () => {
    const data = { token, cmntId };
    const commentData = await dispatch(updatePinnedComment(data));
    try {
      dispatch(setUpdateComment(commentData));
      setCmntPin((prev) => !prev);
      setOpenPinModal(false);
    } catch (error) {
      console.log("Error");
    }
  };

  // *** Handle edit modal
  const handleEditModal = (data) => {
    setCmntId(data.id);
    setText(data.comment);
    setOpenEditModal(true);
  };
  // *** Handle delete comment
  const handleEditComment = async () => {
    const data = { token, cmntId, text };
    const commentData = await dispatch(handleCommentEditComment(data));
    try {
      setComment(text);
      setOpenEditModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  // *** Handle delete modal
  const handleDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setCmntId(id);
  };
  // *** Handle delete comment
  const handleDeleteComment = async () => {
    const data = { token, cmntId };
    await dispatch(handlePostCommentDelete(data));
    try {
      setOpenDeleteModal(false);
      setCmntDelete(true);
    } catch (error) {
      console.log(error);
    }
  };

  // *** Handle comment spam
  const handleCommentSpam = (id) => {
    console.log(id);
    if (commentSpam.includes(id)) {
      console.log("Already have");
      dispatch(removecommentSpam(id));
      setSpamCount((prev) => prev - 1);
    } else {
      console.log("Not have");
      dispatch(addcommentSpam(id));
      setSpamCount((prev) => prev + 1);
    }
    const data = { id, token };
    dispatch(handlePostCommentSpam(data));
  };

  // *** Handle comment like
  const handleCommentDislike = (id) => {
    if (cmntLike.includes(id)) {
      removeCommentLike(id);
      setLikeCount((prev) => prev - 1);
      addCommentDislike(id);
      setDisikeCount((prev) => prev + 1);
    } else {
      if (cmntDislike.includes(id)) {
        setDisikeCount((prev) => prev - 1);
        removeCommentDislike(id);
      } else {
        setDisikeCount((prev) => prev + 1);
        addCommentDislike(id);
      }
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/dislike/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.notificationData) {
          socket.emit("notification receive", result);
        } else {
          console.log(result);
        }
      })
      .catch((error) => console.log("error", error));
  };

  // *** Handle comment reply
  const handleCommentReply = (id) => {
    if (!openReplyForm) {
      setOpenReplyForm(true);
      setCmntId(id);
    } else {
      setOpenReplyForm(false);
      setCmntId("");
      dispatch(removeReply());
    }
  };

  // *** Fetch comment reply
  const fetchCommentReply = (id) => {
    console.log("fetch reply");
    const data = { id, token, page, limit };
    dispatch(handleFetchReplies(data));
  };

  React.useEffect(() => {
    if (cmntId && openReplyForm) {
      fetchCommentReply(cmntId);
    }
  }, [page, cmntId]);

  const handleShowReply = (id) => {
    setVisibleReply(true);
    setCmntId(id);
    // fetchCommentReply(id)
  };

  const handleHideReply = (id) => {
    setVisibleReply(false);
    setCmntId("");
    if (!visibleReply) {
      // removeAllReply([]);
    }
  };

  React.useEffect(() => {
    if (!text.trim()) {
      setIsEditBtnDisable(true);
    } else {
      setIsEditBtnDisable(false);
    }
  }, [text]);

  const handleLikeEmoji = (id, username) => {
    setOpenEmojiIcons(true);
    setCmntId(id);
    setOwnerName(username);
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

  // *** Like post comment
  const likeComment = async (value, id) => {
    const data = { value, id, ownerName, likeCount, token };
    // console.log(data);
    if (value === "like") {
      if (likeCount === 0) {
        setLikeCount((prev) => prev + 1);
        dispatch(addLike(id));
      } else {
        if (!like.includes(id)) {
          dispatch(addLike(id));
          setLikeCount((prev) => prev + 1);
          dispatch(removeAngry(id));
          dispatch(removeHaha(id));
          dispatch(removeDislikes(id));
        } else {
          setLikeCount((prev) => prev - 1);
          dispatch(removeLike(id));
        }
      }
    } else if (value === "dislike") {
      if (likeCount === 0) {
        setLikeCount((prev) => prev + 1);
        dispatch(addDislikes(id));
      } else {
        console.log(">>>>>>> ", dislike.includes(id));
        if (!dislike.includes(id)) {
          dispatch(removeLike(id));
          dispatch(addDislikes(id));
          setLikeCount((prev) => prev + 1);
          dispatch(removeAngry(id));
          dispatch(removeHaha(id));
        } else {
          console.log("*****");
          setLikeCount((prev) => prev - 1);
          dispatch(removeDislikes(id));
        }
      }
    } else if (value === "haha") {
      if (likeCount === 0) {
        setLikeCount((prev) => prev + 1);
        dispatch(addHAHA(id));
      } else {
        if (!haha.includes(id)) {
          dispatch(removeLike(id));
          dispatch(removeDislikes(id));
          dispatch(addHAHA(id));
          setLikeCount((prev) => prev + 1);
          dispatch(removeAngry(id));
        } else {
          setLikeCount((prev) => prev - 1);
          dispatch(addHAHA(id));
        }
      }
    } else if (value === "angry") {
      if (likeCount === 0) {
        dispatch(addAngry(id));
        setLikeCount((prev) => prev + 1);
      } else {
        if (!angry.includes(id)) {
          dispatch(removeLike(id));
          dispatch(removeDislikes(id));
          dispatch(removeHaha(id));
          dispatch(addAngry(id));
          setLikeCount((prev) => prev + 1);
        } else {
          dispatch(addAngry(id));
          setLikeCount((prev) => prev + 1);
        }
      }
    }
    const responseData = await dispatch(handleCommentLike(data));

    console.log(responseData);
    // Here we notify the user
    if (!responseData.notificationData) {
      console.log("OWN POST");
      setOpenEmojiIcons(false);
    } else {
      console.log("Notification send: ", responseData.notificationData);
      setOpenEmojiIcons(false);
      socket.emit("notification receive", responseData);
    }
  };

  // **** Remove like post comment
  const handleRemoveLike = (id, username) => {
    dispatch(removeLike(id));
    dispatch(removeAngry(id));
    dispatch(removeHaha(id));
    dispatch(removeDislikes(id));
    setLikeCount((prev) => prev - 1);
    const data = { token, id };
    dispatch(handleCommentRemoveLike(data));
  };

  return (
    <React.Fragment>
      {!cmntDelete && (
        <div
          className={
            commentData.c_u_du === user.handleUn
              ? "post_comment_card my_post_comment_card"
              : "post_comment_card"
          }>
          {/* Comment pinn unpinn modal */}
          {openPinModal && (
            <CustomSmallModal
              onClose={closeModal}
              title={
                !commentData.pinn ? (
                  <>{t("Pinn comment")}</>
                ) : (
                  <>{t("Unpinn comment")}</>
                )
              }
              body={
                !commentData.pinn ? (
                  <>{t("Do you want to pinn comment?")}</>
                ) : (
                  <>{t("Do you want to unpinn comment?")}</>
                )
              }
              footer={
                <button className='update_btn' onClick={handlePinnComment}>
                  {!commentData.pinn ? <>{t("Pinn")}</> : <>{t("Unpinn")}</>}
                </button>
              }
            />
          )}

          {/* Comment pinn unpinn modal */}
          {openEditModal && (
            <CustomSmallModal
              onClose={closeModal}
              title={
                !commentData.pinn ? (
                  <>{t("Pinn comment")}</>
                ) : (
                  <>{t("Unpinn comment")}</>
                )
              }
              body={
                <>
                  <textarea
                    type='text'
                    className='edit_textarea_input'
                    placeholder='Change your comment'
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 100))}
                  />
                </>
              }
              footer={
                !isEditBtnDisable && (
                  <button className='update_btn' onClick={handleEditComment}>
                    <>{t("Update")}</>
                  </button>
                )
              }
            />
          )}

          {/* Comment delete modal */}
          {openDeleteModal && (
            <CustomSmallModal
              onClose={closeModal}
              title={<>{t("Delete comment")}</>}
              body={<>{t("Do you want to delete this comment?")}</>}
              footer={
                <button
                  className='update_btn delete_btn'
                  onClick={handleDeleteComment}>
                  {<>{t("Delete")}</>}
                </button>
              }
            />
          )}

          {/* Pinned comment status */}
          {cmntPin ? <BsPinAngleFill className='cmnt_pin_icon' /> : null}

          {/* Post comment card */}
          <div className='post_comment_card_header'>
            <div className='post_comment_user'>
              <img
                src={
                  commentData.c_u_img
                    ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${commentData.c_u_img}`
                    : UserAvatar
                }
                className='comment_avatar'
              />
              <div>
                <span className='comment_user_name'>
                  {commentData.c_fn} {commentData.c_ln}
                </span>
                <span className='comment_user_username'>
                  @{commentData.c_u_du}
                </span>
                <div className='comment_time'>
                  {timeDifference(
                    new Date().getTime(),
                    Number(commentData.c_t)
                  )}
                </div>
              </div>
            </div>
            <Menu
              menuButton={
                <MenuButton className={"post_menu_button"}>
                  <FiMoreHorizontal />
                </MenuButton>
              }>
              {/* Pinned Comment menu */}
              {
                // user.handleUn === selectedPost.u_dun &&
                <MenuItem
                  onClick={(e) => handlePinnedModal(commentData.id)}
                  className={"post_card_menuitem"}>
                  {!commentData.pinn ? (
                    <>{t("Pinned")}</>
                  ) : (
                    <>{t("Unpinned")}</>
                  )}
                </MenuItem>
              }

              {/* Edit comment menu */}
              {user.handleUn === commentData.c_u_du && (
                <MenuItem
                  className={"post_card_menuitem"}
                  onClick={(e) => handleEditModal(commentData)}>
                  {t("Edit")}
                </MenuItem>
              )}

              {/* Delete comment menu */}
              {user.handleUn === commentData.c_u_du && (
                <MenuItem
                  onClick={() => handleDeleteModal(commentData.id)}
                  className={"post_card_menuitem delete"}>
                  {t("Delete")}
                </MenuItem>
              )}
            </Menu>
          </div>

          {/* Post comment body */}
          <div className='post_comment_card_body'>
            <span className='comment_body'>{comment}</span>
            {commentData.img && (
              <div className='comment_body_image_section'>
                <img
                  src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${commentData.img}`}
                  className='comment_body_image'
                />
              </div>
            )}
          </div>

          {/* Post comment footer */}
          <div className='post_comment_card_footer'>
            <div className='comment_card_footer_section'>
              {openEmojiIcons && (
                <div className='card_emoji_container' ref={wrapperRef}>
                  <EmojiLike
                    id={cmntId}
                    setQuery={setQuery}
                    clickHandler={likeComment}
                  />
                </div>
              )}
              <>
                {like.includes(commentData.id) ? (
                  <button
                    id='like'
                    className='post_footer_btn post_like'
                    onClick={() =>
                      handleRemoveLike(commentData.id, commentData.c_u_du)
                    }>
                    <AiFillHeart
                      id='like'
                      className='post_like_active like_icon'
                    />{" "}
                    {likeCount}
                  </button>
                ) : (
                  <>
                    {dislike.includes(commentData.id) ? (
                      <button
                        id='like'
                        className='post_footer_btn post_like'
                        onClick={() =>
                          handleRemoveLike(commentData.id, commentData.c_u_du)
                        }>
                        <AiFillDislike
                          id='like'
                          className='post_like_active dislike_icon'
                        />{" "}
                        {likeCount}
                      </button>
                    ) : (
                      <>
                        {haha.includes(commentData.id) ? (
                          <button
                            id='like'
                            className='post_footer_btn post_like'
                            onClick={() =>
                              handleRemoveLike(
                                commentData.id,
                                commentData.c_u_du
                              )
                            }>
                            <BsEmojiLaughingFill
                              id='like'
                              className='post_like_active funny_icon'
                            />{" "}
                            {likeCount}
                          </button>
                        ) : (
                          <>
                            {angry.includes(commentData.id) ? (
                              <button
                                id='like'
                                className='post_footer_btn post_like'
                                onClick={() =>
                                  handleRemoveLike(
                                    commentData.id,
                                    commentData.c_u_du
                                  )
                                }>
                                <BsEmojiAngryFill
                                  id='like'
                                  className='post_like_active angry_icon'
                                />{" "}
                                {likeCount}
                              </button>
                            ) : (
                              <button
                                id='like'
                                className='post_footer_btn post_like'
                                onClick={() =>
                                  handleLikeEmoji(
                                    commentData.id,
                                    commentData.c_u_du
                                  )
                                }>
                                <AiOutlineHeart id='like' /> {likeCount}
                              </button>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            </div>

            {/* Spam button */}
            <button className='comment_card_footer_btn cmnt_spam_btn'>
              {commentSpam.includes(commentData.id) ? (
                <RiSpam2Fill className='cmnt_spam_actv_icon' />
              ) : (
                <RiSpam2Line className='cmnt_icon' />
              )}{" "}
              <span
                className='spam_count cmnt_count_footer'
                onClick={() => handleCommentSpam(commentData.id)}>
                {spamCount}
              </span>
            </button>

            {/* Reply  button */}
            <button
              className='comment_card_footer_btn cmnt_reply_btn'
              onClick={() => handleCommentReply(commentData.id)}>
              <HiReply
                className={
                  isActive ? "cmnt_icon active_cmnt_icon" : "cmnt_icon"
                }
              />{" "}
              <span className='reply_count cmnt_count_footer'>
                {replyCount}
              </span>
            </button>
          </div>

          {/* Comment reply form */}
          {openReplyForm && (
            <div className='reply_container_section'>
              <ReplyForm cmntId={cmntId} setReplyCount={setReplyCount} />

              {(replies || []).length > 0 ? (
                <div className='cmnt_reply_card_container'>
                  {replies.map((data) => (
                    <CommentReply key={data.id} replyData={data} />
                  ))}
                  {replies.length >= limit && (
                    <button
                      className='reply_load_more_btn'
                      onClick={() => setCmntPage((prev) => prev + 1)}>
                      Load
                    </button>
                  )}
                </div>
              ) : (
                <div className='empty_comment_reply'>No comment found</div>
              )}
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  spamList: state.user.spam,
  likeList: state.user.likes,
  dislikesList: state.user.dislikes,
  selectComment: state.post.selectComment,
  likes: state.comment.likes,
  selectedPost: state.post.selectedPost,
  cmntSpam: state.user.cmntSpam,
  cmntLike: state.user.cmntLike,
  cmntDislike: state.user.cmntDislike,
  replies: state.reply.replies,
  //
  like: state.user.emoji_likes,
  angry: state.user.emoji_angry,
  heart: state.user.emoji_heart,
  haha: state.user.emoji_haha,
  party: state.user.emoji_party,
  dislike: state.user.emoji_dislikes,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  removeToSpam: (post) => dispatch(removeToSpam(post)),
  addToLikeArray: (post) => dispatch(addToLike(post)),
  removeToLike: (post) => dispatch(removeToLike(post)),
  updateComment: (data) => dispatch(updateComment(data)),
  removeAllComments: (data) => dispatch(removeAllComments(data)),
  addCommentLike: (data) => dispatch(addCommentLike(data)),
  removeCommentLike: (data) => dispatch(removeCommentLike(data)),
  addCommentDislike: (data) => dispatch(addCommentDislike(data)),
  removeCommentDislike: (data) => dispatch(removeCommentDislike(data)),
  removeAllReply: (data) => dispatch(removeAllReply(data)),
  setReplies: (data) => dispatch(setReplies(data)),
  addNewReply: (data) => dispatch(addNewReply(data)),

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
});

export default PostCommentCard;
