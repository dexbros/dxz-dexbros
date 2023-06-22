/** @format */

import React, { useState, useEffect } from "react";
import Image from "../../Assets/image.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
} from "../../redux/post/post.actions";
import timeDifference from "../../utils/getCreateTime";
import intToString from "../../utils/PostCount";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FiMoreHorizontal } from "react-icons/fi";
import { VscPinnedDirty } from "react-icons/vsc";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import {
  AiOutlineEye,
  AiOutlineCamera,
  AiOutlineEdit,
  AiOutlineFileGif,
  AiOutlineClose,
} from "react-icons/ai";
import { BiTrashAlt, BiHide, BiComment, BiRepost } from "react-icons/bi";
import Modal from "../modal/MyModal";
import { IoClose } from "react-icons/io5";
import "./Comment.css";
import Tooltip from "../Tooltip/Tooltip";
import MyModal from "../modal/MyModal";
import { GrGallery } from "react-icons/gr";
import { BsEmojiLaughing } from "react-icons/bs";
import { ImSpinner } from "react-icons/im";
import GifModal from "../modal/GifModal";
import CommentReply from "../CommentReplyComponent/CommentReply";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { GrClose } from "react-icons/gr";
import { BiSticker } from "react-icons/bi";
import StickerModal from "../modal/StickerModal";

const CommentComponent = ({
  postData,
  comment,
  user,
  token,
  setPinnedPost,
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const [postId, setPostId] = useState("");
  const [isEditModal, setIsEditModal] = useState(false);
  const [updatedcomment, setUpdatedComment] = useState("");
  const [isHimdeMeModal, setIsHideMeModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [username, setUsername] = useState("");
  const [userProfileId, setUserProfileId] = useState("");
  const [replyDisable, setReplyDisable] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [privacy, setPrivacy] = useState("");
  const [image, setImage] = useState("");
  const [prevImg, setPrevImg] = useState("");
  const [gif, setGif] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openGifModal, setOpenGifModl] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [openModalEmoji, setOpenModalEmoji] = useState(false);
  const [openModalGif, setOpenModalGif] = useState(false);
  const [modalImagPrev, setModalImagePrev] = useState("");
  const [modalGifPrev, setModalGifPrev] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [showSticker, setShowSticker] = useState("");
  const [sticker, setSticker] = useState("");
  const [hideContent, setHideContent] = useState(false);

  // GIF STATE
  const [currentGif, setCurrentGif] = useState("");
  const [newGif, setNewGif] = useState("");

  // URL state
  const [currentURL, setCurrentURL] = useState("");

  // Image state
  const [currentImage, setCurrentImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [updateImage, setUpdateImage] = useState("");

  useEffect(() => {
    if (!replyText.trim()) {
      setReplyDisable(true);
    } else {
      setReplyDisable(false);
    }
  }, [replyText]);

  // Pinned comment oepn Modal...
  const handlePinnedCommentModal = (id) => {
    setIsPinned(true);
    setPostId(id);
  };
  const handlePinnedComment = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/pinned/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
        setIsPinned(false);
      })
      .catch((error) => console.log("error", error));
  };

  const modalFileHanlder = (e) => {
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setUpdateImage(e.target.files[0]);
  };

  // Comment Edit Modal
  const handleEditModal = (id) => {
    setIsEditModal(true);
    setPostId(id);
    if (id === comment._id) {
      setCurrentGif(comment.comment_info[0].gif);
      setUpdatedComment(comment.comment_info[0].comment);
      setCurrentURL(comment.comment_info[0].url);
      setCurrentImage(comment.comment_info[0].image);
    }
  };
  const handleEdit = (id) => {
    console.log("Image: " + updatedImage);
    console.log("Gif: " + modalGifPrev);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("comment", updatedcomment);
    formdata.append("image", updateImage);
    formdata.append("gif", setNewGif);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/edit/${id}`,
      requestOptions
    )
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
        setIsEditModal(false);
        setUpdatedComment("");
        setModalImagePrev("");
        setShowEmoji(false);
      })
      .catch((error) => console.log("error", error));
  };

  // Comment Hide Modal
  const commentHideModal = (id) => {
    setIsHideMeModal(true);
    setPostId(id);
  };
  const commentHideHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/hide/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  // Comment Delete Modal
  const commentDeleteModal = (id) => {
    setDeleteModal(true);
    setPostId(id);
  };
  const commentDeleteHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/delete/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
        setDeleteModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  // Comment Like handler
  const commentLikHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/like/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  // Comment Dislike Handle
  const commentDislikeHandler = (id) => {
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
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  // Comment Reply Handler
  const replyComment = (commentId, commentUserId, firstname, lastname) => {
    // console.log(commentId);
    // console.log(commentUserId);
    setShowReply((prev) => !prev);
    setUserProfileId(commentUserId);
    setUsername(`${firstname} ${lastname}`);
  };

  const closeNameTag = () => {
    setUsername("");
    setUserProfileId("");
    // setShowReply(false);
  };

  const handleImageChange = (e) => {
    setPrevImg(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleReplyComment = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", image);
    formdata.append("replyMsg", replyText);
    formdata.append("gif", gif);
    formdata.append("replyTo", id);
    formdata.append("username", username);
    formdata.append("sticker", sticker);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/${id}`,
      requestOptions
    )
      // .then(response => response.text())
      .then((result) => {
        console.log(result);
        setReplyText("");
        setReplyDisable(true);
        setPrevImg("");
        setImage("");
        setGif("");
        setShowReply(false);
        setPinnedPost(result);
        setIsLoading(false);
        setUsername("");
      })
      .catch((error) => {
        console.log("error", error);
        setReplyText("");
        setReplyDisable(true);
        setPrevImg("");
        setImage("");
        setGif("");
        setShowReply(false);
        setPinnedPost(result);
        setIsLoading(false);
        setUsername("");
      });
  };

  const handlePrivacyModal = (id) => {
    setPostId(id);
    setOpenPrivacyModal((prev) => !prev);
  };

  const onOptionChange = (e) => {
    setPrivacy(e.target.value);
  };
  const updatePostPrivacySettings = () => {};

  const addEmoji = (e) => {
    setReplyText((prev) => prev + e.native);
  };

  const addEmojiComment = (e) => {
    setUpdatedComment((prev) => prev + e.native);
  };

  const handleCloseModalImage = () => {
    setModalImagePrev("");
    setModalGifPrev("");
    setUpdatedImage("");
  };

  const handleModalFileChange = (e) => {
    setUpdatedImage(e.target.files[0]);
    setModalImagePrev(URL.createObjectURL(e.target.files[0]));
  };

  const closePreviewImage = () => {
    setPrevImg("");
    setImage("");
    setGif("");
    setSticker("");
  };

  return (
    <>
      {/* GIF MODAL */}
      {openGifModal && (
        <GifModal
          onClose={setOpenGifModl}
          setImagePreview={setPrevImg}
          setGif={setGif}
        />
      )}

      {/* STICKER MODAL */}
      {showSticker && (
        <StickerModal
          onClose={setShowSticker}
          setImagePreview={setPrevImg}
          setSticker={setSticker}
        />
      )}
      <>
        {/* PINNED COMMENT */}
        {isPinned && (
          <Modal
            title={comment.pinned ? "Unpinned comment" : "Pinned comment"}
            body={
              comment.pinned
                ? "Do your want to unpinned this comment?"
                : "Do your want to pinned this comment?"
            }
            clickHandler={handlePinnedComment}
            setIsClose={setIsPinned}
            btnText={comment.pinned ? "Unpinned" : "Pinned"}
            postId={postId}
          />
        )}

        {/* EDIT COMMENT */}
        {isEditModal && (
          <Modal
            title={"Edit Comment"}
            body={
              <div>
                {/* MODAL BODY HEADER */}
                <div className='__modal_body_header'>
                  <textarea
                    type='text'
                    value={updatedcomment}
                    onChange={(e) => setUpdatedComment(e.target.value)}
                    className='modal_input'></textarea>
                </div>

                {/* Modal Body button container */}
                <div className='__modal_body_btns'>
                  {/* Gif Icon */}
                  <button onClick={() => setOpenModalGif((prev) => !prev)}>
                    <AiOutlineFileGif />
                  </button>

                  {/* Gallery Icon */}
                  <label htmlFor='modal_image'>
                    <AiOutlineCamera className='__cam_icon' />
                  </label>
                  <input
                    type='file'
                    id='modal_image'
                    className='input_file'
                    onChange={(e) => modalFileHanlder(e)}
                  />

                  {/* Emoji Icons */}
                  <button
                    className='modal_icon_btn'
                    onClick={() => setOpenModalEmoji((prev) => !prev)}>
                    <BsEmojiLaughing />
                  </button>
                </div>

                {/* Preview Container */}
                {/* GIF container */}
                <div>
                  {currentGif && (
                    <div
                      className='preview_container'
                      onClick={() => {
                        setCurrentGif("");
                        setNewGif("");
                      }}>
                      <img src={currentGif} className='preview_content_modal' />
                      <button className='modal_preview_cloase_btn'>
                        <GrClose />
                      </button>
                    </div>
                  )}
                  {newGif && (
                    <div
                      className='preview_container'
                      onClick={() => {
                        setCurrentGif("");
                        setNewGif("");
                      }}>
                      <img src={newGif} className='preview_content_modal' />
                      <button className='modal_preview_cloase_btn'>
                        <GrClose />
                      </button>
                    </div>
                  )}
                </div>

                {/* Url Container */}
                <div>
                  {currentURL && (
                    <div
                      className='preview_container'
                      onClick={() => {
                        setCurrentURL("");
                      }}>
                      <LinkPreview
                        url={currentURL}
                        height='270px'
                        description='null'
                      />
                      <button className='modal_preview_cloase_btn'>
                        <GrClose />
                      </button>
                    </div>
                  )}
                </div>

                {/* Image Container */}
                <div>
                  {currentImage && (
                    <div
                      className='preview_container'
                      onClick={() => {
                        setCurrentImage("");
                        setPreviewImage("");
                      }}>
                      <img
                        src={currentImage}
                        className='preview_content_modal'
                      />
                      <button className='modal_preview_cloase_btn'>
                        <GrClose />
                      </button>
                    </div>
                  )}
                  {previewImage && (
                    <div
                      className='preview_container'
                      onClick={() => {
                        setCurrentImage("");
                        setPreviewImage("");
                      }}>
                      <img
                        src={previewImage}
                        className='preview_content_modal'
                      />
                      <button className='modal_preview_cloase_btn'>
                        <GrClose />
                      </button>
                    </div>
                  )}
                </div>

                {/* EMOJI Container */}
                {/* Open Emoji */}
                {openModalEmoji && (
                  <EmojiPicker onEmojiSelect={(e) => addEmojiComment(e)} />
                )}

                {/* GIF modal */}
                <div>
                  {openModalGif && (
                    <GifModal
                      onClose={setOpenModalGif}
                      setImagePreview={setNewGif}
                      setGif={setNewGif}
                    />
                  )}
                </div>
              </div>
            }
            clickHandler={handleEdit}
            setIsClose={setIsEditModal}
            btnText='Edit'
            postId={postId}
          />
        )}

        {/* HIDE COMMENT */}
        {isHimdeMeModal && (
          <Modal
            title={"Hide Comment"}
            body={"Do your want to hide this comment?"}
            clickHandler={commentHideHandler}
            setIsClose={setIsHideMeModal}
            btnText='Hide'
            postId={postId}
          />
        )}

        {/* Delete Comment */}
        {deleteModal && (
          <Modal
            title='Delete Comment'
            body={"Do your want to delete this comment?"}
            clickHandler={commentDeleteHandler}
            setIsClose={setDeleteModal}
            btnText='Delete'
            postId={postId}
          />
        )}

        {/* Privacy Comment */}
        {openPrivacyModal && (
          <MyModal
            title='Privacy'
            body={
              <div className='moda_radio_container'>
                <p className='modal_radio_header'>
                  Change post privacy settings
                </p>
                <span className='modal_text'>
                  Previously your post is visible for{" "}
                  <span className='bold'>{comment.privacy}</span>
                </span>
                {/* Radio Box */}
                <div className='radio_box'>
                  {/* For All */}
                  <div className='radio'>
                    <input
                      type='radio'
                      name='privacy'
                      value='All'
                      id='all'
                      onChange={(e) => onOptionChange(e)}
                    />
                    <label htmlFor='all' className='radio_label'>
                      All
                    </label>
                  </div>

                  {/* Only Followers */}
                  <div className='radio'>
                    <input
                      type='radio'
                      name='privacy'
                      value='Only follower'
                      id='follower'
                      onChange={(e) => onOptionChange(e)}
                    />
                    <label htmlFor='follower' className='radio_label'>
                      Only follower
                    </label>
                  </div>

                  {/* Only me */}
                  <div className='radio'>
                    <input
                      type='radio'
                      name='privacy'
                      value='Only me'
                      id='me'
                      onChange={(e) => onOptionChange(e)}
                    />
                    <label htmlFor='me' className='radio_label'>
                      Only me
                    </label>
                  </div>
                </div>
              </div>
            }
            setIsClose={setOpenPrivacyModal}
            btnText='Save'
            postId={postId}
            clickHandler={updatePostPrivacySettings}
          />
        )}
        <div className='comment_card'>
          <span className='pinned_comment'>
            {comment.pinned && (
              <span className='pinned_comment'>Pinned comment</span>
            )}
          </span>
          <div className='comment_header'>
            <div className='commented_user_info'>
              <Link to={`/profile/${comment.commentedBy._id}}`}>
                <img
                  src={
                    comment.commentedBy.profilePic
                      ? comment.commentedBy.profilePic
                      : Image
                  }
                  className='comment_profile_avatar'
                />
              </Link>

              <Tooltip
                content={
                  <div className='tooltip_content'>
                    <img
                      src={comment.commentedBy.profilePic}
                      className='tooltip_imgae'
                    />
                    <span className='tooltip_name'>
                      {comment.commentedBy.displayFirstName &&
                      comment.commentedBy.displayLastName ? (
                        <>
                          {comment.commentedBy.displayFirstName +
                            " " +
                            comment.commentedBy.displayLastName}
                        </>
                      ) : (
                        <>
                          {comment.commentedBy.firstName +
                            " " +
                            comment.commentedBy.lastName}
                        </>
                      )}
                    </span>
                    <span className='tooltip_username'>
                      @
                      {comment.commentedBy.username
                        ? comment.commentedBy.username
                        : comment.commentedBy.handleUn}
                    </span>
                    <div className='tooltip_box1'>
                      <span className='tooltip_followers'>
                        Followers: {comment.commentedBy.followers.length || 0}
                      </span>
                      <span className='tooltip_followers'>
                        Following: {comment.commentedBy.following.length || 0}
                      </span>
                    </div>
                  </div>
                }
                direction='right'>
                <Link
                  to={`/profile/${comment.commentedBy._id}`}
                  className='comment_name'>
                  {comment.commentedBy.displayFirstName
                    ? comment.commentedBy.displayFirstName
                    : comment.commentedBy.firstName}{" "}
                  {comment.commentedBy.displayLastName
                    ? comment.commentedBy.displayLastName
                    : comment.commentedBy.lastName}
                </Link>
              </Tooltip>
              <span className='comment_date'>
                {timeDifference(new Date(), new Date(comment.createdAt))}
              </span>
            </div>
            <Menu
              menuButton={
                <MenuButton>
                  <FiMoreHorizontal />
                </MenuButton>
              }>
              {/* PINNED COMMENT */}
              {user._id === postData.postedBy._id && (
                <MenuItem
                  className={"menuitem"}
                  onClick={(e) => handlePinnedCommentModal(comment._id)}>
                  <span className='dropdown_icon'>
                    <VscPinnedDirty />
                  </span>
                  {comment.pinned ? <>Unpinned</> : <>Pinned</>}
                </MenuItem>
              )}

              {/* Comment Privacy */}
              {user._id === comment.commentedBy._id && (
                <MenuItem
                  className={"menuitem"}
                  onClick={() => handlePrivacyModal(postData._id)}>
                  <span className='dropdown_icon'></span>
                  Privacy
                </MenuItem>
              )}

              {/* EDIT COMMENT */}
              {user._id === comment.commentedBy._id && (
                <MenuItem
                  className={"menuitem"}
                  onClick={() => handleEditModal(comment._id)}>
                  <span className='dropdown_icon'>
                    <AiOutlineEdit />
                  </span>
                  Edit
                </MenuItem>
              )}

              {/* Delete Comment */}
              {(user._id === comment.commentedBy._id ||
                user._id === postData.postedBy._id) && (
                <MenuItem
                  className={"menuitem"}
                  onClick={() => commentDeleteModal(comment._id)}>
                  <span className='dropdown_icon'>
                    <BiTrashAlt />
                  </span>
                  Delete
                </MenuItem>
              )}

              {/* Hiding Comment */}
              <SubMenu className={"menuItem"} label='Hide'>
                <MenuItem
                  className={"menuitem"}
                  onClick={() => commentHideModal(comment._id)}>
                  Hide for me
                </MenuItem>
                {user._id === postData.postedBy._id && (
                  <MenuItem className={"menuitem"}>Hide for all</MenuItem>
                )}
              </SubMenu>
            </Menu>
          </div>

          {/* Comment Body */}
          <div className='comment_body'>
            <>
              {comment.comment_info[0].comment.length > 35 ? (
                <>
                  {!hideContent ? (
                    <>
                      {comment.comment_info[0].comment.slice(0, 35)}...
                      <button
                        onClick={() => setHideContent((prev) => !prev)}
                        className='react_more'>
                        more
                      </button>
                    </>
                  ) : (
                    <>
                      {comment.comment_info[0].comment}...
                      <button
                        onClick={() => setHideContent((prev) => !prev)}
                        className='react_more'>
                        Less
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>{comment.comment_info[0].comment}</>
              )}
            </>
            {comment.comment_info[0].image !== "" && (
              <div>
                <img
                  src={comment.comment_info[0].image}
                  className='comment_img'
                />
              </div>
            )}
            {comment.comment_info[0].gif !== "" && (
              <div>
                <img
                  src={comment.comment_info[0].gif}
                  className='comment_img'
                />
              </div>
            )}
            {comment.comment_info[0].sticker !== "" && (
              <div>
                <img
                  src={comment.comment_info[0].sticker}
                  className='comment_img'
                />
              </div>
            )}
            {comment.comment_info[0].url !== "" && (
              <div className='linkPreview'>
                <Tooltip content='Click on the link' direction='bottom'>
                  <a
                    target='_blank'
                    href={comment.comment_info[0].url}
                    className='anchor_name'>
                    {comment.comment_info[0].url}
                  </a>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Comment Footer */}
          <div className='comment_card_footer'>
            {/* LIKE COMMENT */}
            <button
              className={
                comment.likes.includes(user._id)
                  ? "comment_footer_btn comment_like_btn_active"
                  : "comment_footer_btn"
              }
              onClick={() => commentLikHandler(comment._id)}>
              Like {comment.likes && intToString(comment.likes.length)}
            </button>

            {/* DISLIKE COMMENT */}
            <button
              className={
                comment.dislikes.includes(user._id)
                  ? "comment_footer_btn comment_dislike_btn_active"
                  : "comment_footer_btn"
              }
              onClick={() => commentDislikeHandler(comment._id)}>
              Dislike {comment.dislikes && intToString(comment.dislikes.length)}
            </button>

            <button
              className='comment_footer_btn'
              onClick={() =>
                replyComment(
                  comment._id,
                  comment.commentedBy._id,
                  comment.commentedBy.firstName,
                  comment.commentedBy.lastName
                )
              }>
              Reply {comment.replies && intToString(comment.replies.length)}
            </button>
          </div>

          {/* Comment Reply container */}
        </div>
      </>

      {showReply && (
        <>
          {username !== "" && (
            <span className='reply_user_tag'>
              Reply to
              <button className='username_tag'>
                {username}
                <AiOutlineClose
                  className='tag_close_icon'
                  onClick={() => setUsername("")}
                />
              </button>
            </span>
          )}
          <div className='__reply_container'>
            <div className='__input_container'>
              <input
                type={"text"}
                className='reply_input'
                placeholder={`Reply to ${username}`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>

            <div className='__reply_btns'>
              {/* GIF button */}
              <button
                className='gif_btn'
                onClick={() => setOpenGifModl((prev) => !prev)}>
                <AiOutlineFileGif />
              </button>

              {/* IMAGE button */}
              <label htmlFor='cmnt_file' className='file_btn'>
                <GrGallery />
              </label>
              <input
                type='file'
                id='cmnt_file'
                className='file_input'
                onChange={(e) => handleImageChange(e)}
              />

              {/* EMOJI button */}
              <button
                className='emoji_btn'
                onClick={() => setShowEmoji((prev) => !prev)}>
                <BsEmojiLaughing />
              </button>

              {/* Sticker Button */}
              <button
                className='emoji_btn'
                onClick={() => setShowSticker((prev) => !prev)}>
                <BiSticker />
              </button>

              {/* Submit button */}
              <button
                className={
                  replyDisable ? "send_btn reply_btn_disable" : "send_btn"
                }
                disabled={replyDisable}
                onClick={() => handleReplyComment(comment._id)}>
                {isLoading ? <ImSpinner className='btn_spinner' /> : <>Send</>}
              </button>
            </div>
          </div>
          {showEmoji && <EmojiPicker onEmojiSelect={(e) => addEmoji(e)} />}

          {/* Comment Reply Preview Image */}
          {prevImg !== "" && (
            <div className='preview_image_container'>
              <div className='comment_img_prev_box'>
                <img src={prevImg} className='__comment_img_prev' />
                <button className='__close_btn' onClick={closePreviewImage}>
                  <AiOutlineClose />
                </button>
              </div>
            </div>
          )}

          <div className='replyCard'>
            {(comment.replies || []).length > 0 &&
              comment.replies.map((replyData) => (
                <CommentReply replyData={replyData} key={replyData._id} />
              ))}
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentComponent);
