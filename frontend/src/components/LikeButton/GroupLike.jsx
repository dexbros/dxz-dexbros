// import React, { useState } from "react";
// import "./LikeButton.css";
// import { motion } from "framer-motion";
// import {AiOutlineLike} from "react-icons/ai"
// import { BsPinAngle } from "react-icons/bs";

// const GroupLike = ({ btnClicked, setBtnClicked, postData, user, handleSubmitLike, handleRemoveLike }) => {
//   const [selectValue, setSelectValue] = useState("");
//   // console.log(user)

//   // const emojiList = [
//   //   {
//   //     value: 'like', path: "../../Assets/like.png"
//   //   },
//   //   {
//   //     value: 'emoji', path: "../../Assets/emoji.png"
//   //   },
//   //   {
//   //     value: 'party', path: "../../Assets/party.png"
//   //   },
//   //   {
//   //     value: 'wow', path: "../../Assets/wow.png"
//   //   },
//   //   {
//   //     value: 'angel', path: "../../Assets/angel.png"
//   //   },
//   //   {
//   //     value: 'crying', path: "../../Assets/cryings.png"
//   //   },
//   //   {
//   //     value: 'angry', path: "../../Assets/angry.png"
//   //   },
//   // ]

//   const list = {
//     "visible": {
//       opacity: 1,
//       transition: {
//         when: "aftereChildren"
//       }
//     },
//     "hidden": {
//       opacity: 0,
//       transition: {
//         when: "aftereChildren"
//       }
//     },

//   }

//   const animateBtn = () => {
//     setBtnClicked(prev => !prev);
//     // alert("Show");
//     console.log(btnClicked)
//   }


//   return (
//     <div onClick={() => btnClicked === true && setBtnClicked(false)}>
//       <motion.div onClick={() => btnClicked === true && setBtnClicked(false)}>
//         <motion.div className={btnClicked ? "reactionHolder" : "reactionHolderHide"} variants={list} animate={btnClicked ? 'visible' : 'hidden'}>
//           {/* {
//             emojiList.map((emoji, index) => (
//               <motion.button whileHover={{ scale: 1.8 }} key={index} onClick={() => handleSubmitLike(emoji.value)}>
//                 <motion.img src={require(`../../Assets/${emoji.value}.png`)} width="20px" margin="0px 9px" />

//               </motion.button>
//             ))
//           } */}
//         </motion.div>
//         <motion.button className="likeBTN" onMouseEnter={animateBtn} onClick={handleRemoveLike}>
//           {/* <motion.img src={require(`../../Assets/like.png`)} width="10px" className="select_btn_image" /> */}
//           {
//             ((postData.reactions.like.includes(user._id)) || (postData.reactions.emoji.includes(user._id)) || (postData.reactions.party.includes(user._id)) || (postData.reactions.wow.includes(user._id)) || (postData.reactions.angel.includes(user._id)) || (postData.reactions.crying.includes(user._id)) || (postData.reactions.angry.includes(user._id))) ?
//               <>
//                 {
//                   postData.reactions.like.includes(user._id) && <motion.img src={require(`../../Assets/like.png`)} width="10px" className="select_btn_image" />
//                 }
//                 {
//                   postData.reactions.emoji.includes(user._id) && <motion.img src={require(`../../Assets/emoji.png`)} width="10px" className="select_btn_image" />
//                 }
//                 {
//                   postData.reactions.party.includes(user._id) && <motion.img src={require(`../../Assets/party.png`)} width="10px" className="select_btn_image" />
//                 }
//                 {
//                   postData.reactions.wow.includes(user._id) && <motion.img src={require(`../../Assets/wow.png`)} width="10px" className="select_btn_image" />
//                 }
//                 {
//                   postData.reactions.angel.includes(user._id) && <motion.img src={require(`../../Assets/angel.png`)} width="10px" className="select_btn_image" />
//                 }
//                 {
//                   postData.reactions.crying.includes(user._id) && <motion.img src={require(`../../Assets/crying.png`)} width="10px" className="select_btn_image" />
//                 }
//                 {
//                   postData.reactions.angry.includes(user._id) && <motion.img src={require(`../../Assets/angry.png`)} width="10px" className="select_btn_image" />
//                 }
//               </> :
//               <AiOutlineLike />
//           }
//         </motion.button>
//       </motion.div>
//     </div>
//   )
// };

// export default GroupLike

import React from 'react'

const GroupLike = () => {
  return (
    <div>GroupLike</div>
  )
}

export default GroupLike