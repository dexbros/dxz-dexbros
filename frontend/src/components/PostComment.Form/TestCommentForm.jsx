import React from 'react';
import { AiOutlineGift, AiOutlineFileImage, AiOutlineClose, AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsEmojiLaughing } from "react-icons/bs";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import GifModal from '../modal/GifModal';
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import { updatePost, setNewPinnedPost, updateComments } from "../../redux/post/post.actions";
// import { response } from 'express';
// import "./PostCommentForm.css";

const TestCommentForm = ({ postId, token, user, group, setPinnedPost, updateComments, setCommentsData }) => {
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [openGif, setOpenGif] = React.useState(false);
  const [showIcons, setShowIcons] = React.useState(false)

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
    console.log(URL.createObjectURL(e.target.files[0]))
  }

  // *** HandleText change
  const handleTextChange = (e) => {
    setComment(e.target.value.slice(0, 100));
    if (count < 100) {
      setCount(prev => prev + 1);
    }
  }

  // *** Close preview image
  const closeImage = () => {
    setPrevImage("");
    setImage("")
  }

  // *** Check comment length
  const checkLength = (e) => {
    if (e.keyCode === 8) {
      setCount(count => count - 1);
    } else {
      setCount(count => count + 1);
    }
  };

  // *** Handle open emoji
  const HandleOpenEmoji = () => {
    setOpenEmoji(prev => !prev)
  }

  // *** Handle open GIF modal
  const handleOpenGifModal = () => {
    setOpenGif(true);
  }

  // *** Adding emoji to input field
  const addEmoji = (e) => {
    setComment(prev => prev + e.native)
  }

  // *** Handle group post comment
  const postComment = () => {
    // console.log("Commenting...")
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", image);
    formdata.append("comment", comment);
    formdata.append("gif", gif);
    formdata.append("firstName", user.firstName);
    formdata.append("lastName", user.lastName);
    formdata.append("handleUn", user.handleUn);
    formdata.append("profilePic", user.profilePic);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/comment/${postId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setComment("");
        setIsLoading(false);
        // updateComments(result)
        setCommentsData(prev => [result, ...prev])
      })
      .catch((error) => {
        console.log("End...")
        console.log("error", error);
      });
  };


  return (
    <div className='post_comment_form_container' onFocus={() => setShowIcons(true)}>
      {/*** GIF modal ***/}
      {
        openGif &&
        <GifModal onClose={setOpenGif} setImagePreview={setPrevImage} setGif={setGif} />
      }

      {
        openEmoji && <div className='emoji_container'>
          <EmojiPicker onEmojiSelect={e => addEmoji(e)} />
        </div>
      }

      
      {
        prevImage !== "" &&
        <div className='group_comment_preview_image'>
          <img src={prevImage} className="commentImage" />
          <button className='group_comment_close_btn' onClick={closeImage}><AiOutlineClose /></button>
        </div>
      }

      <label className='comment_input_label'>{count}/100</label>
      <div className='group_comment_container'>
        
        <input
          type="text"
          placeholder="Comment"
          className={showIcons ? 'post_comment_input hideen_icons' : 'post_comment_input'}
          value={comment}
          onChange={(e) => handleTextChange(e)}
        />

        {
          showIcons &&
          <div className='comment_form_footer_icons'>
            {/* EMOJI */}
            <button className='group_post_comment_icon_btn' onClick={HandleOpenEmoji}><BsEmojiLaughing /></button>

            {/* IMAGE */}
            <label className='group_post_comment_icon_btn group_comment_image_icons' htmlFor='group_comment_file'><AiOutlineFileImage /></label>
            <input
              type="file"
              id="group_comment_file"
              className='input_file'
              onChange={e => handleImageChange(e)}
            />

            {/* GIF */}
            <button className='group_post_comment_icon_btn' onClick={handleOpenGifModal}><AiOutlineGift /></button>

            {/* SUBMIT BUTTON */}
            <button className={isDisable ? 'post_comment_submit post_comment_disable_btn' : 'post_comment_submit'} disabled={isDisable} onClick={postComment}>
              {
                isLoading ? <AiOutlineLoading3Quarters className='spinner' /> : <>Submit</>
              }
            </button>
          </div>
        }
      </div>
      
    </div>
  )
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token
})
  
const mapDispatchToProps = dispatch => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  updatePost: (post) => dispatch(updatePost(post)),
  deletePost: (post) => dispatch(deletePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  updateComments: (data) => dispatch(updateComments(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TestCommentForm);