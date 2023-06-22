/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserAvatar from "../../Assets/userAvatar.webp";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import CustomSmallModal from "../modal/CustomSmallModal";

import { useSocket, socket, isSocketConnected } from "../../socket/socket";

import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectToken,
  selectcommentSpam,
  selectLike,
  selectDislikes,
} from "../../redux/_user/userSelectors";
import {
  addcommentSpam,
  removecommentSpam,
  addLike,
  removeLike,
  addDislikes,
  removeDislikes,
} from "../../redux/_user/userSlice";
import {
  handleDeleteReply,
  handleReplySpam,
  handleReplyLike,
  handleReplyDislike,
} from "../../redux/_post/postSlice";

const CommentReply = ({ replyData }) => {
  useSocket();
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const spam = useSelector(selectcommentSpam);
  const likes = useSelector(selectLike);
  const dislikes = useSelector(selectDislikes);

  const [content, setContent] = React.useState(replyData.content);
  const [likeCount, setLikeCount] = React.useState(replyData.l_c);
  const [dislikeCount, setDisikeCount] = React.useState(replyData.d_c);
  const [spamCount, setSpamCount] = React.useState(replyData.s_c);
  const [deleteReply, setDeleteReply] = React.useState(replyData.delete);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [replyId, setReplyId] = React.useState("");

  // *** Handle spam reply
  const handleSpam = (id) => {
    if (spam.includes(id)) {
      dispatch(removecommentSpam(id));
      setSpamCount((prev) => prev - 1);
    } else {
      dispatch(addcommentSpam(id));
      setSpamCount((prev) => prev + 1);
    }
    const data = { token, id };
    dispatch(handleReplySpam(data));
  };

  // *** Handle like reply
  const handleLike = async (id) => {
    if (dislikes.includes(id)) {
      // removeCommentDislike(id);
      dispatch(removeDislikes(id));
      setDisikeCount((prev) => prev - 1);
      // addCommentLike(id);
      dispatch(addLike(id));
      setLikeCount((prev) => prev + 1);
    } else {
      if (likes.includes(id)) {
        setLikeCount((prev) => prev - 1);
        // removeCommentLike(id);
        dispatch(removeLike(id));
      } else {
        setLikeCount((prev) => prev + 1);
        // addCommentLike(id);
        dispatch(addLike(id));
      }
    }
    const data = { token, id };
    const result = await dispatch(handleReplyLike(data));
    try {
      console.log(result);
      if (result.notificationData) {
        socket.emit("notification receive", result);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async (id) => {
    if (likes.includes(id)) {
      // removeCommentLike(id);
      dispatch(removeLike(id));
      setLikeCount((prev) => prev - 1);
      // addCommentDislike(id);
      dispatch(addDislikes(id));
      setDisikeCount((prev) => prev + 1);
    } else {
      if (dislikes.includes(id)) {
        setDisikeCount((prev) => prev - 1);
        // removeCommentDislike(id);
        dispatch(removeDislikes(id));
      } else {
        setDisikeCount((prev) => prev + 1);
        // addCommentDislike(id);
        dispatch(addDislikes(id));
      }
    }
    const data = { id, token };
    const result = await dispatch(handleReplyDislike(data));
    if (result.notificationData) {
      socket.emit("notification receive", result);
    } else {
      console.log(result);
    }
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);

    // var requestOptions = {
    //   method: "PUT",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };

    // fetch(
    //   `${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/dislike/${id}`,
    //   requestOptions
    // )
    //   .then((response) => response.json())
    //   .then((result) => {
    //     if (result.notificationData) {
    //       socket.emit("notification receive", result);
    //     } else {
    //       console.log(result);
    //     }
    //   })
    //   .catch((error) => console.log("error", error));
  };

  const handleDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setReplyId(id);
  };

  const closeModal = () => {
    setOpenDeleteModal(false);
    setReplyId("");
  };

  // *** Handle delete reply
  const handleDeleteComment = async () => {
    const data = { token, replyId };
    const replyData = await dispatch(handleDeleteReply(data));
    console.log(replyData);
    try {
      setDeleteReply(true);
      closeModal();
    } catch (error) {
      setDeleteReply(false);
      closeModal();
    }
  };

  return (
    <React.Fragment>
      {!deleteReply && (
        <div className='reply_card'>
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
          {/* Reply header */}
          <div className='reply_header_section'>
            <div className='reply_user_info'>
              <img
                src={replyData.r_u_pic || UserAvatar}
                className='reply_user_pic'
              />
              <span className='reply_user_name'>
                {replyData.r_u_fn} {replyData.r_u_ln}
              </span>
              <span className='reply_user_username'>@{replyData.r_u_dun}</span>
            </div>

            <Menu
              menuButton={
                <MenuButton className={"post_menu_button"}>
                  <FiMoreHorizontal />
                </MenuButton>
              }>
              <MenuItem
                onClick={() => handleDeleteModal(replyData.id)}
                className={"post_card_menuitem delete"}>
                {t("Delete")}
              </MenuItem>
            </Menu>
          </div>

          {/* Reply body */}
          <div className='reply_body_section'>{content}</div>

          {/* Reply footer */}
          <div className='reply_footer_section'>
            <button
              className='reply_footer_btn'
              onClick={() => handleLike(replyData.id)}>
              {likes.includes(replyData.id) ? (
                <AiFillLike className='cmnt_icon like_cmnt_icon_active' />
              ) : (
                <AiOutlineLike className='cmnt_icon' />
              )}{" "}
              <span className='reply_footer_count'>{likeCount}</span>
            </button>

            {/* Dislike */}
            <button
              className='reply_footer_btn'
              onClick={() => handleDislike(replyData.id)}>
              {dislikes.includes(replyData.id) ? (
                <AiFillDislike className='cmnt_icon dislike_cmnt_icon_active' />
              ) : (
                <AiOutlineDislike className='cmnt_icon' />
              )}{" "}
              <span className='reply_footer_count'>{dislikeCount}</span>
            </button>

            {/* Spam */}
            <button
              className='reply_footer_btn'
              onClick={() => handleSpam(replyData.id)}>
              {!spam.includes(replyData.id) ? <RiSpam2Line /> : <RiSpam2Fill />}{" "}
              <span className='reply_footer_count'>{spamCount}</span>
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  spam: state.user.cmntSpam,
  likes: state.user.cmntLike,
  dislikes: state.user.cmntDislike,
});

const mapDispatchToProps = (dispatch) => ({
  addCommentSpam: (data) => dispatch(addCommentSpam(data)),
  removeCommentSpam: (data) => dispatch(removeCommentSpam(data)),
  addCommentLike: (data) => dispatch(addCommentLike(data)),
  removeCommentLike: (data) => dispatch(removeCommentLike(data)),
  addCommentDislike: (data) => dispatch(addCommentDislike(data)),
  removeCommentDislike: (data) => dispatch(removeCommentDislike(data)),
});

export default CommentReply;
