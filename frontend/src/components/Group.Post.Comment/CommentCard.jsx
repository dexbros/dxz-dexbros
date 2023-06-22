/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  addToLike,
  removeToLike,
  addToSpam,
  removeToSpam,
  removeToDislikes,
  addCommentSpam,
  removeCommentSpam,
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
import { setNewPinnedPost } from "../../redux/post/post.actions";
import { Link } from "react-router-dom";
import timeDifference from "../../utils/getCreateTime";
import { FiMoreHorizontal } from "react-icons/fi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import {
  BsPinAngleFill,
  BsEmojiLaughingFill,
  BsEmojiAngryFill,
} from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineSend } from "react-icons/ai";
import {
  AiOutlineShareAlt,
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { t } from "i18next";
import {
  addGroupPost,
  updateGroupPost,
  deleteGroupPost,
  addPostComment,
  updatePostComment,
  deletePostComment,
} from "../../redux/Group/group.actions";
import Reply from "../Reply.Comment/Reply";
import UserAvatar from "../../Assets/userAvatar.webp";
import { RiSpam2Line } from "react-icons/ri";
import { HiOutlineReply } from "react-icons/hi";
import CustomSmallModal from "../modal/CustomSmallModal";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";
import EmojiLike from "../EmojiLike/EmojiLike";
import GroupPostReply from "../GroupPostReply/GroupPostReply";

const CommentCard = ({
  commentData,
  token,
  user,
  reports,
  group,
  setPinnedPost,
  postId,
  addToLikeArray,
  likeList,
  removeToLike,
  addToSpam,
  removeToSpam,
  spamList,
  removeToShares,
  addToShares,
  sharesList,
  addToDislikes,
  removeToDislikes,
  dislikesList,
  updateGroupPost,
  updatePost,
  like,
  angry,
  heart,
  haha,
  party,
  dislike,
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
}) => {
  useSocket();
  const [cmntText, setCmntText] = React.useState(commentData.comment);
  const [cmntImage, setCmntImage] = React.useState(commentData.image);
  const [isPinn, setIsPinn] = React.useState(commentData.pinn);
  const [isDelete, setIsDelete] = React.useState(commentData.delete);
  const [cmntId, setCmntId] = React.useState("");
  const [isHide, setIsHide] = React.useState(commentData.hide);
  const [likeCount, setLikeCount] = React.useState(commentData.l_c);
  const [dislikeCount, setDisikeCount] = React.useState(commentData.d_c);
  const [spamCount, setSpamCount] = React.useState(commentData.s_c);
  const [shareCount, setShareCount] = React.useState(commentData.reply.length);

  // *** Modal states
  const [openCommentPinnedModal, setOpenCommentPinnedModal] =
    React.useState(false);
  const [openCommentHideModal, setOpenCommentHideModal] = React.useState(false);
  const [openCommentEditModal, setOpenCommentEditModal] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);
  const [openHideModal, setOpenHideModal] = React.useState(false);
  const [openDeletModal, setOpenDeletModal] = React.useState(false);
  const [isBtnDisable, setIsBtnDisable] = React.useState(true);

  const [openEmojiIcons, setOpenEmojiIcons] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");

  const [openReply, setOpenReply] = React.useState(false);
  const [replyText, setReplyText] = React.useState("");
  const [replyCount, setReplyCount] = React.useState(commentData.c_c || 0);
  const [repliues, setReplies] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(3);
  const [show, setShow] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [paginate, setPaginate] = React.useState(null);

  const editModalHandler = (id) => {
    setCmntId(id);
    setOpenCommentEditModal(true);
    // if (id === commentData._id) {
    //   setImg(commentData.img);
    //   setMessage(commentData.message);
    //   setGif(commentData.gif);
    //   setUrl(commentData.url);
    // }
  };

  // *** Delete modal handler
  const deleteModalHandler = (id) => {
    // console.log(id)
    setOpenDeletModal(true);
    setCmntId(id);
  };

  // *** Comment delete
  const deleteCommentHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      postId: postId,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/delete/${cmntId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenDeletModal(false);
        setIsDelete(true);
      })
      .catch((error) => console.log("error", error));
  };

  const hideModalHandler = (id) => {
    console.log(id);
    // alert(id)
    setOpenHideModal(true);
    setCmntId(id);
  };

  // *** Comment HIDE handler
  const hideCommentHandler = (cmntId) => {
    var axios = require("axios");
    var data = JSON.stringify({
      postId: postId,
    });
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/hide/${cmntId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        // setPinnedPost(response.data.postData);
        // updateGroupPost(response);
        setOpenCommentHideModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleModalImageChange = (e) => {
    setImg(URL.createObjectURL(e.target.files[0]));
    setSelectImg(e.target.files[0]);
    setGif(e.target.files[0]);
  };

  const updatePostComment = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("message", cmntText);
    formdata.append("img", cmntImage);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/edit/${cmntId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenCommentEditModal(false);
        // setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const reportCommentHandler = (id, list) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      list: ["Violence", "Spam"],
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/report/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast(result.msg);
        setOpenReportModal(false);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  /**
   *
   * @START_FROM_HERE
   */

  // *** Add emoji to input field
  const addEmoji = (e) => {
    setMessage((prev) => prev + e.native);
  };

  // *** Close comment image preview
  const closePrevImage = () => {
    setGif("");
    setImg("");
    setPrevImg("");
  };
  // *** Comment like handler
  const commentLikeHandler = (cmntId) => {
    if (likeList.includes(cmntId)) {
      removeToLike(cmntId);
      setLikeCount((prev) => prev - 1);
    } else {
      if (dislikesList.includes(cmntId)) {
        setDisikeCount((prev) => prev - 1);
        removeToDislikes(cmntId);
        setLikeCount((prev) => prev + 1);
        addToLikeArray(cmntId);
      } else {
        setLikeCount((prev) => prev + 1);
        addToLikeArray(cmntId);
      }
    }
    var axios = require("axios");

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/like/${cmntId}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Comment dislike handler
  const commentDislikeHandler = (cmntId) => {
    if (dislikesList.includes(cmntId)) {
      removeToDislikes(cmntId);
      setDisikeCount((prev) => prev - 1);
    } else {
      if (likeList.includes(cmntId)) {
        setLikeCount((prev) => prev - 1);
        removeToLike(cmntId);
        setDisikeCount((prev) => prev + 1);
        addToDislikes(cmntId);
      } else {
        setDisikeCount((prev) => prev + 1);
        addToDislikes(cmntId);
      }
    }
    var axios = require("axios");
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/dislike/${cmntId}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Comment PINNED modal handler
  const openPinnedModalHandler = (id) => {
    setOpenCommentPinnedModal(true);
    setCmntId(id);
  };
  // *** Comment PINNED handler
  const pinnedCommentHandler = (cmntId) => {
    console.log(cmntId, postId);
    var axios = require("axios");
    var data = JSON.stringify({
      postId: postId,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/pinned/${cmntId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response));
        // setPinnedPost(response.data.postData);
        updateGroupPost(response);
        setOpenCommentPinnedModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Comment SPAM modal handler
  const handleSpamComment = (id) => {
    if (spamList.includes(id)) {
      removeToSpam(id);
      setSpamCount((prev) => prev - 1);
    } else {
      addToSpam(id);
      setSpamCount((prev) => prev + 1);
    }
    var axios = require("axios");

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/spam/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Comment EDIT modal handler
  const openCommentEditModalHandler = (id) => {
    setOpenCommentEditModal(true);
    setCmntId(id);
  };
  // *** Comment EDIT handler
  const commentEditHandler = (cmntId) => {
    var axios = require("axios");
    var data = JSON.stringify({
      postId: postId,
      comment: comment,
      gif: gif,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/edit/${cmntId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data.postData);
        setOpenCommentEditModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle open reply box
  const handleReplyComment = (id) => {
    setOpenReply((p) => !p);
    setCmntId(id);
    fetchReply(id, 1);
  };

  const onClose = () => {
    setOpenHideModal(false);
    setOpenDeletModal(false);
    setOpenCommentEditModal(false);
  };

  // *** Handle update comment
  const handleUpdateComment = () => {};

  React.useEffect(() => {
    if (!cmntText.trim()) {
      setIsBtnDisable(true);
    } else {
      setIsBtnDisable(false);
    }
  }, [cmntText]);

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

  const likeComment = (value, id) => {
    var axios = require("axios");
    const url = `${process.env.REACT_APP_URL_LINK}api/group/post/comment/${value}/${cmntId}/${ownerName}/${likeCount}`;

    var config = {
      method: "put",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        if (value === "like") {
          if (likeCount === 0) {
            addEmojiLike(cmntId);
            setLikeCount((prev) => prev + 1);
          } else {
            if (!like.includes(cmntId)) {
              if (
                dislike.includes(cmntId) ||
                haha.includes(cmntId) ||
                angry.includes(cmntId)
              ) {
                addEmojiLike(cmntId);
                // removeEmojiAngry(id);
                // removeEmojiHaha(id);
                // removeEmojiDislike(id);
              } else {
                setLikeCount((prev) => prev + 1);
                addEmojiLike(cmntId);
              }
            } else {
              removeEmojiLike(cmntId);
              setLikeCount((prev) => prev - 1);
            }
          }
        } else if (value === "angry") {
          if (likeCount === 0) {
            addEmojAngry(cmntId);
            setLikeCount((prev) => prev + 1);
          } else {
            if (!angry.includes(cmntId)) {
              if (
                dislike.includes(id) ||
                haha.includes(cmntId) ||
                like.includes(cmntId)
              ) {
                addEmojAngry(cmntId);
                // removeEmojiLike(id);
                // removeEmojiHaha(id);
                // removeEmojiDislike(id);
              } else {
                addEmojAngry(cmntId);
                setLikeCount((prev) => prev + 1);
              }
            } else {
              removeEmojiAngry(cmntId);
              setLikeCount((prev) => prev - 1);
            }
          }
        } else if (value === "haha") {
          if (likeCount === 0) {
            addEmojHaha(cmntId);
            setLikeCount((prev) => prev + 1);
          } else {
            if (!haha.includes(cmntId)) {
              if (
                dislike.includes(cmntId) ||
                like.includes(cmntId) ||
                angry.includes(cmntId)
              ) {
                // removeEmojiLike(id);
                // removeEmojiAngry(id);
                addEmojHaha(cmntId);
                // removeEmojiDislike(id);
              } else {
                setLikeCount((prev) => prev + 1);
                addEmojHaha(cmntId);
              }
            } else {
              removeEmojiHaha(cmntId);
              setLikeCount((prev) => prev - 1);
            }
          }
        } else if (value === "dislike") {
          if (likeCount === 0) {
            addEmojiDislike(cmntId);
            setLikeCount((prev) => prev + 1);
          } else {
            if (!dislike.includes(id)) {
              if (
                haha.includes(cmntId) ||
                like.includes(cmntId) ||
                angry.includes(cmntId)
              ) {
                // removeEmojiLike(id);
                // removeEmojiAngry(id);
                // removeEmojiHaha(id);
                addEmojiDislike(cmntId);
              } else {
                setLikeCount((prev) => prev + 1);
                addEmojiDislike(cmntId);
              }
            } else {
              removeEmojiDislike(cmntId);
              setLikeCount((prev) => prev - 1);
            }
          }
        }
        if (!response.data.notificationData) {
          console.log("OWN POST");
          setOpenEmojiIcons(false);
        } else {
          console.log("Notification send: ", response.data.notificationData);
          setOpenEmojiIcons(false);
          socket.emit("notification receive", response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRemoveLike = (id, username) => {
    var axios = require("axios");
    const url = `${process.env.REACT_APP_URL_LINK}api/group/post/comment/like/remove/${id}`;

    var config = {
      method: "post",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then((data) => {
        console.log(data);
        removeEmojiLike(id);
        removeEmojiAngry(id);
        removeEmojiHaha(id);
        removeEmojiDislike(id);
        setLikeCount((prev) => prev - 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitComment = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      replyText: replyText,
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
        setReplyCount((prev) => prev + 1);
        setReplyText("");
        setReplies((prev) => [result, ...prev]);
      })
      .catch((error) => console.log("error", error));
  };

  const handleIncreatemPage = () => {
    setPage(page + 1);
    console.log("Page increamented ", page);
    fetchReply(cmntId, page);
  };

  // React.useEffect(() => {
  // }, [page]);

  const fetchReply = (cmntId) => {
    console.log("**** Use Effect fun running ****", page);
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/${cmntId}?page=${page}&limit=${limit}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.length === 0) {
          setShow(false);
        }
        if (page === 1) {
          console.log("Page one");
          setReplies(result);
        } else {
          console.log("Data: ", result);
          setReplies((prev) => [...prev, ...result]);
        }
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      {!isDelete && (
        <React.Fragment>
          {!isHide.includes(user.handleUn) ? (
            <React.Fragment>
              <div
                className={
                  commentData.c_handleUn === user.handleUn
                    ? "comment_card my_post_comment_card"
                    : "comment_card"
                }>
                {/* Edit modal */}
                {openCommentEditModal && (
                  <CustomSmallModal
                    title='Hide comment'
                    onClose={onClose}
                    body={
                      <div className='comment_edit_container'>
                        <textarea
                          placeholder='Update comment'
                          className='modal_textarea'
                          value={cmntText}
                          onChange={(e) =>
                            setCmntText(e.target.value)
                          }></textarea>
                      </div>
                    }
                    footer={
                      <div>
                        {!isBtnDisable && (
                          <button
                            className='update_btn'
                            onClick={updatePostComment}>
                            Hide
                          </button>
                        )}
                      </div>
                    }
                  />
                )}

                {/* Hide modal */}
                {openHideModal && (
                  <CustomSmallModal
                    title='Hide comment'
                    onClose={onClose}
                    body={"Do you want to hide this comment?"}
                    footer={
                      <div>
                        <button
                          className='update_btn'
                          onClick={hideCommentHandler}>
                          Hide
                        </button>
                      </div>
                    }
                  />
                )}

                {/* Delete Modal */}
                {openDeletModal && (
                  <CustomSmallModal
                    title='Hide comment'
                    onClose={onClose}
                    body={"Do you want to delete this comment?"}
                    footer={
                      <div>
                        <button
                          className='update_btn delete_modal_btn'
                          onClick={deleteCommentHandler}>
                          Delete
                        </button>
                      </div>
                    }
                  />
                )}
                {/* Comment Header */}
                <div className='comment_card_header'>
                  <div className='comment_user_section'>
                    <img
                      src={commentData.c_pic || UserAvatar}
                      className='comment_user_avatar'
                    />
                    <span className='commentData_user_firstname'>
                      {commentData.c_fn} {commentData.c_ln}
                    </span>
                    <span className='commentData_user_username'>
                      @{commentData.c_handleUn}
                    </span>
                    <span className='creator_time'>
                      {timeDifference(
                        new Date().getTime(),
                        Number(commentData.timestamp)
                      )}
                    </span>
                  </div>

                  <Menu
                    menuButton={
                      <MenuButton className={"__menu_btn"}>
                        <FiMoreHorizontal />
                      </MenuButton>
                    }>
                    {/* Edit menu */}
                    {/* <MenuItem className={"block_post_menuItem"}>Pin</MenuItem> */}
                    {/* Edit menu */}
                    <MenuItem
                      className={"block_post_menuItem"}
                      onClick={() => editModalHandler(commentData.c_id)}>
                      Edit
                    </MenuItem>
                    {/* Hide menu */}
                    <MenuItem
                      className={"block_post_menuItem"}
                      onClick={() => hideModalHandler(commentData.c_id)}>
                      Hide
                    </MenuItem>
                    {/* Delete menu */}
                    <MenuItem
                      className={"block_post_menuItem delete"}
                      onClick={() => deleteModalHandler(commentData.c_id)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </div>

                {/* Comment body */}
                <div className='comment_body'>
                  <span className='comment_body_text'>{cmntText}</span>
                  {cmntImage && (
                    <div className='comment_image_container'>
                      <img
                        src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${cmntImage}`}
                        className='comment_image'
                      />
                      {/* */}
                    </div>
                  )}
                </div>

                {/* Comment footer */}
                <div className='comment_card_footer'>
                  {/* Like */}
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
                    <div className='emoji_icon_card'>
                      {like.includes(commentData.c_id) ? (
                        <button
                          id='like'
                          className='post_footer_btn post_like'
                          onClick={() =>
                            handleRemoveLike(
                              commentData.c_id,
                              commentData.c_handleUn
                            )
                          }>
                          <AiFillHeart
                            id='like'
                            className='post_like_active like_icon'
                          />{" "}
                          {likeCount}
                        </button>
                      ) : (
                        <>
                          {dislike.includes(commentData.c_id) ? (
                            <button
                              id='like'
                              className='post_footer_btn post_like'
                              onClick={() =>
                                handleRemoveLike(
                                  commentData.c_id,
                                  commentData.c_handleUn
                                )
                              }>
                              <AiFillDislike
                                id='like'
                                className='post_like_active dislike_icon'
                              />{" "}
                              {likeCount}
                            </button>
                          ) : (
                            <>
                              {haha.includes(commentData.c_id) ? (
                                <button
                                  id='like'
                                  className='post_footer_btn post_like'
                                  onClick={() =>
                                    handleRemoveLike(
                                      commentData.c_id,
                                      commentData.c_handleUn
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
                                  {angry.includes(commentData.c_id) ? (
                                    <button
                                      id='like'
                                      className='post_footer_btn post_like'
                                      onClick={() =>
                                        handleRemoveLike(
                                          commentData.c_id,
                                          commentData.c_handleUn
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
                                          commentData.c_id,
                                          commentData.c_handleUn
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
                    </div>
                  </div>

                  {/* Spam */}
                  <button
                    className='comment_footer_btn'
                    onClick={() => handleSpamComment(commentData.c_id)}>
                    <RiSpam2Line
                      className={
                        spamList.includes(commentData.c_id) ? "active_spam" : ""
                      }
                    />{" "}
                    <span>{spamCount}</span>
                  </button>

                  {/* Share */}
                  <button
                    className='comment_footer_btn'
                    onClick={() => handleReplyComment(commentData.c_id)}>
                    <HiOutlineReply />
                    <span className='comment_count'>{replyCount || 0}</span>
                  </button>
                </div>
              </div>
              {openReply && (
                <div className='block_reply_section'>
                  {/* Reply Form */}
                  <div className='reply_form_section'>
                    <input
                      type='text'
                      placeholder='Enter your reply'
                      className='reply_input'
                      value={replyText}
                      onChange={(e) =>
                        setReplyText(e.target.value.slice(0, 50))
                      }
                    />
                    <button
                      className='reply_submit_btn'
                      onClick={handleSubmitComment}>
                      <AiOutlineSend />
                    </button>
                  </div>

                  {/* Reply component */}
                  <>
                    {(repliues || []).length > 0 ? (
                      <>
                        {repliues.map((data) => (
                          <GroupPostReply
                            key={data.r_id}
                            reply={data}
                            setReplyCount={setReplyCount}
                          />
                        ))}
                        {show && (
                          <button
                            className='load_btn'
                            onClick={() => handleIncreatemPage()}>
                            Load
                          </button>
                        )}
                      </>
                    ) : (
                      <div className='blockempty_reply'>No reply found</div>
                    )}
                  </>
                </div>
              )}
            </React.Fragment>
          ) : (
            <div className='comment_card'>
              Unhide this comment{" "}
              <button onClick={() => hideCommentHandler(commentData.c_id)}>
                Unhide
              </button>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
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

  like: state.user.emoji_likes,
  angry: state.user.emoji_angry,
  heart: state.user.emoji_heart,
  haha: state.user.emoji_haha,
  party: state.user.emoji_party,
  dislike: state.user.emoji_dislikes,
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentCard);
