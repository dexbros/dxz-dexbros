/** @format */

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import timeDifference from "../../utils/getCreateTime";
import { FiMoreHorizontal } from "react-icons/fi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { SiGoogleanalytics } from "react-icons/si";
import {
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlineCopy,
  AiTwotoneCopy,
} from "react-icons/ai";
import "./GroupPost.css";
import { VscPinned } from "react-icons/vsc";
import { BsTrash } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { connect } from "react-redux";
import {
  userLogin,
  addToLike,
  removeToLike,
  addToSpam,
  removeToSpam,
  removeToShares,
  addToShares,
  addFollower,
  removeFollower,
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
import { updatePost, setNewPinnedPost } from "../../redux/post/post.actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdHideSource } from "react-icons/md";
import intToString from "../../utils/PostCount";
import CustomModal from "../modal/CustomModal";
import CustomPostForm from "../modal/CustomPostForm";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import {
  AiOutlineHeart,
  AiOutlineShareAlt,
  AiOutlineStar,
} from "react-icons/ai";
import { BsFillPinAngleFill } from "react-icons/bs";
import CommentCard from "../Group.Post.Comment/CommentCard";
import { BiArrowBack } from "react-icons/bi";
import {
  addGroupPost,
  updateGroupPost,
  deleteGroupPost,
  addPostComment,
  updatePostComment,
  deletePostComment,
  setUpdateGroup,
} from "../../redux/Group/group.actions";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../Assets/userAvatar.webp";
import { addNewPost } from "../../redux/GroupPost/groupPost.action";
import { ImSpinner2 } from "react-icons/im";
import { AiFillHeart, AiFillDislike, AiOutlineSend } from "react-icons/ai";
import { BsEmojiLaughingFill, BsEmojiAngryFill } from "react-icons/bs";
import EmojiLike from "../EmojiLike/EmojiLike";
import CustomPostFormModal from "../modal/CustomPostForm";
import {
  BiFilterAlt,
  BiRadioCircleMarked,
  BiRadioCircle,
} from "react-icons/bi";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import {
  handlePinnedBlockPost,
  handleDeleteBlockPost,
  handleEditBlockPost,
  handleSpamBlockPost,
  handleLikeBlockPost,
} from "../../redux/_blockPost/blockPostSlice";
import {
  selectToken,
  selectUser,
  selectLike,
  selectAngry,
  selectHaha,
  selectFollowing,
  selectDislikes,
  selectSpam,
} from "../../redux/_user/userSelectors";
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

const GroupPost = ({
  postData,
  groupData,
  // setPinnedPost,
  // addToSpam,
  // removeToSpam,
  // spamList,
  // addToShares,
  // updateGroupPost,
  // updatePost,
  // groupData,
  // addNewPost,
  // removeFollower,
  // addFollower,
  // addEmojiLike,
  // removeEmojiLike,
  // addEmojiDislike,
  // removeEmojiDislike,
  // addEmojHaha,
  // removeEmojiHaha,
  // addEmojAngry,
  // removeEmojiAngry,
}) => {
  useSocket();
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const following = useSelector(selectFollowing);
  const like = useSelector(selectLike);
  const angry = useSelector(selectAngry);
  const haha = useSelector(selectHaha);
  const dislike = useSelector(selectDislikes);
  const spamList = useSelector(selectSpam);

  // const [query, setQuery] = React.useState("");
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [postId, setPostId] = React.useState("");
  const [openBookmarkModal, setOpenBookmarkModal] = React.useState(false);
  const [openHideModal, setOpenHideModal] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  const [selectPost, setSelectPost] = React.useState(null);

  const [value, setValue] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [previewImg, setPreviewImage] = React.useState("");
  const [newImage, setNewImage] = React.useState("");

  const [newGif, setNewGif] = React.useState("");
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [openGifModal, setOpenGifModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showCommentContainer, setShowCommentContainer] = React.useState(false);
  const [activeCmntTag, setActiveCmntTag] = React.useState("time");
  const [showLikeList, setShowLikeList] = React.useState(false);
  const [postLikeList, setPostLikeList] = React.useState([]);
  const [btnClicked, setBtnClicked] = React.useState(false);
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const [repostModal, setRepostModal] = React.useState(false);
  const [selectPostData, setSelectPostData] = React.useState(null);
  const [repostContent, setRepostContent] = React.useState("");
  const [modalPreviewImage, setModalPreviewImage] = React.useState("");
  const [imageUploader, setImageUploader] = React.useState("");
  const [lastResponseData, setLastResponseData] = React.useState(1);
  const [commentsData, setCommentsData] = React.useState([]);
  const [sortedBy, setSortedBy] = React.useState("new");
  const [prevSortedBy, setprevSortedBy] = React.useState("new");
  const [openEmojiIcons, setOpenEmojiIcons] = React.useState(false);

  const [content, setContent] = React.useState("");
  const [editImage, setEditImage] = React.useState("");
  const [editPrevImage, setEditPrevImage] = React.useState("");
  const [editGif, setEditGif] = React.useState("");
  const [openCommentModal, setOpenCommentModal] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isVisble, setIsVisble] = React.useState(false);
  const [text, setText] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const [isBtnDisable, setIsBtnDisable] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [spamCount, setSpamCount] = React.useState(postData.spam);
  const [postContent, setPostContent] = React.useState(postData.content || "");

  // **
  const [deletePost, setDeletePost] = React.useState(postData.deleted || false);
  const [pinned, setPinned] = React.useState(postData.pinned);
  // const [hide, setHide] = React.useState(postData.hide);
  // const [bookmark, setBookmark] = React.useState(postData.book);
  const [openDonatModal, setOpenDonatModal] = React.useState(false);
  const [donateValue, setDonateValue] = React.useState(0);
  const [donateBtnVisible, setDonateBtnVisible] = React.useState(false);
  const [custommessage, setCustomMessage] = React.useState("");
  const [postUserId, setPostUserId] = React.useState("");
  const [likeCount, setLikeCount] = React.useState(postData.l_c);
  const [openLikeModal, setOpneLikeModal] = React.useState(false);
  const [likeType, setLikeType] = React.useState("all");
  const [usersList, setUsersList] = React.useState([]);
  const [currentCmntCount, setCurrentCmntCount] = React.useState(0);
  const [myComments, setMyComments] = React.useState([]);

  const [success, setSuccess] = React.useState(false);

  // *** Handle pinned modal
  const handlePinnedModa = (id) => {
    setOpenPinnedModal(true);
    setPostId(id);
  };
  // *** Handle pinned post
  const handlePinnedPost = async () => {
    setIsBtnLoading(true);
    const data = { postId, token };
    const result = await dispatch(handlePinnedBlockPost(data));
    console.log(result);
    setPinned((previous) => !previous);
    setIsBtnLoading(false);
    setOpenPinnedModal(false);
  };

  // *** Handle Group Post Delete Modal
  const deleteModalHandler = (id) => {
    setOpenDeleteModal(true);
    setPostId(id);
  };
  // *** Handle delete post
  const handleDeletePost = async () => {
    const data = { postId, token };
    const result = await dispatch(handleDeleteBlockPost(data));
    setDeletePost(true);
    setOpenDeleteModal(false);
  };

  // *** Handle Group Post Edit Modal
  const handleEditModal = (id, postData) => {
    console.log(postData);
    setOpenEditModal(true);
    setPostId(postData.p_id);
    setContent(postData.content);
  };
  // *** Handle Eit post
  const handleEdit = async () => {
    setIsBtnLoading(true);
    const data = { token, content, postId };
    const result = await dispatch(handleEditBlockPost(data));

    setIsBtnLoading(false);
    setEditImage("");
    setEditGif("");
    setPostContent(content);
    setContent("");
    setOpenEditModal(false);
  };

  // *** Group post spam
  const postSpamHandler = async (id) => {
    if (spamList.includes(id)) {
      dispatch(setRemoveSpam(id));
      setSpamCount((prev) => prev - 1);
    } else {
      dispatch(setAddSpam(id));
      setSpamCount((prev) => prev + 1);
    }
    const data = { id, token };
    const result = await dispatch(handleSpamBlockPost(data));
  };

  /******************************************************************** */

  const handleImageChange = (e) => {
    console.log("Call");
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  // *** close all images
  const closeImages = () => {
    setPrevImage("");
    setImage("");
  };

  React.useEffect(() => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/${postId}/liked_user`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data.post_likes);
        setPostLikeList(response.data.post_likes);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [showLikeList]);

  // *** Group post like
  const likePost = async(value, id) => {
    const data = { value, postId, token };
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
      dispatch(handleLikeBlockPost(data));
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
      dispatch(handleLikeBlockPost(data));
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
      dispatch(handleLikeBlockPost(data));
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
      dispatch(handleLikeBlockPost(data));
    }
    // if (value === "like") {
    //   if (likeCount === 0) {
    //     addEmojiLike(id);
    //     setLikeCount((prev) => prev + 1);
    //   } else {
    //     if (!like.includes(id)) {
    //       if (dislike.includes(id) || haha.includes(id) || angry.includes(id)) {
    //         addEmojiLike(id);
    //         removeEmojiAngry(id);
    //         removeEmojiHaha(id);
    //         removeEmojiDislike(id);
    //       } else {
    //         setLikeCount((prev) => prev + 1);
    //         addEmojiLike(id);
    //       }
    //     } else {
    //       removeEmojiLike(id);
    //       setLikeCount((prev) => prev - 1);
    //     }
    //   }
    // } else if (value === "angry") {
    //   if (likeCount === 0) {
    //     addEmojAngry(id);
    //     setLikeCount((prev) => prev + 1);
    //   } else {
    //     if (!angry.includes(id)) {
    //       if (dislike.includes(id) || haha.includes(id) || like.includes(id)) {
    //         addEmojAngry(id);
    //         removeEmojiLike(id);
    //         removeEmojiHaha(id);
    //         removeEmojiDislike(id);
    //       } else {
    //         addEmojAngry(id);
    //         setLikeCount((prev) => prev + 1);
    //       }
    //     } else {
    //       removeEmojiAngry(id);
    //       setLikeCount((prev) => prev - 1);
    //     }
    //   }
    // } else if (value === "haha") {
    //   if (likeCount === 0) {
    //     addEmojHaha(id);
    //     setLikeCount((prev) => prev + 1);
    //   } else {
    //     if (!haha.includes(id)) {
    //       if (dislike.includes(id) || like.includes(id) || angry.includes(id)) {
    //         removeEmojiLike(id);
    //         removeEmojiAngry(id);
    //         addEmojHaha(id);
    //         removeEmojiDislike(id);
    //       } else {
    //         setLikeCount((prev) => prev + 1);
    //         addEmojHaha(id);
    //       }
    //     } else {
    //       removeEmojiHaha(id);
    //       setLikeCount((prev) => prev - 1);
    //     }
    //   }
    // } else if (value === "dislike") {
    //   if (likeCount === 0) {
    //     addEmojiDislike(id);
    //     setLikeCount((prev) => prev + 1);
    //   } else {
    //     if (!dislike.includes(id)) {
    //       if (haha.includes(id) || like.includes(id) || angry.includes(id)) {
    //         removeEmojiLike(id);
    //         removeEmojiAngry(id);
    //         removeEmojiHaha(id);
    //         addEmojiDislike(id);
    //       } else {
    //         setLikeCount((prev) => prev + 1);
    //         addEmojiDislike(id);
    //       }
    //     } else {
    //       removeEmojiDislike(id);
    //       setLikeCount((prev) => prev - 1);
    //     }
    //   }
    // }

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);
    // myHeaders.append("Content-Type", "application/json");

    // var requestOptions = {
    //   method: "PUT",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };

    // const url =
    //   value === "like"
    //     ? `${process.env.REACT_APP_URL_LINK}api/group/post/like/${postId}`
    //     : value === "heart"
    //     ? `${process.env.REACT_APP_URL_LINK}api/group/post/heart/${postId}`
    //     : value === "haha"
    //     ? `${process.env.REACT_APP_URL_LINK}api/group/post/haha/${postId}`
    //     : value === "party"
    //     ? `${process.env.REACT_APP_URL_LINK}api/group/post/party/${postId}`
    //     : value === "dislikes"
    //     ? `${process.env.REACT_APP_URL_LINK}api/group/post/dislikes/${postId}`
    //     : null;

    // console.log(url, query);

    // fetch(url, requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result);
    //     updateGroupPost(result);
    //   })
    //   .catch((error) => console.log("error", error));
  };

  // *** Handle open group post COMMENT modal
  const commentModalHandler = (id) => {
    // alert(id)
    setOpenCommentModal(true);
    setPostId(id);
  };

  // *** Handle show Like list users modal
  const handleLikeListModal = (id) => {
    setShowLikeList(true);
    setPostId(id);
  };

  const handleRepostModal = (id, data) => {
    setRepostModal(true);
    setPostId(id);
    if (postData.p_id === id) {
      setSelectPost(postData);
    }
  };
  // *** Handle repost group post
  const repostHandler = (id) => {
    addToShares(id);
    var axios = require("axios");
    var data = JSON.stringify({
      repostContent: repostContent,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/repost/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data.post);
        addNewPost(response.data.post);
        setRepostModal(false);
        setPinnedPost(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const closeModalImage = () => {
    setModalPreviewImage("");
    setImageUploader("");
  };

  // **** Handle fetching comments...
  const fetchComments = async () => {
    var axios = require("axios");
    if (page === 1) {
      const res = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/group/post/my_comments/${postId}?page=${page}&limit=${limit}&sortedBy=${sortedBy}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/group/post/comments/${postId}?page=${page}&limit=${limit}&sortedBy=${sortedBy}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        ),
      ]);

      const data = res.map((res) => res.data);
      console.log(data);
      setMyComments(data[0]);
      setCommentsData(data[1]);
      setCurrentCmntCount(data[1].length);
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch(
        `${process.env.REACT_APP_URL_LINK}api/group/post/comments/${postId}?page=${page}&limit=${limit}&sortedBy=${sortedBy}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setCurrentCmntCount(result.length);
          if (result.length > 0) {
            setCommentsData((prev) => [...prev, ...result]);
          }
        })
        .catch((error) => console.log("error", error));
    }
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

  // *** Handle sort comment dropdown menu
  const handleDropDownMenu = (val) => {
    // console.log(val)
    setSortedBy(val);
    //  console.log(val)
    //  fetchComments(postId, sortedBy);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `http://localhost:3101/group/full/post/${postId}`
    );
    setSuccess(true);
  };

  React.useEffect(() => {
    if (postId) {
      fetchComments(postId, sortedBy);
    }
  }, [page, postId, sortedBy, updatePost, updateGroupPost]);

  // **** Handle emoji button
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

  const handleOpenEmojis = (id) => {
    setOpenEmojiIcons(true);
    setPostId(id);
  };

  const closeEditImage = () => {
    setEditImage("");
    setEditPrevImage("");
  };

  const editHandleFileChange = (e) => {
    setEditPrevImage(URL.createObjectURL(e.target.files[0]));
    setEditImage(e.target.files[0]);
  };

  const onClose = () => {
    setOpenPinnedModal(false);
    setOpenBookmarkModal(false);
    setOpenDeleteModal(false);
    setOpenHideModal(false);
    setRepostModal(false);
    setSelectPost(null);
    setOpenDonatModal(false);
  };

  const onCloseEditModal = () => {
    setOpenEditModal(false);
    setContent("");
    setPostId("");
  };

  const closeCommentModal = () => {
    setOpenCommentModal(false);
    setOpneLikeModal(false);
  };

  React.useEffect(() => {
    if (!text.trim()) {
      setIsBtnDisable(true);
    } else {
      setIsBtnDisable(false);
    }
  }, [text, prevImage]);

  const addEmoji = (e) => {
    setText((prev) => prev + e.native);
  };

  const handleCommentsubmit = () => {
    setIsBtnLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("cmnt_img", image);
    formdata.append("text", text);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comments/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.notificationData) {
          socket.emit("notification receive", result);
        }
        setCommentsData((prev) => [result.comment.bins, ...prev]);
        setPrevImage("");
        setImage("");
        setText("");
        setIsBtnDisable(true);
        setIsBtnLoading(false);
        setIsVisble(false);
        updateGroupPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const handleDonateModel = (id, data) => {
    setOpenDonatModal(true);
    setPostId(id);
    setPostUserId(data);
  };
  const handleDonateChange = (value) => {
    setDonateValue(value);
  };
  React.useEffect(() => {
    if (donateValue > 0) {
      setDonateBtnVisible(true);
    } else {
      setDonateBtnVisible(false);
    }
  }, [donateValue]);

  const handleDonatPost = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/donate/${postId}?amount=${donateValue}&handleUn=${postUserId}&message=${custommessage}`,
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

  const handleFollow = (userId) => {
    if (following.includes(userId)) {
      removeFollower(userId);
    } else {
      addFollower(userId);
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/follow-following/${userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log("error", error);
        removeFollower(userId);
      });
  };

  const handleOpenLikeEmoji = (id) => {
    setPostId(id);
    setOpenEmojiIcons(true);
  };

  // *** Fetch post like user
  const fetchPostLikeUsers = () => {
    console.log(likeType);
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/like/users/${postId}?type=${likeType}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setUsersList(response.data.post_likes);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleLikeType = (value) => {
    setLikeType(value);
  };

  React.useEffect(() => {
    if (openLikeModal) {
      fetchPostLikeUsers();
    }
  }, [openLikeModal, likeType]);

  const handleFetchLikeUsers = (id) => {
    setOpneLikeModal(true);
    setPostId(id);
  };

  // *** Handle sorting comment
  const handleSortComment = (value) => {
    setSortedBy(value);
    setCommentsData([]);
    // alert(value);
  };

  const closeCmntImage = () => {
    setImage("");
    setPrevImage("");
  };

  return (
    <React.Fragment>
      {!deletePost && (
        <React.Fragment>
          <div className='block_post_card'>
            {/* Open pinned modal */}
            {openPinnedModal && (
              <CustomModal
                onClose={onClose}
                title={t("Pinned post")}
                body={t("Do you want to pinned this post?")}
                footer={
                  <div>
                    <button className='update_btn' onClick={handlePinnedPost}>
                      {isBtnLoading ? (
                        <ImSpinner2 className='spinner' />
                      ) : (
                        <>{pinned ? <>{t("Unpinn")}</> : <>{t("Pinn")}</>}</>
                      )}
                    </button>
                  </div>
                }
              />
            )}

            {/* Open bookmark modal */}
            {openBookmarkModal && (
              <CustomModal
                onClose={onClose}
                title='Bookmark post'
                body='Do you want to bookmark this post?'
                footer={
                  <div>
                    <button className='update_btn' onClick={handleSavePost}>
                      Save
                    </button>
                  </div>
                }
              />
            )}

            {/* Open delete modal */}
            {openDeleteModal && (
              <CustomModal
                onClose={onClose}
                title='Bookmark post'
                body='Do you want to delete this post?'
                footer={
                  <div>
                    <button
                      className='update_btn delete_update_btn'
                      onClick={handleDeletePost}>
                      Delete
                    </button>
                  </div>
                }
              />
            )}

            {/* Open Edit modal */}
            {openEditModal && (
              <CustomModal
                onClose={onCloseEditModal}
                title='Bookmark post'
                body={
                  <div>
                    <textarea
                      type='text'
                      className='modal_textarea'
                      placeholder='Enter your thought'
                      value={content}
                      onChange={(e) => setContent(e.target.value.slice(0, 200))}
                    />
                  </div>
                }
                footer={
                  <div>
                    <button className='update_btn' onClick={handleEdit}>
                      Update
                    </button>
                  </div>
                }
              />
            )}

            {/* Reposted modal */}
            {repostModal && (
              <CustomModal
                title={"Repost"}
                onClose={onClose}
                body={
                  <React.Fragment>
                    <div className='share_link_section'>
                      <span className='link_text'>
                        http://localhost:3101/group/full/post/${postId}
                      </span>
                      <button className='copy_btn' onClick={copyToClipboard}>
                        {success ? <AiTwotoneCopy /> : <AiOutlineCopy />}
                      </button>
                    </div>
                  </React.Fragment>
                }
                footer={<div></div>}
              />
            )}

            {/* Comment modal */}
            {openCommentModal && (
              <CustomPostForm
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
                          {sortedBy === "old" ? (
                            <>Oldest comments</>
                          ) : (
                            <>Comments</>
                          )}
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
                  <div className='comment_modal_body_section'>
                    {(myComments || []).length > 0 && (
                      <>
                        {myComments.map((data) => (
                          <CommentCard key={data.c_id} commentData={data} />
                        ))}
                      </>
                    )}

                    {(commentsData || []).length > 0 ? (
                      <div>
                        {commentsData.map((data) => (
                          <CommentCard key={data.c_id} commentData={data} />
                        ))}
                        {currentCmntCount >= limit && (
                          <div className='load_more_btn_section'>
                            <button
                              className='load_more_btn'
                              onClick={() => setPage((prev) => prev + 1)}>
                              Load more
                            </button>
                          </div>
                        )}
                      </div>
                    ) : null}
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
                          onChange={(e) =>
                            setText(e.target.value.slice(0, 100))
                          }
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
                              onClick={() => handleCommentsubmit()}>
                              <AiOutlineSend
                                className={
                                  isBtnDisable ? "disable" : "not_disable"
                                }
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

            {/* Pinned post */}
            {pinned && (
              <span className='__pinned_icon'>
                <BsFillPinAngleFill />
              </span>
            )}

            {/* Share container */}
            {postData.share_d && (
              <div className='group_post_share_container'>
                <div className='header_user_info'>
                  <img
                    src={postData.share_d.u_img || UserAvatar}
                    className='user_post_avatar'
                  />
                  <span className='user_name'>
                    {postData.share_d.u_fn} {postData.share_d.u_ln}
                  </span>
                  <span className='user_username'>
                    {postData.share_d.u_dun}
                  </span>
                </div>
                <div className='block_post_body'>
                  {postData.share_d.r_content}
                </div>
              </div>
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
                        onClick={(e) => handleLikeType("all")}>
                        All {postData.l_c}
                      </li>

                      <li
                        className={
                          likeType === "likes"
                            ? "modal_list modal_list_active"
                            : "modal_list"
                        }
                        value='like'
                        onClick={(e) => handleLikeType("likes")}>
                        Like
                      </li>

                      <li
                        className={
                          likeType === "haha"
                            ? "modal_list modal_list_active"
                            : "modal_list"
                        }
                        value='haha'
                        onClick={(e) => handleLikeType("haha")}>
                        Haha
                      </li>

                      <li
                        className={
                          likeType === "angry"
                            ? "modal_list modal_list_active"
                            : "modal_list"
                        }
                        value='angry'
                        onClick={(e) => handleLikeType("angry")}>
                        Angry
                      </li>

                      <li
                        className={
                          likeType === "dislikes"
                            ? "modal_list modal_list_active"
                            : "modal_list"
                        }
                        value='dislikes'
                        onClick={(e) => handleLikeType("dislikes")}>
                        Dislikes
                      </li>
                    </div>
                    <div className='user_modal_section'>
                      {(usersList || []).length > 0 ? (
                        <div className='__modal_user_list_container'>
                          {usersList.map((data) => (
                            <div
                              className='__user_modal_card'
                              onClick={() => redirectToProfile(data.handleUn)}>
                              <img
                                src={data.p_i || UserAvatar}
                                alt=''
                                srcset=''
                                className='modal_profile_avatar'
                              />
                              <span className='modal_user_name'>
                                {data.fn} {data.ln}
                              </span>
                              <span className='modal_user_username'>
                                @{data.handleUn}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className='empty_user_modal_list'>
                          No user found
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            )}

            {/* Post Header component */}
            <div className='block_post_header'>
              <div className='header_user_info'>
                <img
                  src={
                    postData.u_img
                      ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${postData.u_img}`
                      : UserAvatar
                  }
                  className='user_post_avatar'
                />
                <div className='block_post_user'>
                  <span className='user_name'>
                    {postData.u_fn} {postData.u_ln}
                  </span>
                  <span className='user_username'>{postData.u_dun}</span>
                  <span className='creator_time'>
                    {timeDifference(
                      new Date().getTime(),
                      Number(postData.timestamp)
                    )}
                  </span>
                  <div>
                    {postData.u_dun === groupData.g_c_dun ? (
                      <span className='group_admin'>Admin</span>
                    ) : (
                      <>
                        {groupData.g_mem.includes(postData.u_dun) ? (
                          <span className='group_members'>Member</span>
                        ) : null}
                      </>
                    )}

                    {postData.u_dun !== user.handleUn && (
                      <button
                        className='post_card_flw_btn'
                        onClick={() => handleFollow(postData.u_dun)}>
                        {following.includes(postData.u_dun) ? (
                          <>Followed</>
                        ) : (
                          <>Following</>
                        )}
                      </button>
                    )}

                    {postData.userLocation && (
                      <span className='card_userLocation'>
                        {postData.userLocation}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!postData.is_share && (
                <Menu
                  menuButton={
                    <MenuButton className={"__menu_btn"}>
                      <FiMoreHorizontal />
                    </MenuButton>
                  }>
                  {/* Pinned post */}
                  {user.handleUn === groupData.g_c_dun && (
                    <MenuItem
                      className={"block_post_menuItem"}
                      onClick={() => handlePinnedModa(postData.p_id)}>
                      <span className='block_dropdown_icon'>
                        <VscPinned />
                      </span>
                      {pinned ? <>{t("Uninned")}</> : <>{t("Pinned")}</>}
                    </MenuItem>
                  )}

                  {/* Delete post */}
                  {groupData.g_c_dun === user.handleUn && (
                    <MenuItem
                      className={"block_post_menuItem"}
                      onClick={() => deleteModalHandler(postData.p_id)}>
                      <span className='block_dropdown_icon'>
                        <BsTrash />
                      </span>
                      Delete
                    </MenuItem>
                  )}

                  <MenuItem
                    className={"block_post_menuItem"}
                    onClick={() => handleRepostModal(postData.p_id)}>
                    <span className='block_dropdown_icon'>
                      <AiOutlineShareAlt />
                    </span>
                    {t("Share")}
                  </MenuItem>

                  {/* Edit post */}
                  {postData.u_id === user.u_id && (
                    <MenuItem
                      className={"block_post_menuItem"}
                      onClick={() => handleEditModal(postData.p_id, postData)}>
                      <span className='block_dropdown_icon'>
                        <AiOutlineEdit />
                      </span>
                      {t("Edit")}
                    </MenuItem>
                  )}
                </Menu>
              )}
            </div>

            {/* Post body component */}
            <div
              className='block_post_body'
              onClick={() => navigate(`/group/full/post/${postData.p_id}`)}>
              <span className='block_post_content'>{postContent}</span>
              {postData.image && (
                <img
                  src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${postData.image}`}
                  className='block_post_image'
                />
              )}
            </div>

            <div className='post_footer_count_section'>
              <button
                id='like_user'
                className='like_post_count'
                onClick={() => handleFetchLikeUsers(postData.p_id)}>
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
            </div>

            {/* Post footer component */}
            <div className='block_post_footer'>
              {openEmojiIcons && (
                <div className='block_emoji_like' ref={wrapperRef}>
                  <EmojiLike
                    id={postId}
                    setQuery={setQuery}
                    clickHandler={likePost}
                  />
                </div>
              )}
              {/* Like button */}
              {/* <button
                  className='group_post_footer_btn group_post_like'
                  onClick={() => handleCommentModal(postData.p_id)}> */}
              <button
                id='like'
                className='post_footer_btn post_like'
                onClick={() => handleOpenLikeEmoji(postData.p_id)}>
                {like.includes(postData.p_id) ? (
                  <AiFillHeart
                    id='like'
                    className='post_like_active like_icon'
                  />
                ) : (
                  <>
                    {dislike.includes(postData.p_id) ? (
                      <AiFillDislike
                        id='like'
                        className='post_like_active dislike_icon'
                      />
                    ) : (
                      <>
                        {haha.includes(postData.p_id) ? (
                          <BsEmojiLaughingFill
                            id='like'
                            className='post_like_active funny_icon'
                          />
                        ) : (
                          <>
                            {angry.includes(postData.p_id) ? (
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
                {like.includes(postData.p_id) ? (
                  <span className='like_count_text' id='like'>
                    You react on this post
                  </span>
                ) : (
                  <>
                    {dislike.includes(postData.p_id) ? (
                      <span className='like_count_text' id='like'>
                        You react on this post
                      </span>
                    ) : (
                      <>
                        {haha.includes(postData.p_id) ? (
                          <span className='like_count_text' id='like'>
                            You react on this post
                          </span>
                        ) : (
                          <>
                            {angry.includes(postData.p_id) ? (
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

              {/* Commemnt button */}
              <button
                className={"group_post_footer_btn "}
                // onClick={() => handleCommentContainer(postData.p_id)}
                onClick={() => commentModalHandler(postData.p_id)}>
                <BiComment />
              </button>

              {/* Spam button */}
              <button
                className={"group_post_footer_btn group_post_spam"}
                onClick={() => postSpamHandler(postData.p_id)}>
                {(spamList || []).length > 0 ? (
                  <>
                    {spamList.includes(postData.p_id) ? (
                      <RiSpam2Fill className='spam_icon' />
                    ) : (
                      <RiSpam2Line />
                    )}
                  </>
                ) : (
                  <RiSpam2Line />
                )}
              </button>

              {/* Donate button */}
              <button
                className={"group_post_footer_btn"}
                onClick={() =>
                  handleDonateModel(postData.p_id, postData.u_dun)
                }>
                <AiOutlineStar className={"repost_icon"} />
              </button>
            </div>

            {/* Post footer links */}
            <div className='post_footer_link'>
              {/* Like */}
              <div className='footer_text'>
                {t("Likes")}: {likeCount}
              </div>

              {/* Comment */}
              <div
                className='footer_text'
                onClick={() => handleCommentModal(postData.p_id)}>
                {t("Comments")}: {postData.c_c}
              </div>

              {/* Spam count */}
              <div
                className='footer_text'
                onClick={() => postSpamHandler(postData.p_id)}>
                {t("Spam")}: {spamCount}
              </div>

              {/* Share count */}
              <div className='footer_text'>{t("Donate")}</div>
            </div>
          </div>
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
  updatePost: state.group.updatePost,
  groupData: state.group.groupData,
  following: state.user.following,

  like: state.user.emoji_likes,
  angry: state.user.emoji_angry,
  heart: state.user.emoji_heart,
  haha: state.user.emoji_haha,
  party: state.user.emoji_party,
  dislike: state.user.emoji_dislikes,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  updatePost: (post) => dispatch(updatePost(post)),
  deletePost: (post) => dispatch(deletePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addToLikeArray: (post) => dispatch(addToLike(post)),
  removeToLike: (post) => dispatch(removeToLike(post)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  removeToSpam: (post) => dispatch(removeToSpam(post)),
  removeToShares: (post) => dispatch(removeToShares(post)),
  addToShares: (post) => dispatch(addToShares(post)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
  setUpdateGroup: (data) => dispatch(setUpdateGroup(data)),
  addGroupPostSpam: (data) => dispatch(addGroupPostSpam(data)),
  addNewPost: (data) => dispatch(addNewPost(data)),
  addFollower: (data) => dispatch(addFollower(data)),
  removeFollower: (data) => dispatch(removeFollower(data)),

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
  addEmojAngry: (data) => dispatch(addEmojAngry(data)),
  removeEmojiAngry: (data) => dispatch(removeEmojiAngry(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupPost);
