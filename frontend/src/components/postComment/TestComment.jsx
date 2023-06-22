/** @format */

import React, { useState, useEffect } from "react";
// import "./CommentCard.css";
import { connect } from "react-redux";
import {
  userLogin,
  addToLike,
  removeToLike,
  addToSpam,
  removeToSpam,
  removeToShares,
  addToShares,
  addToDislikes,
  removeToDislikes,
} from "../../redux/user/user.actions";
import {
  setNewPinnedPost,
  updateComments,
} from "../../redux/post/post.actions";
import { Link } from "react-router-dom";
import timeDifference from "../../utils/getCreateTime";
import { FiMoreHorizontal } from "react-icons/fi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import {
  AiOutlineCamera,
  AiFillCloseCircle,
  AiOutlineFileGif,
} from "react-icons/ai";
import intToString from "../../utils/PostCount";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VscPinnedDirty } from "react-icons/vsc";
import { GrGallery } from "react-icons/gr";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import GifModal from "../modal/GifModal";
import { GrClose } from "react-icons/gr";
import {
  AiFillLike,
  AiOutlineLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import CommentReply from "../GroupCommentReply.Form/CommentReply";
import ReplyComponent from "../GroupCommentReplyComponent/ReplyComponent";

import {
  BsFillPinAngleFill,
  BsEmojiLaughing,
  BsReplyFill,
} from "react-icons/bs";
import "./TestComment.css";
// import PostCommentReplies from '../PostCommentReplies/PostCommentReplies';
// import ReplyComp from '../ReplyComponent/ReplyComp';

const TestComment = ({
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
  updateComments,
  deleteComment,
}) => {
  const [commentId, setCommentId] = React.useState("");
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [openHideModal, setOpenHideModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [comment, setComment] = React.useState(commentData.comment);
  const [image, setImage] = React.useState(commentData.image);
  const [gif, setGif] = React.useState(commentData.gif);
  const [prevImage, setPrevImage] = React.useState("");
  const [uploadImage, setUploadImage] = React.useState(commentData.image);
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [selectPostId, setSelectPostId] = React.useState("");
  const [selectCommentId, setSelectCommentId] = React.useState("");
  const [selectUserFirstName, setSelectUserFirstName] = React.useState("");
  const [selectUserLastName, setSelectUserLastName] = React.useState("");
  const [selectDisplayUsername, setDisplayUsername] = React.useState("");
  const [selectedUserImg, setSelectedUserImg] = React.useState("");
  const [showReplies, setShowReplies] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(commentData.l_c);
  const [dislikeCount, setDislikeCount] = React.useState(commentData.d_c);
  const [page, setPage] = React.useState(1);
  const [replies, setReplies] = React.useState([]);

  // *** Handle pinned comment modal
  const handlePinnedModal = (id) => {
    setOpenPinnedModal(true);
    setCommentId(id);
  };
  // *** Handle comment pinned
  const handleCommentPin = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      commentId: commentId,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/comment/pinned/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setOpenPinnedModal(false);
        setPinnedPost(response.data.post);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle hide comment modal
  const handleCommentHideModal = (id) => {
    setOpenHideModal(true);
    setCommentId(id);
  };
  // *** Handle Hide comment
  const handleHideComment = (commentId) => {
    var axios = require("axios");
    var data = JSON.stringify({
      commentId: commentId,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/comment/hide/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data.post);
        setOpenHideModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle Delete comment modal
  const handleDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setCommentId(id);
  };
  // *** Handle delete comment
  const handleDeleteComment = () => {
    deleteComment(postId);
    var axios = require("axios");
    var data = JSON.stringify({
      commentId: commentId,
    });

    var config = {
      method: "delete",
      url: `${process.env.REACT_APP_URL_LINK}/api/posts/comment/delete/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setOpenDeleteModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle comment LIKE
  const handleCommentLike = (commentId) => {
    if (dislikesList.includes(commentId)) {
      removeToDislikes(commentId);
      addToLikeArray(commentId);
      setLikeCount((prev) => prev + 1);
      setDislikeCount((prev) => prev - 1);
    } else {
      if (likeList.includes(commentId)) {
        removeToLike(commentId);
        commentData.l_c + 1;
        setLikeCount((prev) => prev - 1);
        // setPinnedPost(response.data.post)
      } else {
        addToLikeArray(commentId);
        setLikeCount((prev) => prev + 1);
      }
    }
    var axios = require("axios");
    var data = JSON.stringify({
      commentId: commentId,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/comment/like/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        // console.log(JSON.stringify(response.data));
        // setPinnedPost(response.data.post)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle Comment DISLIKE
  const handleCommentDislike = (commentId) => {
    if (likeList.includes(commentId)) {
      // Remove from likes
      removeToLike(commentId);
      addToDislikes(commentId);
      setLikeCount((prev) => prev - 1);
      setDislikeCount((prev) => prev + 1);
    } else {
      if (dislikesList.includes(commentId)) {
        // Remove from dislikes list
        removeToDislikes(commentId);
        setDislikeCount((prev) => prev - 1);
      } else {
        // Adding to dislike list
        addToDislikes(commentId);
        setDislikeCount((prev) => prev + 1);
      }
    }
    var axios = require("axios");
    var data = JSON.stringify({
      commentId: commentId,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/comment/dislike/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data.post);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle comment SPAM
  const handleCommentSpam = (commentId) => {
    if (spamList.includes(commentId)) {
      // Remove
      removeToSpam(commentId);
    } else {
      // Add
      console.log("Add");
      addToSpam(commentId);
    }
    var axios = require("axios");
    var data = JSON.stringify({
      commentId: commentId,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/comment/spam/${postId}`,
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
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Post comment EDIT modal
  const editModalHandler = (id) => {
    setOpenEditModal(true);
    setCommentId(id);
  };

  // *** Handle Image change
  const handleImageChange = (e) => {
    setUploadImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    console.log(URL.createObjectURL(e.target.files[0]));
  };

  // *** Adding emoji to input field
  const addEmoji = (e) => {
    setComment((prev) => prev + e.native);
  };

  // *** Handle Edit comment
  const handleEditComment = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      commentId: commentId,
      comment: comment,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/comment/update/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setPinnedPost(response.data.postData);
        setOpenEditModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle reply input
  const showReplyContent = (id, ln, fn, dp, img) => {
    setShowReplyForm((p) => !p);
    setSelectCommentId(id);
    setSelectUserLastName(ln);
    setSelectUserFirstName(fn);
    setDisplayUsername(dp);
    setSelectedUserImg(img);
  };
  const showRepliesMessage = () => {
    setShowReplies((p) => !p);
    // scrollToBottom();
  };

  // *** Fetch comment related replies
  const fetchReplies = (selectCommentId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/${selectCommentId}?page=${page}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setReplies((prev) => [...prev, ...result]);
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
    console.log(page);
    if (selectCommentId) {
      fetchReplies(selectCommentId);
    }
  }, [page, selectCommentId]);

  return <React.Fragment>Hello</React.Fragment>;
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  spamList: state.user.spam,
  sharesList: state.user.shares,
  likeList: state.user.likes,
  dislikesList: state.user.dislikes,
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
  updateComments: (data) => dispatch(updateComments(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestComment);
