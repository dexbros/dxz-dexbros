/** @format */

import React from "react";
import {
  AiOutlineGift,
  AiOutlineFileImage,
  AiOutlineClose,
} from "react-icons/ai";
import { BsEmojiLaughing } from "react-icons/bs";
import "./GroupPostCommentForm.css";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import GifModal from "../modal/GifModal";
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import { updatePost, setNewPinnedPost } from "../../redux/post/post.actions";
import {
  addGroupPost,
  updateGroupPost,
  deleteGroupPost,
  addPostComment,
  updatePostComment,
  deletePostComment,
} from "../../redux/Group/group.actions";

const GroupPostCommentForm = ({
  postId,
  token,
  user,
  group,
  setPinnedPost,
  updateGroupPost,
}) => {
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [openGif, setOpenGif] = React.useState(false);
  const [showIcons, setShowIcons] = React.useState(false);

  React.useEffect(() => {
    if (!comment.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [comment]);
  // *** Handle Image change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    console.log(URL.createObjectURL(e.target.files[0]));
  };

  // *** HandleText change
  const handleTextChange = (e) => {
    setComment(e.target.value.slice(0, 100));
  };

  // *** Close preview image
  const closeImage = () => {
    setPrevImage("");
    setImage("");
  };

  // *** Check comment length
  const checkLength = (e) => {
    if (e.keyCode === 8) {
      setCount((count) => count - 1);
    } else {
      setCount((count) => count + 1);
    }
  };

  // *** Handle open emoji
  const HandleOpenEmoji = () => {
    setOpenEmoji((prev) => !prev);
  };

  // *** Handle open GIF modal
  const handleOpenGifModal = () => {
    setOpenGif(true);
  };

  // *** Adding emoji to input field
  const addEmoji = (e) => {
    setComment((prev) => prev + e.native);
  };

  // *** Handle group post comment
  const postComment = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("message", comment);
    formdata.append("gif", gif);
    formdata.append("image", image);

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
        setIsLoading(false);
        setIsDisable(true);
        updateGroupPost(result);
        setGif("");
        setImage("");
        setPrevImage("");
        setComment("");
        setShowIcons(false);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className='' onFocus={() => setShowIcons(true)}>
      {/*** GIF modal ***/}
      {openGif && (
        <GifModal
          onClose={setOpenGif}
          setImagePreview={setPrevImage}
          setGif={setGif}
        />
      )}

      {openEmoji && (
        <div className='emoji_container'>
          <EmojiPicker onEmojiSelect={(e) => addEmoji(e)} />
        </div>
      )}

      {prevImage !== "" && (
        <div className='group_comment_preview_image'>
          <img src={prevImage} className='commentImage' />
          <button className='group_comment_close_btn' onClick={closeImage}>
            <AiOutlineClose />
          </button>
        </div>
      )}

      <label>{count}/100</label>
      <div className='group_comment_container'>
        <input
          type='text'
          placeholder='Comment'
          className={
            showIcons ? "group_post_input hideen_icons" : "group_post_input"
          }
          value={comment}
          onChange={(e) => handleTextChange(e)}
        />

        {showIcons && (
          <div className='comment_form_footer_icons'>
            {/* EMOJI */}
            <button
              className='group_post_comment_icon_btn'
              onClick={HandleOpenEmoji}>
              <BsEmojiLaughing />
            </button>

            {/* IMAGE */}
            <label
              className='group_post_comment_icon_btn group_comment_image_icons'
              htmlFor='group_comment_file'>
              <AiOutlineFileImage />
            </label>
            <input
              type='file'
              id='group_comment_file'
              className='input_file'
              onChange={(e) => handleImageChange(e)}
            />

            {/* GIF */}
            <button
              className='group_post_comment_icon_btn'
              onClick={handleOpenGifModal}>
              <AiOutlineGift />
            </button>

            {/* SUBMIT BUTTON */}
            <button
              className={isDisable ? "submit disable" : "submit"}
              disabled={isDisable}
              onClick={postComment}>
              Submit
            </button>
          </div>
        )}
      </div>
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
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupPostCommentForm);
