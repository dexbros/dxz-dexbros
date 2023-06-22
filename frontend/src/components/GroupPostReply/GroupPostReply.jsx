/** @format */

import React from "react";
import { connect } from "react-redux";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FiMoreHorizontal } from "react-icons/fi";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import CustomSmallModal from "../modal/CustomSmallModal";

const GroupPostReply = ({ user, token, reply, setReplyCount }) => {
  const [replyId, setReplyId] = React.useState(reply.r_id);
  const [content, setContent] = React.useState(reply.content);
  const [firstname, setfirstname] = React.useState(reply.c_fn);
  const [lastname, setLastname] = React.useState(reply.c_ln);
  const [username, setusername] = React.useState(reply.c_un);
  const [image, setimage] = React.useState(reply.c_pi);
  const [time, setTime] = React.useState(reply.c_t);
  const [isDelete, setIsDelete] = React.useState(reply.delete);
  const [likes, setLikes] = React.useState(reply.likes);
  const [dislikes, setDislikes] = React.useState(reply.dislikes);
  const [spam, setSpam] = React.useState(reply.spam);

  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [text, setText] = React.useState("");

  // *** Handle open Delete modal
  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setReplyId(id);
  };

  // *** Handle delete reply id
  const handleDeleteReply = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/delete/${replyId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setIsDelete(true);
        setOpenDeleteModal(false);
        setReplyCount((prev) => prev - 1);
      })
      .catch((error) => console.log("error", error));
  };

  const onClose = () => {
    setOpenDeleteModal(false);
    setOpenEditModal(false);
  };

  // *** Handle open Edit modal
  const handleEditModal = (reply) => {
    alert(replyId);
    setOpenEditModal(true);
    setText(reply.content);
  };

  // Handle edit reply
  const handleEditReply = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      text: text,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/edit/${replyId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setContent(text);
        setOpenEditModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  // handle spam reply
  const handleSpam = () => {
    if (spam.includes(user.handleUn)) {
      const arr = spam;
      const temp = arr.filter((data) => data !== user.handleUn);
      setSpam(temp);
    } else {
      setSpam((prev) => [...prev, user.handleUn]);
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      text: "updated",
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/spam/${replyId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  // handle like reply
  const handleLike = () => {
    if (dislikes.includes(user.handleUn)) {
      const arr = dislikes;
      const temp = arr.filter((data) => data !== user.handleUn);
      setDislikes(temp);
      setLikes((prev) => [...prev, user.handleUn]);
    } else {
      if (likes.includes(user.handleUn)) {
        const arr = likes;
        const temp = arr.filter((data) => data !== user.handleUn);
        setLikes(temp);
      } else {
        setLikes((prev) => [...prev, user.handleUn]);
      }
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      text: "updated",
    });
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/like/${replyId}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  const handleDislike = () => {
    if (likes.includes(user.handleUn)) {
      const arr = likes;
      const temp = arr.filter((data) => data !== user.handleUn);
      setLikes(temp);
      setDislikes((prev) => [...prev, user.handleUn]);
    } else {
      if (dislikes.includes(user.handleUn)) {
        const arr = dislikes;
        const temp = arr.filter((data) => data !== user.handleUn);
        setDislikes(temp);
      } else {
        setDislikes((prev) => [...prev, user.handleUn]);
      }
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      text: "updated",
    });
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/dislike/${replyId}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      {!isDelete && (
        <div className='block_reply_card'>
          {/* Delete modal */}
          {openDeleteModal && (
            <CustomSmallModal
              title='Delete reply'
              onClose={onClose}
              body={
                <div className='comment_edit_container'>
                  Do you want to delete this reply?
                </div>
              }
              footer={
                <div>
                  <button className='update_btn' onClick={handleDeleteReply}>
                    Delete
                  </button>
                </div>
              }
            />
          )}

          {/* Edit modal */}
          {openEditModal && (
            <CustomSmallModal
              title='Edit reply'
              onClose={onClose}
              body={
                <div className='comment_edit_container'>
                  <textarea
                    placeholder='Update reply'
                    className='modal_textarea'
                    value={text}
                    onChange={(e) =>
                      setText(e.target.value.slice(0, 50))
                    }></textarea>
                </div>
              }
              footer={
                <div>
                  <button className='update_btn' onClick={handleEditReply}>
                    Update
                  </button>
                </div>
              }
            />
          )}

          {/* Header */}
          <div className='block_reply_header'>
            {/* info */}
            <div className='block_reply_info'>
              <img
                src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${image}`}
                className='reply_avatar'
              />
              <span className='reply_user_name'>
                {firstname} {lastname}
              </span>
              <span className='reply_user_username'>@{username}</span>
            </div>

            {user.handleUn === username && (
              <Menu
                menuButton={
                  <MenuButton className={"__menu_btn"}>
                    <FiMoreHorizontal />
                  </MenuButton>
                }>
                <MenuItem
                  className={"block_post_menuItem"}
                  onClick={() => handleEditModal(reply)}>
                  Edit
                </MenuItem>
                <MenuItem
                  className={"block_post_menuItem"}
                  onClick={() => handleOpenDeleteModal(reply.r_id)}>
                  Delete
                </MenuItem>
              </Menu>
            )}
          </div>

          {/* Body */}
          <div className='reply_content'>{content}</div>

          {/* Footer */}
          <div className='reply_block_footer'>
            <button className='block_reply_footer_btn' onClick={handleLike}>
              {likes.includes(user.handleUn) ? (
                <AiFillLike />
              ) : (
                <AiOutlineLike />
              )}{" "}
              {likes.length}
            </button>
            <button className='block_reply_footer_btn' onClick={handleDislike}>
              {dislikes.includes(user.handleUn) ? (
                <AiFillDislike />
              ) : (
                <AiOutlineDislike />
              )}{" "}
              {dislikes.length}
            </button>
            <button className='block_reply_footer_btn' onClick={handleSpam}>
              {spam.includes(user.handleUn) ? <RiSpam2Fill /> : <RiSpam2Line />}{" "}
              {spam.length}
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
});

export default connect(mapStateToProps, null)(GroupPostReply);
