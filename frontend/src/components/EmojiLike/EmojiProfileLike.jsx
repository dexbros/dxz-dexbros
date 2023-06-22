/** @format */

import React from "react";
import { AiFillHeart, AiFillDislike } from "react-icons/ai";
import { BsEmojiLaughingFill, BsEmojiAngryFill } from "react-icons/bs";
import { BsEmojiHeartEyesFill } from "react-icons/bs";

const EmojiProfileLike = ({ setQuery, id, count }) => {
  const handleClick = (e) => {
    console.log(e.target.value);
  };

  const likeProfileImage = (e) => {
    var item = e.target.closest(".hove_emoji_btn");
    // console.log(item.value);
    if (item) {
      setQuery(item.value);
      console.log(item.value, id);
    }
  };

  return (
    <div className='profile_emojis'>
      <button
        className='hove_emoji_btn profile_emoji_btn'
        value={"like"}
        onClick={(e) => likeProfileImage(e, id)}>
        <AiFillHeart className='post_emoji_icon like_icon' />
      </button>

      <button
        className='hove_emoji_btn profile_emoji_btn'
        value={"dislike"}
        onClick={(e) => likeProfileImage(e)}>
        <AiFillDislike className='post_emoji_icon dislike_icon' />
      </button>

      <button
        className='hove_emoji_btn profile_emoji_btn'
        value={"haha"}
        onClick={(e) => likeProfileImage(e)}>
        <BsEmojiLaughingFill className='post_emoji_icon funny_icon' />
      </button>

      <button
        className='hove_emoji_btn profile_emoji_btn'
        value={"love"}
        onClick={(e) => likeProfileImage(e)}>
        <BsEmojiHeartEyesFill className='post_emoji_icon angry_icon' />
      </button>
      {/* <span>{count}</span> */}
    </div>
  );
};

export default EmojiProfileLike;
