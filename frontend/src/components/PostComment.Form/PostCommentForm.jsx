/** @format */

import React, { useState, useEffect } from "react";
import { GrGallery } from "react-icons/gr";
import { AiOutlineFileGif, AiOutlineClose } from "react-icons/ai";
import Tooltip from "../Tooltip/Tooltip";
import "./PostCommentForm.css";
import GifModal from "../modal/GifModal";
import { BsEmojiLaughing } from "react-icons/bs";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import {BiSticker} from "react-icons/bi"
import StickerModal from "../modal/StickerModal";
import ButtonLoader from "../ButtonLoader/ButtonLoader";

const maxWordLength = 150

const PostCommentForm = ({ token, id, setPinnedPost }) => {
  // console.log(disable);
  const [comment, setComment] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [gif, setGif] = useState("");
  const [config, setConfig] = useState("");
  const [openGifModal, setGifModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [openStickerModal, setOpenStickerModal] = useState(false);
  const [sticker, setSticker] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [visibleMsg, setVisibleMsg] = useState(false);

  const [text, setText] = useState("");

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}post/config`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setConfig(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    if (comment.length > 150) {
      setVisibleMsg(true);
      setIsDisable(true)
    }
    if (comment.length < 151 && comment.length>0) {
      setIsDisable(false);
      setVisibleMsg(false)
    } else {
      setIsDisable(true)
    }
  }, [comment]);

  const handleFileChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const closePreview = () => {
    setPrevImage("");
    setImage("");
    setGif("");
    setSticker("")
  };

  const addEmoji = (e) => {
    setComment((prev) => prev + e.native);
  };

  // *** This form submission should be changed...
  const handleCommentSubmit = () => {
    console.log("Commenting...")
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", image);
    formdata.append("comment", comment);
    formdata.append("gif", gif);
    formdata.append("sticker", sticker);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/comment/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
    console.log("End...")
        console.log(result);
        // toast.success(result.msg);
        setPinnedPost(result.postData);
        setIsDisable(true);
        setComment("");
        setImage("");
        setPrevImage("");
        setGif("");
        setShowEmoji(false);
        setWordCount(0);
        setVisibleMsg(false);
        setIsLoading(false);
      })
      .catch((error) => {
    console.log("End...")
        console.log("error", error);
        setIsDisable(true);
        setComment("");
        setImage("");
        setPrevImage("");
        setGif("");
        setShowEmoji(false);
        setWordCount(0);
        setVisibleMsg(false);
        setIsLoading(false);
      });
  };

  const handleCommentText = (e) => {
    setComment(e.target.value)
    setWordCount(e.target.value.length)
  }

  return (
    <>
      {
        openStickerModal &&
        <StickerModal
          onClose={setOpenStickerModal}
          setImagePreview={setPrevImage}
          setSticker={setSticker}
        />
      }
      {openGifModal && (
        <GifModal
          onClose={setGifModal}
          setImagePreview={setPrevImage}
          setGif={setGif}
        />
      )}
        <div>
        <span className="word_count">{wordCount}/{maxWordLength}</span>
        {
          visibleMsg &&
          <span className="error_msg">You cannot put more than 150 characters</span>
        }
        </div>
      <div className='post_comment_container'>
        <div className='post_comment_header'>
          <input
            type='text'
            placeholder='Make Public Comment'
            className='comment_input'
            value={comment}
            onChange={(e) => handleCommentText(e)}
          />

          {/* Emoji icon */}
          <Tooltip content='Emoji' direction='bottom'>
            <button
              className='gif_icon_btn'
              onClick={() => setShowEmoji((prev) => !prev)}>
              <BsEmojiLaughing />
            </button>
          </Tooltip>

          {/* Gif icon */}
          <Tooltip content='GIF' direction='bottom'>
            <button
              className='gif_icon_btn'
              onClick={() => setGifModal((prev) => !prev)}>
              <AiOutlineFileGif />
            </button>
          </Tooltip>

          {/* Sticker icon */}
          <Tooltip content='Sticker' direction='bottom'>
            <button
              className='gif_icon_btn'
              onClick={() => setOpenStickerModal((prev) => !prev)}>
              <BiSticker />
            </button>
          </Tooltip>

          {/* GALLERY ICON */}
          <Tooltip content='Gallery' direction='bottom'>
            <label htmlFor='comment_image_file' className='gallery_icon'>
              <GrGallery />
            </label>
            <input
              type='file'
              id='comment_image_file'
              className='input_file'
              onChange={(e) => handleFileChange(e)}
            />
          </Tooltip>

          <Tooltip content='Post' direction='bottom'>
            <button
              className={
                isDisable
                  ? "comment_post_btn comnt_btn_disable"
                  : "comment_post_btn"
              }
              disabled={isDisable}
              onClick={handleCommentSubmit}>
              {isLoading ? <ButtonLoader /> : <>Post</>}
            </button>
          </Tooltip>
        </div>
      </div>
      {prevImage !== "" && (
        <div className='cmt_prev_img_container'>
          <img src={prevImage} className='cmntprev_image' />
          <button className='close_btn' onClick={() => closePreview()}>
            <AiOutlineClose />
          </button>
        </div>
      )}
      {showEmoji && <EmojiPicker onEmojiSelect={(e) => addEmoji(e)} />}
    </>
  );
};

export default PostCommentForm;
