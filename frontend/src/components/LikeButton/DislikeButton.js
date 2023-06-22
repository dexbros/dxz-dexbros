import React, { useState } from "react";
import "./LikeButton.css";
import { motion } from "framer-motion";
import { AiOutlineDislike } from "react-icons/ai";

const LikeButton = ({dislikeBtn, setBtnClicked, setDislikeBtn}) => {
  
  const [selectValue, setSelectValue] = useState("")

  const emojiList = [
    {
      value: 'angel', path: "../../Assets/angel.png"
    },
    {
      value: 'crying', path: "../../Assets/crying.png"
    },
    {
      value: 'angry', path: "../../Assets/angry.png"
    },
    {
      value: 'dislike', path: "../../Assets/dislike.png"
    },
  ]

  const list = {
    "visible": {
      opacity: 1,
      transition: {
        when: "aftereChildren"
      }
    },
    "hidden": {
      opacity: 0,
      transition: {
        when: "aftereChildren"
      }
    },

  }

  const animateBtn = () => {
    setDislikeBtn(prev => !prev);
    setBtnClicked(false);
  }

  const handleSubmitLike = (value) => {
    setDislikeBtn(false);
    setSelectValue(value);
  }

  return (
    <div onClick={() => dislikeBtn === true && setDislikeBtn(false)}>
      <motion.div onClick={() => dislikeBtn === true && setDislikeBtn(false)}>
        <motion.div className={dislikeBtn ? "reactionHolder_dislike" : "reactionHolderHide"} variants={list} animate={dislikeBtn ? 'visible' : 'hidden'}>
          {
            emojiList.map((emoji, index) => (
              <motion.button whileHover={{ scale: 1.8 }} key={index} onClick={() => handleSubmitLike(emoji.value)}>
                <motion.img src={require(`../../Assets/${emoji.value}.png`)} width="20px" margin="0px 9px" />

              </motion.button>
            ))
          }
        </motion.div>



        <motion.button className="__dislikeBtn" onClick={animateBtn}>
          {
            selectValue !== '' ?
              <>
                <motion.img src={require(`../../Assets/${selectValue}.png`)} width="10px" className="select_btn_image" />&nbsp;
              </> :
              <>
                <AiOutlineDislike />
              </>
          }
        </motion.button>
      </motion.div>
    </div>
  )
};

export default LikeButton;