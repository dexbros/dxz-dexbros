/** @format */

import React from "react";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import {
  newMessages,
  setPinnedMessage,
  setRemovePinnedMessage,
  removeMessage,
} from "../../redux/block/block.action";
import timeDifference from "../../utils/getCreateTime";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FiMoreVertical } from "react-icons/fi";
import CustomModal from "../modal/CustomModal";
import { AiFillHeart, AiOutlineStop, AiOutlineGift } from "react-icons/ai";
import { useParams } from "react-router";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";

import Heart from "../../Assets/msgIcons/heart.png";
import Emoji from "../../Assets/msgIcons/emoji.png";
import Fire from "../../Assets/msgIcons/fire.png";
import Surprised from "../../Assets/msgIcons/surprised.png";
import Unlike from "../../Assets/msgIcons/unlike.png";

const BlockMessage = ({
  messageData,
  blockCast,
  user,
  token,
  setPinnedMessage,
  pinnedMessage,
  setRemovePinnedMessage,
  removeMessage,
}) => {
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  const [mid, setMid] = React.useState("");
  const [showEmoji, setshowEmoji] = React.useState(false);
  const [openEmojiLike, setOpenEmojiLike] = React.useState(false);
  // likes
  const [likes, setLikes] = React.useState(messageData.likes);
  // funny
  const [funny, setFunny] = React.useState(messageData.funny);
  // fire
  const [fire, setFire] = React.useState(messageData.fire);
  // wow
  const [wow, setWow] = React.useState(messageData.wow);
  // dislikes
  const [dislikes, setDislikes] = React.useState(messageData.dilikes);
  const { id } = useParams();

  console.log(messageData);
  useSocket();

  React.useEffect(() => {
    socket.off("delete block message").on("delete block message", (message) => {
      console.log("message");
      removeMessage(message);
    });
  });

  // *** Handle open delete modal
  const handleDeleteOpenModal = (id) => {
    setMid(id);
    setOpenDeleteModal(true);
  };
  // *** Handle Delete message
  const handleDeleteMessage = () => {
    var axios = require("axios");
    var config = {
      method: "delete",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/message/delete/${mid}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        setOpenDeleteModal(false);
        socket.emit("delete message", response.data.message);
        removeMessage(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onClose = () => {
    setOpenDeleteModal(false);
    setOpenPinnedModal(false);
    setOpenEditModal();
  };

  // *** Handle like message
  const handleLikeMessage = (id) => {
    const axios = require("axios");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/message/like/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (likes.includes(user.handleUn)) {
          const arr = likes;
          const temp = arr.filter((data) => data !== user.handleUn);
          setLikes(temp);
        } else {
          setLikes((prev) => [...prev, user.handleUn]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ref = React.useRef(null);

  React.useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenEmojiLike(false);
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // dispose
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleOpenEmoji = (id) => {
    setMid(id);
    setOpenEmojiLike(true);
  };

  const handleEmojiLike = (value, id) => {
    if (value === "likes") {
      if (likes.includes(user.handleUn)) {
        const arr = likes;
        const temp = arr.filter((data) => data !== user.handleUn);
        setLikes(temp);
      } else {
        // remove value from funny array
        const funnyArr = funny;
        const funnyTemp = funnyArr.filter((data) => data !== user.handleUn);
        setFunny(funnyTemp);
        // remove value from fire array
        const fireArr = fire;
        const fireTemp = fireArr.filter((data) => data !== user.handleUn);
        setFire(fireTemp);
        // remove value from wow array
        const wowArr = wow;
        const wowTemp = wowArr.filter((data) => data !== user.handleUn);
        setWow(wowTemp);
        // remove value from dislikes array
        const dislikesArr = dislikes;
        const dislikesTemp = dislikesArr.filter(
          (data) => data !== user.handleUn
        );
        setDislikes(dislikesTemp);
        setLikes((prev) => [...prev, user.handleUn]);
      }
    }
    // funny
    else if (value === "funny") {
      if (funny.includes(user.handleUn)) {
        const arr = funny;
        const temp = arr.filter((data) => data !== user.handleUn);
        setFunny(temp);
      } else {
        // remove value from likes array
        const likesArr = likes;
        const likesTemp = likesArr.filter((data) => data !== user.handleUn);
        setLikes(likesTemp);
        // remove value from fire array
        const fireArr = fire;
        const fireTemp = fireArr.filter((data) => data !== user.handleUn);
        setFire(fireTemp);
        // remove value from wow array
        const wowArr = wow;
        const wowTemp = wowArr.filter((data) => data !== user.handleUn);
        setWow(wowTemp);
        // remove value from dislikes array
        const dislikesArr = dislikes;
        const dislikesTemp = dislikesArr.filter(
          (data) => data !== user.handleUn
        );
        setDislikes(dislikesTemp);
        setFunny((prev) => [...prev, user.handleUn]);
      }
    }
    // fire
    else if (value === "fire") {
      if (fire.includes(user.handleUn)) {
        const arr = fire;
        const temp = arr.filter((data) => data !== user.handleUn);
        setFire(temp);
      } else {
        // remove value from likes array
        const likesArr = likes;
        const likesTemp = likesArr.filter((data) => data !== user.handleUn);
        setLikes(likesTemp);
        // remove value from funny array
        const funnyArr = funny;
        const funnyTemp = funnyArr.filter((data) => data !== user.handleUn);
        setFunny(funnyTemp);
        // remove value from wow array
        const wowArr = wow;
        const wowTemp = wowArr.filter((data) => data !== user.handleUn);
        setWow(wowTemp);
        // remove value from dislikes array
        const dislikesArr = dislikes;
        const dislikesTemp = dislikesArr.filter(
          (data) => data !== user.handleUn
        );
        setDislikes(dislikesTemp);
        setFire((prev) => [...prev, user.handleUn]);
      }
    }
    // wow
    else if (value === "wow") {
      if (wow.includes(user.handleUn)) {
        const arr = wow;
        const temp = arr.filter((data) => data !== user.handleUn);
        setWow(temp);
      } else {
        // remove value from likes array
        const likesArr = likes;
        const likesTemp = likesArr.filter((data) => data !== user.handleUn);
        setLikes(likesTemp);
        // remove value from funny array
        const funnyArr = funny;
        const funnyTemp = funnyArr.filter((data) => data !== user.handleUn);
        setFunny(funnyTemp);
        // remove value from fire array
        const fireArr = fire;
        const fireTemp = fireArr.filter((data) => data !== user.handleUn);
        setFire(fireTemp);
        // remove value from dislikes array
        const dislikesArr = dislikes;
        const dislikesTemp = dislikesArr.filter(
          (data) => data !== user.handleUn
        );
        setDislikes(dislikesTemp);
        setWow((prev) => [...prev, user.handleUn]);
      }
    }
    // dislikes
    else if (value === "dislikes") {
      if (dislikes.includes(user.handleUn)) {
        const arr = dislikes;
        const temp = arr.filter((data) => data !== user.handleUn);
        setDislikes(temp);
      } else {
        // remove value from likes array
        const likesArr = likes;
        const likesTemp = likesArr.filter((data) => data !== user.handleUn);
        setLikes(likesTemp);
        // remove value from funny array
        const funnyArr = funny;
        const funnyTemp = funnyArr.filter((data) => data !== user.handleUn);
        setFunny(funnyTemp);
        // remove value from fire array
        const fireArr = fire;
        const fireTemp = fireArr.filter((data) => data !== user.handleUn);
        setFire(fireTemp);
        // remove value from wow array
        const wowArr = wow;
        const wowTemp = wowArr.filter((data) => data !== user.handleUn);
        setWow(wowTemp);
        setDislikes((prev) => [...prev, user.handleUn]);
      }
    }

    const axios = require("axios");
    const url =
      value === "likes"
        ? `${process.env.REACT_APP_URL_LINK}api/blockcast/message/likes/${id}`
        : value === "funny"
        ? `${process.env.REACT_APP_URL_LINK}api/blockcast/message/funny/${id}`
        : value === "fire"
        ? `${process.env.REACT_APP_URL_LINK}api/blockcast/message/fire/${id}`
        : value === "wow"
        ? `${process.env.REACT_APP_URL_LINK}api/blockcast/message/wow/${id}`
        : `${process.env.REACT_APP_URL_LINK}api/blockcast/message/dislikes/${id}`;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/message/${value}/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {!messageData.isDelete && (
        <div className='feed_msg_card'>
          {openDeleteModal && (
            <CustomModal
              onClose={onClose}
              title='Delete message'
              body='Do you want to delete this message'
              footer={
                <button
                  className='modal_footer_btn'
                  onClick={handleDeleteMessage}>
                  Delete
                </button>
              }
            />
          )}

          {/* Message content header */}
          {messageData.content && (
            <div className='feed_msg_header'>
              <span className='msg_content_text'>
                {messageData.content || ""}
              </span>
            </div>
          )}

          {/* Message body */}
          <div className='feed_msg_body'>
            {messageData.m_u_dun === user.handleUn ? (
              <Menu
                menuButton={
                  <MenuButton className={"feed_message_body_menu_btn"}>
                    <FiMoreVertical />
                  </MenuButton>
                }>
                <MenuItem
                  id='hide'
                  className={"social_post_menu_item delete"}
                  onClick={() => handleDeleteOpenModal(messageData.m_id)}>
                  Delete
                </MenuItem>
              </Menu>
            ) : (
              <button className={"feed_message_body_menu_btn"}>
                <AiOutlineGift />
              </button>
            )}
            {messageData.image.split(".").includes("mp4") ? (
              <video className='message_body_image' controls>
                <source src={messageData.image} type='video/mp4' />
              </video>
            ) : (
              <img src={messageData.image} className='message_body_image' />
            )}
          </div>
          <div className='message_btn_footer'>
            <div className='emoji_btns_section'>
              <button
                className='msg_emoji_btn'
                onClick={() => handleEmojiLike("likes", messageData.m_id)}>
                <img src={Heart} className='msg_emoji_img' />
                <br />
                <span className='emoji_like_count'>{likes.length}</span>
              </button>

              <button
                className='msg_emoji_btn'
                onClick={() => handleEmojiLike("funny", messageData.m_id)}>
                <img src={Emoji} className='msg_emoji_img' />
                <br />
                <span className='emoji_like_count'>{funny.length}</span>
              </button>

              <button
                className='msg_emoji_btn'
                onClick={() => handleEmojiLike("fire", messageData.m_id)}>
                <img src={Fire} className='msg_emoji_img' />
                <br />
                <span className='emoji_like_count'>{fire.length}</span>
              </button>

              <button
                className='msg_emoji_btn'
                onClick={() => handleEmojiLike("wow", messageData.m_id)}>
                <img src={Surprised} className='msg_emoji_img' />
                <br />
                <span className='emoji_like_count'>{wow.length}</span>
              </button>

              <button
                className='msg_emoji_btn'
                onClick={() => handleEmojiLike("dislikes", messageData.m_id)}>
                <img src={Unlike} className='msg_emoji_img' />
                <br />
                <span className='emoji_like_count'>{dislikes.length}</span>
              </button>
            </div>

            <button className='feed_emoji_btn'>
              <AiOutlineStop />
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  blockCast: state.blockCast.blockCast,
  pinnedMessage: state.blockCast.pinnedMessage,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMessages: (data) => dispatch(newMessages(data)),
  setPinnedMessage: (data) => dispatch(setPinnedMessage(data)),
  setRemovePinnedMessage: (data) => dispatch(setRemovePinnedMessage(data)),
  removeMessage: (data) => dispatch(removeMessage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockMessage);
{
  /* <span className='event_time'>
  {timeDifference(new Date(), new Date(event.createdAt))}
</span>; */
}
