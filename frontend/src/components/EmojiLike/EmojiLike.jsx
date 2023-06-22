/** @format */

import React from "react";
import { AiFillHeart, AiFillDislike } from "react-icons/ai";
import { BsEmojiLaughingFill, BsEmojiAngryFill } from "react-icons/bs";

const emoji = [
  "AiOutlineLike",
  "AiOutlineHeart",
  "BsEmojiAngry",
  "BsEmojiLaughing",
  "BsEmojiSunglasses",
];

const EmojiLike = ({ clickHandler, setQuery, id }) => {
  const handleClick = (e) => {
    console.log(e.target.value);
  };

  const newFunc = (e) => {
    var item = e.target.closest(".hove_emoji_btn");

    if (item) {
      setQuery(item.value);
      clickHandler(item.value, id);
    }
  };
  return (
    <div className='emojis'>
      <button
        className='hove_emoji_btn'
        value={"like"}
        onClick={(e) => newFunc(e, id)}>
        <AiFillHeart className='post_emoji_icon like_icon' />
      </button>

      <button
        className='hove_emoji_btn'
        value={"dislike"}
        onClick={(e) => newFunc(e)}>
        <AiFillDislike className='post_emoji_icon dislike_icon' />
      </button>

      <button
        className='hove_emoji_btn'
        value={"haha"}
        onClick={(e) => newFunc(e)}>
        <BsEmojiLaughingFill className='post_emoji_icon funny_icon' />
      </button>

      <button
        className='hove_emoji_btn'
        value={"angry"}
        onClick={(e) => newFunc(e)}>
        <BsEmojiAngryFill className='post_emoji_icon angry_icon' />
      </button>
    </div>
  );
};

export default EmojiLike;
