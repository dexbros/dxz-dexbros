/** @format */

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import timeDifference from "../../utils/getCreateTime";
import { FiMoreHorizontal } from "react-icons/fi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { SiGoogleanalytics } from "react-icons/si";
import {
  AiOutlineEdit,
  AiOutlineCopy,
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
  AiOutlineRetweet,
  AiOutlineCamera,
  AiOutlineClose,
} from "react-icons/ai";
import { VscPinned } from "react-icons/vsc";
import { BsTrash } from "react-icons/bs";
import { BiComment } from "react-icons/bi";
import { connect } from "react-redux";
import "./GroupPost.css";
import { userLogin } from "../../redux/user/user.actions";
import { GrClose } from "react-icons/gr";
import CommentCard from "../Group.Post.Comment/CommentCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineReportProblem, MdHideSource } from "react-icons/md";
import intToString from "../../utils/PostCount";
import MyModal from "../modal/MyModal";
import Tooltip from "../Tooltip/Tooltip";
import { updatePost, setNewPinnedPost } from "../../redux/post/post.actions";
import { VscPinnedDirty } from "react-icons/vsc";
import { AiOutlineFileGif } from "react-icons/ai";
import GifModal from "../modal/GifModal";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { BsEmojiLaughing } from "react-icons/bs";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import ProgressBar from "../progress-bar.component/ProgressBar";
import getTotalVote from "../../utils/CountTotalVote";
import { GrGallery } from "react-icons/gr";
import GroupLikeButton from "../LikeButton/GroupLike";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { useInView } from "react-intersection-observer";
import GroupRepostModl from "../modal/GroupRepostModal";

var viewsArr = [];
const maxCommentLength = 150;

const GroupPost = ({ postData, token, user, group, setPinnedPost }) => {
  const myRef = useRef(null);
  // console.log(postData)

  // var data = ["spam", "bully", "mis-information"]

  const [editModal, setEditModal] = useState(false);
  const [postId, setPostId] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [prev_img, setPrev_img] = useState("");
  const [show, setShow] = useState(false);
  const [pinnedModal, setPinnedModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [commentShow, setCommentShow] = useState(false);
  const [message, setMessage] = useState("");
  const [commentImgPrev, setCommentImgPrev] = useState("");
  const [img, setImg] = useState("");
  const [openHideModal, setOpenHideModal] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [openGifModal, setOpenGifModal] = useState(false);
  const [gif, setGif] = useState("");
  const [uploadImage, setUploadImage] = useState("");
  const [openGif, setOpenGif] = useState(false);

  const [cureectContent, setCurrentContent] = useState("");
  // const [newContent, setNewContent] = useState("");

  const [currentLink, setCurrentLink] = useState("");

  const [currentGif, setCurrentGif] = useState("");
  const [newGif, setNewGif] = useState("");
  const [modalGif, setModalGif] = useState("");

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const [openCommentGif, setCommentOpenGif] = useState(false);
  const [openCommentEmoji, setOpenCommentEmoji] = useState(false);
  const [prevCommentImg, setPrevCommentImg] = useState("");
  const [commentGif, setCommentGif] = useState("");
  const [commentEmoji, setCommentEmoji] = useState(false);
  const [commentMsg, setCommentMsg] = useState("");
  const [commentIsDisable, setCommentIsDisable] = useState(true);
  const [groupPostId, setGroupPostId] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const [openRepostModal, setOpenRepostModal] = useState(false);
  const [openRepostModalWithQuote, setRepostModalWithQuote] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [text, setText] = useState("");

  const total_vote = getTotalVote(
    postData.option1_vote.length,
    postData.option2_vote.length
  );
  const [hideContent, setHideContent] = useState(false);

  const [commentWordLength, setCommentWordLength] = useState(0);
  const [isBtnDisable, setIsBtnDisable] = useState(true);
  const [isVisble, setIsVisible] = useState(false);

  // console.log(token);
  const modalFileHanlder = (e) => {
    setUploadImage(URL.createObjectURL(e.target.files[0]));
    setNewImage(e.target.files[0]);
  };
  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:5000/report", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result[0].message)
        setReports(result[0].message);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const containerRef = useRef();

  const hideModalHandler = (id) => {
    setOpenHideModal(true);
    setPostId(id);
  };

  const reportModalHandler = (id) => {
    setOpenReportModal(true);
    setPostId(id);
  };

  useEffect(() => {
    if (!commentMsg.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [commentMsg]);

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(
      `http://localhost:3000/group/post/${postData._id}`
    );
  };

  const pinnedPostModalHandler = (id) => {
    setPostId(id);
    setPinnedModal(true);
  };

  // POST LIKE HANDLER
  const postLikeHandler = (postid) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group/post/like/" + postid, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  // POST DISLIKE HANDLER
  const postDislikeHandler = (postId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "http://localhost:5000/api/group/post/dislike/" + postId,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const handleRepost = (id) => {
    setPostId(id);
    setOpenRepostModal(true);
  };

  // POST RETWEET HANDLER
  const postRepostHandler = (postId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "http://localhost:5000/api/group/post/repost/" + postId,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setEditModal(false);
        setPostId("");
        setPinnedPost(result);
        setOpenRepostModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  const EditModalHandler = (id) => {
    setEditModal(true);
    if (postData._id === id) {
      setContent(postData.content);
      setCurrentImage(postData.image);
      setCurrentGif(postData.gif);
      setCurrentLink(postData.url);
      setPostId(id);
    }
  };
  const handleFileChange = (e) => {
    setPrev_img(URL.createObjectURL(e.target.files[0]));
    console.log(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
    setShow(true);
  };

  // POST EDIT HANDLER
  const editPostHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", newGif);
    formdata.append("content", content);
    formdata.append("gif", newGif);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group/post/edit/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  // POST PINNED HANDLER
  const postPinnedHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      content: "Again Changing this post",
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group/post/pinned/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedModal(false);
        setPostId("");
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  // Post Unpinned handler
  const postUnpinnedHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      content: "Again Changing this post",
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group/post/unpinned/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedModal(false);
        setPostId("");
        setNewPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const deleteModalHandler = (id) => {
    setDeleteModal(true);
    setPostId(id);
  };

  const deletePostHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch("http://localhost:5000/api/group/post/delete/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setDeleteModal(false);
        setPostId("");
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const showCommentContainer = (id) => {
    setCommentShow((prev) => !prev);
    setGroupPostId(id);
  };

  const handleCommentImage = (e) => {
    console.log(e.target.files);
    setPrevCommentImg(URL.createObjectURL(e.target.files[0]));
    setImg(e.target.files[0]);
  };
  const closeImgPrev = () => {
    setCommentImgPrev("");
    setImg("");
  };

  const postComment = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("message", commentMsg);
    formdata.append("img", img);
    formdata.append("gif", commentGif);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group/post/comments/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // toast.error(result.msg);
        setCommentImgPrev("");
        setCommentEmoji(false);
        setCommentGif("");
        setCommentMsg("");
      })
      .catch((error) => console.log("error", error));
  };

  const hideHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group/post/hide/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenHideModal(false);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };
  const reportPostHandler = (id, list) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      list: list,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group/post/report/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenReportModal(false);
        toast("Your report has been submitted");
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const addEmoji = (e) => {
    setContent((prev) => prev + e.native);
    setCommentMsg((prev) => prev + e.native);
  };

  const submitVote = (postId, vote) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/group/post/poll/vote/${postId}?vote=${vote}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  const closePreviewImage = () => {
    setPrevCommentImg("");
    setCommentGif("");
  };

  const handleSubmitLike = (value) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:5000/api/group/post/like-emoji/${postData._id}?type=${value}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const postSapmButton = (id) => {
    alert(id);
  };

  const handleRemoveLike = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "http://localhost:5000/api/group/post/like/" + postData._id,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  // Bookmark  modal handler
  const bookmarkModalHabdler = (id) => {
    setOpenBookmarkModal((prev) => !prev);
    setPostId(id);
  };

  // Handle Bookmark post
  const handleBookmarkPost = (postId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "http://localhost:5000/api/group/post/bookmark/" + postId,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
        setOpenBookmarkModal((prev) => !prev);
      })
      .catch((error) => console.log("error", error));
  };

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    if (inView && postData.author._id !== user._id) {
      viewsArr.push(containerRef.current.id);
      localStorage.setItem("group_views_count", JSON.stringify(viewsArr));
      console.log(containerRef.current.id);
    }
  }, [inView]);

  useEffect(() => {
    if (performance.navigation.type === 1) {
      if (JSON.parse(localStorage.getItem("group_views_count"))) {
        var axios = require("axios");
        var data = JSON.stringify({
          views: localStorage.getItem("group_views_count"),
        });

        var config = {
          method: "put",
          url: "http://localhost:5000/api/group/post/views",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } else {
      console.log("This page is not reloaded");
    }
  }, []);

  const handleRepostPost = (id) => {
    setPostId(id);
    setOpenRepostModal(true);
  };

  const handleRepostWithQuote = (id) => {
    // alert(id)
    if (postData._id === id) {
      setSelectedPost(postData);
      setPostId(id);
      setRepostModalWithQuote(true);
    }
  };

  const handleRepostWithQuoteHandler = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      text: "Reposted",
    });

    var config = {
      method: "post",
      url: "http://localhost:5000/api/group/post/repost/quote/" + postId,
      headers: {
        Authorization: "Berar " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCommentInut = (e) => {
    setCommentMsg(e.target.value);
    setCommentWordLength(e.target.value.length);
  };

  useEffect(() => {
    if (commentMsg.length > 150) {
      setIsVisible(true);
      setIsBtnDisable(true);
    }
    if (commentMsg.length < 150 && commentMsg.length > 0) {
      setIsVisible(false);
      setIsBtnDisable(false);
    } else {
      setIsBtnDisable(true);
    }
  }, [commentMsg]);

  return (
    <div>
      {group && (
        <div ref={ref}>
          {openCommentGif && (
            <GifModal
              onClose={setCommentOpenGif}
              setImagePreview={setPrevCommentImg}
              setGif={setCommentGif}
            />
          )}
          {postData.hide.includes(user._id) ? (
            <div className='hide_handler'>
              Unhide post{" "}
              <button
                className='unhide_btn'
                onClick={() => hideHandler(postData._id)}>
                Unhide
              </button>
            </div>
          ) : (
            <div
              className={
                postData.isPoll
                  ? "group_postContainer poll"
                  : "group_postContainer"
              }>
              {postData.isShared && (
                <div className='shared_container'>
                  <div className='shared_container_header'>
                    <img
                      src={postData.shared_by.profilePic}
                      className='group_shared_user_img'
                    />
                    <Link
                      to={`/user/profile/${postData.shared_by.handleUn}`}
                      className='group_shared_profile_name'>
                      {postData.shared_by.displayFirstName
                        ? postData.shared_by.displayFirstName
                        : postData.shared_by.firstName}{" "}
                      {postData.shared_by.displayLastName
                        ? postData.shared_by.displayLastName
                        : postData.shared_by.lastName}
                    </Link>
                    <span className='shared_group_postCard_profile_username'>
                      @
                      {postData.shared_by.handleUn
                        ? postData.shared_by.handleUn
                        : postData.shared_by.username}
                    </span>
                    <span className='shared_group_postCard_time'>
                      {timeDifference(new Date(), new Date(postData.createdAt))}
                    </span>
                    <Menu
                      menuButton={
                        <MenuButton className={"menu_btn"}>
                          <FiMoreHorizontal />
                        </MenuButton>
                      }>
                      <Link to={`/group/post/analytics/${postData._id}`}>
                        {/* Analytics of group post */}
                        {group.creator._id === user._id && (
                          <MenuItem className={"menuitem"}>
                            <span className='dropdown_icon'>
                              <SiGoogleanalytics />
                            </span>
                            Analytics
                          </MenuItem>
                        )}
                      </Link>

                      {/* Pinned Unpinned of group post */}
                      {group.creator._id === user._id && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => pinnedPostModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <VscPinned />
                          </span>
                          {postData.pinned ? <>Uninned</> : <>Pinned</>}
                        </MenuItem>
                      )}
                      {postData.shared_by._id === user._id && (
                        <>
                          {!postData.isPoll && (
                            <MenuItem
                              className={"menuitem"}
                              onClick={() => EditModalHandler(postData._id)}>
                              <span className='dropdown_icon'>
                                <AiOutlineEdit />
                              </span>
                              Edit
                            </MenuItem>
                          )}
                        </>
                      )}
                      <MenuItem
                        className={"menuitem"}
                        onClick={() => copyToClipboard()}>
                        <span className='dropdown_icon'>
                          <AiOutlineCopy />
                        </span>
                        Copy post link
                      </MenuItem>

                      {/* Bookmark */}
                      <MenuItem
                        className={"menuitem"}
                        onClick={() => bookmarkModalHabdler(postData._id)}>
                        {postData.bookmark.includes(user._id) ? (
                          <>
                            <span className='dropdown_icon'>
                              <BsFillBookmarkFill />
                            </span>
                            Remove
                          </>
                        ) : (
                          <>
                            <span className='dropdown_icon'>
                              <BsBookmark />
                            </span>
                            Bookmark
                          </>
                        )}
                      </MenuItem>

                      {group.creator._id === user._id && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => deleteModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <BsTrash />
                          </span>
                          Delete
                        </MenuItem>
                      )}
                      {!group.banned_user.includes(user._id) && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => hideModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <MdHideSource />
                          </span>
                          Hide
                        </MenuItem>
                      )}
                      {!group.banned_user.includes(user._id) && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => reportModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <MdOutlineReportProblem />
                          </span>
                          Report
                        </MenuItem>
                      )}

                      <MenuItem
                        className={"menuitem"}
                        onClick={() => reportModalHandler(postData._id)}>
                        <span className='dropdown_icon'>
                          <MdOutlineReportProblem />
                        </span>
                        View original post
                      </MenuItem>
                    </Menu>
                  </div>

                  <div className='shared_content'>
                    {postData.shared_content}
                  </div>
                </div>
              )}

              {/* Repost a post with quote */}
              {openRepostModalWithQuote && (
                <GroupRepostModl
                  title={"Repost"}
                  setIsClose={setRepostModalWithQuote}
                  btnText='Share'
                  selectedPost={selectedPost}
                  handleRepostWithQuoteHandler={handleRepostWithQuoteHandler}
                  text={text}
                  setText={setText}
                />
              )}
              {/* PINNED POST MESSAGE */}
              {postData.pinned && (
                <span className='pinned_msg'>Group admin pinned this post</span>
              )}
              {/* Pinned modal */}
              {pinnedModal && (
                <MyModal
                  title={postData.pinned ? "Unpinned Post" : "Pinned Post"}
                  body={
                    postData.pinned
                      ? "Do you want to unpinned this post?"
                      : "Do you want to pinned this post?"
                  }
                  setIsClose={setPinnedModal}
                  postId={postId}
                  btnText={postData.pinned ? "Unpinned" : "Pinned"}
                  clickHandler={
                    postData.pinned ? postUnpinnedHandler : postPinnedHandler
                  }
                />
              )}
              {/* Delete modal */}
              {deleteModal && (
                <MyModal
                  title={"Delete Post"}
                  body={"Do you want to delete this post?"}
                  setIsClose={setDeleteModal}
                  postId={postId}
                  btnText={"Delete"}
                  clickHandler={deletePostHandler}
                />
              )}

              {/* Hide modal */}
              {openHideModal && (
                <MyModal
                  title={"Hide Post"}
                  body={"Do you want to hid this post?"}
                  setIsClose={setOpenHideModal}
                  postId={postId}
                  btnText={"Hide"}
                  clickHandler={hideHandler}
                />
              )}

              {/* Repost Modal */}
              {openRepostModal && (
                <MyModal
                  title={
                    postData.share_post.includes(user._id)
                      ? "Disassemble post"
                      : "Repost Post"
                  }
                  body={
                    postData.share_post.includes(user._id)
                      ? "Do you want to disassemble this post?"
                      : "Do you want to repost this post?"
                  }
                  setIsClose={setOpenRepostModal}
                  postId={postId}
                  btnText={"Repost"}
                  clickHandler={postRepostHandler}
                />
              )}

              {/* Edit Modal */}
              {editModal && (
                <>
                  {!openGif ? (
                    <>
                      <MyModal
                        title='Edit post'
                        body={
                          <div>
                            <textarea
                              type='text'
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              className='modal_textarea_form'></textarea>

                            <div>
                              <label htmlFor='modal_image'>
                                <AiOutlineCamera className='__cam_icon' />
                              </label>
                              <input
                                type='file'
                                id='modal_image'
                                className='input_file'
                                onChange={(e) => modalFileHanlder(e)}
                              />
                              <button
                                className='gif_icon_btn'
                                onClick={() => setOpenGif(true)}>
                                <AiOutlineFileGif className='gif_icon' />
                              </button>
                              <button
                                className='gif_icon_btn'
                                onClick={() => setShowEmoji((prev) => !prev)}>
                                <BsEmojiLaughing />
                              </button>
                            </div>
                            {showEmoji && (
                              <EmojiPicker onEmojiSelect={(e) => addEmoji(e)} />
                            )}

                            {/* Preview Images */}
                            {/* GIF PREVIEW */}
                            <div>
                              {currentGif && (
                                <div
                                  className='preview_container'
                                  onClick={() => setCurrentGif("")}>
                                  <img
                                    src={currentGif}
                                    className='preview_content_modal'
                                  />
                                  <button className='modal_preview_cloase_btn'>
                                    <GrClose />
                                  </button>
                                </div>
                              )}
                              {newGif && (
                                <div
                                  className='preview_container'
                                  onClick={() => setNewGif("")}>
                                  <img
                                    src={newGif}
                                    className='preview_content_modal'
                                  />
                                  <button className='modal_preview_cloase_btn'>
                                    <GrClose />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* IMAGE PREVIEW */}
                            <div>
                              {currentImage && (
                                <div
                                  className='preview_container'
                                  onClick={() => setCurrentImage("")}>
                                  <img
                                    src={setCurrentImage}
                                    className='preview_content_modal'
                                  />
                                  <button className='modal_preview_cloase_btn'>
                                    <GrClose />
                                  </button>
                                </div>
                              )}
                              {newImage && (
                                <div
                                  className='preview_container'
                                  onClick={() => setNewImage("")}>
                                  <img
                                    src={uploadImage}
                                    className='preview_content_modal'
                                  />
                                  <button className='modal_preview_cloase_btn'>
                                    <GrClose />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* URL Content */}
                            <div>
                              {currentLink && (
                                <div
                                  className='preview_container'
                                  onClick={() => {
                                    setCurrentLink("");
                                    // setNewUrl("")
                                  }}>
                                  <LinkPreview
                                    url={currentLink}
                                    height='270px'
                                    description='null'
                                  />
                                  <button className='modal_preview_cloase_btn'>
                                    <GrClose />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                        clickHandler={editPostHandler}
                        setIsClose={setEditModal}
                        btnText='Edit'
                        postId={postId}
                      />
                    </>
                  ) : (
                    <GifModal
                      onClose={setOpenGif}
                      setImagePreview={setNewGif}
                      setGif={setNewGif}
                    />
                  )}
                </>
              )}

              {/* Bookmark modal */}
              {openBookmarkModal && (
                <MyModal
                  title={
                    postData.bookmark.includes(user._id)
                      ? "Remove post"
                      : "Save post"
                  }
                  body={
                    postData.bookmark.includes(user._id)
                      ? "Do you want to remove this post?"
                      : "Do you want to bookmark this post?"
                  }
                  setIsClose={setOpenBookmarkModal}
                  postId={postId}
                  btnText={
                    postData.bookmark.includes(user._id) ? "Remove" : "Save"
                  }
                  clickHandler={handleBookmarkPost}
                />
              )}

              <div id={postData._id} ref={containerRef}>
                {/* GROUP POST HEADER */}
                <div className='group_postContainer_header'>
                  <div className='group_postContainer_header'>
                    <img
                      src={postData.author.profilePic}
                      className='group_postCard_profile_image'
                    />
                    <Tooltip content='Visit Profile' direction='bottom'>
                      <Link
                        to={`/user/profile/${postData.author.handleUn}`}
                        className='group_postCard_profile_name'>
                        {postData.author.displayFirstName
                          ? postData.author.displayFirstName
                          : postData.author.firstName}{" "}
                        {postData.author.displayLastName
                          ? postData.author.displayLastName
                          : postData.author.lastName}
                      </Link>
                    </Tooltip>
                    <span className='group_postCard_profile_username'>
                      @
                      {postData.author.handleUn
                        ? postData.author.handleUn
                        : postData.author.username}
                    </span>
                    <span className='group_postCard_time'>
                      {timeDifference(new Date(), new Date(postData.createdAt))}
                    </span>
                  </div>
                  {!postData.isShared && (
                    <Menu
                      menuButton={
                        <MenuButton className={"menu_btn"}>
                          <FiMoreHorizontal />
                        </MenuButton>
                      }>
                      <Link to={`/group/post/analytics/${postData._id}`}>
                        {/* Analytics of group post */}
                        {group.creator._id === user._id && (
                          <MenuItem className={"menuitem"}>
                            <span className='dropdown_icon'>
                              <SiGoogleanalytics />
                            </span>
                            Analytics
                          </MenuItem>
                        )}
                      </Link>

                      {/* Pinned Unpinned of group post */}
                      {group.creator._id === user._id && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => pinnedPostModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <VscPinned />
                          </span>
                          {postData.pinned ? <>Uninned</> : <>Pinned</>}
                        </MenuItem>
                      )}
                      {postData.author._id === user._id && (
                        <>
                          {!postData.isPoll && (
                            <MenuItem
                              className={"menuitem"}
                              onClick={() => EditModalHandler(postData._id)}>
                              <span className='dropdown_icon'>
                                <AiOutlineEdit />
                              </span>
                              Edit
                            </MenuItem>
                          )}
                        </>
                      )}
                      <MenuItem
                        className={"menuitem"}
                        onClick={() => copyToClipboard()}>
                        <span className='dropdown_icon'>
                          <AiOutlineCopy />
                        </span>
                        Copy post link
                      </MenuItem>

                      {/* Bookmark */}
                      <MenuItem
                        className={"menuitem"}
                        onClick={() => bookmarkModalHabdler(postData._id)}>
                        {postData.bookmark.includes(user._id) ? (
                          <>
                            <span className='dropdown_icon'>
                              <BsFillBookmarkFill />
                            </span>
                            Remove
                          </>
                        ) : (
                          <>
                            <span className='dropdown_icon'>
                              <BsBookmark />
                            </span>
                            Bookmark
                          </>
                        )}
                      </MenuItem>

                      {group.creator._id === user._id && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => deleteModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <BsTrash />
                          </span>
                          Delete
                        </MenuItem>
                      )}
                      {!group.banned_user.includes(user._id) && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => hideModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <MdHideSource />
                          </span>
                          Hide
                        </MenuItem>
                      )}
                      {!group.banned_user.includes(user._id) && (
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => reportModalHandler(postData._id)}>
                          <span className='dropdown_icon'>
                            <MdOutlineReportProblem />
                          </span>
                          Report
                        </MenuItem>
                      )}
                    </Menu>
                  )}
                </div>

                {/* GROUP POST BODY */}
                {!postData.isPoll ? (
                  <div className='group_postContainer_container'>
                    <div className='content'>
                      {postData.content.length > 110 ? (
                        <>
                          {!hideContent ? (
                            <>
                              {postData.content.slice(0, 110)}...
                              <button
                                onClick={() => setHideContent((prev) => !prev)}
                                className='react_more'>
                                more
                              </button>
                            </>
                          ) : (
                            <>
                              {postData.content}...
                              <button
                                onClick={() => setHideContent((prev) => !prev)}
                                className='react_more'>
                                Less
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <>{postData.content}</>
                      )}
                    </div>
                    {postData.url !== "" ? (
                      <div className='linkPreview'>
                        <LinkPreview
                          url={postData.url}
                          height='270px'
                          description='null'
                        />
                      </div>
                    ) : null}

                    {postData.image && (
                      <div className='post_card_image_container'>
                        <img src={postData.image} className='post_card_image' />
                      </div>
                    )}

                    {postData.gif && (
                      <div className='post_card_image_container'>
                        <img src={postData.gif} className='post_card_image' />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='group_postContainer_container'>
                    <div className='content'>{postData.question}</div>
                    {postData.url !== "" ? (
                      <div className='linkPreview'>
                        <LinkPreview
                          url={postData.url}
                          height='270px'
                          description='null'
                        />
                      </div>
                    ) : null}
                    <div className='group_poll_option_container'>
                      {postData.option1_vote.includes(user._id) ||
                      postData.option2_vote.includes(user._id) ? (
                        <div className='group_poll_option_box'>
                          <div>
                            <ProgressBar
                              total_vote={total_vote}
                              vote={postData.option1_vote.length}
                              title={postData.option1}
                            />
                          </div>
                          <div>
                            <ProgressBar
                              total_vote={total_vote}
                              vote={postData.option2_vote.length}
                              title={postData.option2}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='group_poll_option_box'>
                          <button
                            className='group_option_btn'
                            onClick={() => submitVote(postData._id, "one")}>
                            {postData.option1}
                          </button>
                          <br />
                          <button
                            className='group_option_btn'
                            onClick={() => submitVote(postData._id, "two")}>
                            {postData.option2}
                          </button>
                        </div>
                      )}
                    </div>
                    <span className='total_vote'>
                      Total vote: {total_vote}{" "}
                    </span>
                  </div>
                )}

                {/* POST CARD FOOTER */}
                {!group.banned_user.includes(user._id) && (
                  <div className='post_card_footer'>
                    {/* Like */}
                    <Tooltip content='Like' direction='bottom'>
                      <GroupLikeButton
                        btnClicked={btnClicked}
                        setBtnClicked={setBtnClicked}
                        handleSubmitLike={handleSubmitLike}
                        postData={postData}
                        user={user}
                        handleRemoveLike={handleRemoveLike}
                      />
                    </Tooltip>

                    {/* COMMENT */}
                    <Tooltip content={"Comment"} direction='bottom'>
                      <button
                        className={"post_card_footer_btn"}
                        onClick={() => showCommentContainer(postData._id)}>
                        <BiComment />
                      </button>
                    </Tooltip>

                    {/* REPOST */}
                    <Tooltip content='Repost' direction='bottom'>
                      <Menu
                        menuButton={
                          <MenuButton className='post_repost_btn'>
                            <AiOutlineRetweet className='repost_icon' />
                          </MenuButton>
                        }>
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => handleRepostPost(postData._id)}>
                          Repost
                        </MenuItem>
                        <MenuItem
                          className={"menuitem"}
                          onClick={() => handleRepostWithQuote(postData._id)}>
                          Repost with quote
                        </MenuItem>
                      </Menu>
                    </Tooltip>

                    {/* Spam */}
                    <Tooltip content={"Spam"} direction='bottom'>
                      <button
                        className={"post_card_footer_btn"}
                        onClick={() => postSapmButton(postData._id)}>
                        {postData.spam.includes(user._id) ? (
                          <RiSpam2Fill className='spam_icon' />
                        ) : (
                          <RiSpam2Line />
                        )}
                      </button>
                    </Tooltip>

                    <ToastContainer />
                  </div>
                )}

                {/* POST CARD FOOTER */}
                {!group.banned_user.includes(user._id) && (
                  <div className='post_card_footer_link'>
                    {/* Like */}
                    <Link to={`/group/post/like/${postData._id}`}>
                      Likes:{" "}
                      {intToString(
                        postData.reactions.emoji.length +
                          postData.reactions.angel.length +
                          postData.reactions.angry.length +
                          postData.reactions.crying.length +
                          postData.reactions.like.length +
                          postData.reactions.party.length +
                          postData.reactions.wow.length
                      ) || "0"}
                    </Link>

                    {/* Comment Post */}
                    <span>
                      Comment: {intToString(postData.comment.length) || "0"}
                    </span>

                    {/* Share Post */}
                    <span>
                      Repost: {intToString(postData.share_post.length) || "0"}
                    </span>

                    {/* Spam Post */}
                    <span>
                      Spam: {intToString(postData.spam.length) || "0"}
                    </span>
                  </div>
                )}

                {/* Group post comment section */}
                {commentShow && (
                  <div className='comment_section'>
                    {/* COMMENT SECTION HEADER */}
                    <div>
                      <span className='word_count'>
                        {commentWordLength}/{maxCommentLength}
                      </span>
                      <span className='error_msg'>
                        You cannot put more than 150 characters
                      </span>
                    </div>
                    <div className='comment_section_header'>
                      <input
                        type='text'
                        placeholder='Make comment'
                        className='comment_input'
                        value={commentMsg}
                        onChange={(e) => handleCommentInut(e)}
                      />
                      <button
                        className='__icon_btn'
                        onClick={() => setCommentOpenGif(true)}>
                        <AiOutlineFileGif />
                      </button>
                      <button
                        className='__icon_btn'
                        onClick={() => setCommentEmoji((prev) => !prev)}>
                        <BsEmojiLaughing />
                      </button>
                      {/* <button className='__icon_btn'><GrGallery /></button> */}
                      <label htmlFor='cmnt_img' className='__file_icon_btn'>
                        <GrGallery />
                      </label>
                      <input
                        type='file'
                        id='cmnt_img'
                        className='file_input'
                        onChange={(e) => handleCommentImage(e)}
                      />
                      <button
                        className={
                          isBtnDisable
                            ? "__send_btn disable__send_btn"
                            : "__send_btn"
                        }
                        onClick={() => postComment(postData._id)}
                        disabled={isBtnDisable}>
                        Send
                      </button>
                    </div>

                    {commentEmoji && (
                      <EmojiPicker onEmojiSelect={(e) => addEmoji(e)} />
                    )}

                    {/* PReview Image */}
                    <div className='comment_prev_image'>
                      {prevCommentImg !== "" && (
                        <div className='prev_container'>
                          <img
                            src={prevCommentImg}
                            className='comment_prev_img'
                          />
                          <button
                            className={
                              commentIsDisable
                                ? "__comment_close_btn disable"
                                : "__comment_close_btn"
                            }
                            onClick={closePreviewImage}
                            disabled={commentIsDisable}>
                            <AiOutlineClose />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Show Comments */}
                    {(postData.comment || []).length > 0 ? (
                      // <CommentCard
                      <>
                        {postData.comment.map((comment) => (
                          <CommentCard
                            key={comment._id}
                            commentData={comment}
                          />
                        ))}
                      </>
                    ) : (
                      <>No comment present</>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  updatePost: (post) => dispatch(updatePost(post)),
  deletePost: (post) => dispatch(deletePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupPost);
