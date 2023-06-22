/** @format */

import React from "react";
import { connect } from "react-redux";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserAvatar from "../../Assets/userAvatar.webp";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import CustomModal from "../modal/CustomModal";
import {
  updateMessage,
  saveMessage,
  removeMessage,
  deleteMessage,
  likeMessage,
  removeLikeMessage,
} from "../../redux/message/message.actions";
import { HiReply } from "react-icons/hi";
import Typing from "../../Assets/typing.gif";
const MessageBody = ({
  setChatData,
  data,
  user,
  token,
  setUpdatedMessage,
  saveMessage,
  save,
  removeMessage,
}) => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openSaveModal, setOpenSaveModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);

  const [editContent, setEditContent] = React.useState("");
  const [msgId, setMsgId] = React.useState("");

  // *** Handle open EDIT modal
  const handleOpenEditModal = (id, msg) => {
    setOpenEditModal(true);
    setMsgId(id);
    setEditContent(msg);
  };
  const handleEditMessage = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      content: editContent,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/edit/message/${msgId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUpdatedMessage(result);
        setOpenEditModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Handle open Delete modal
  const handleOpenDeleteModal = (id) => {
    // alert(id)
    setOpenDeleteModal(true);
    setMsgId(id);
  };
  const handleDelete = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/delete/message/${msgId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUpdatedMessage(result);
      })
      .catch((error) => console.log("error", error));
  };

  const handleSaveModal = () => {
    if (!save.includes(msgId)) {
      saveMessage(msgId);
    } else {
      removeMessage(msgId);
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/save/message/${msgId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUpdatedMessage(result);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Handle open SAVE modal
  const handleOpenSaveModal = (id) => {
    setOpenSaveModal(true);
    setMsgId(id);
  };

  // *** Handle close modal
  const onClose = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setOpenSaveModal(false);
    setMsgId("");
  };

  React.useEffect(() => {
    if (!editContent.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [editContent]);

  const handleLikeMessage = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      content: "Changed message",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/like/message/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUpdatedMessage(result);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      {!data.isDelete && (
        <React.Fragment>
          <div
            className={
              user.handleUn === data.c_u_dun
                ? "message_cad same_sender"
                : "message_cad __other_sender"
            }>
            {user.handleUn === data.c_u_dun ? (
              <div className='same_sender_message_body_content_container'>
                {data.content}
                <img src={data.image} className='message_content_image' />
              </div>
            ) : (
              <div className='other_sender_message_body_content_container'>
                {data.content}
                <img src={data.image} className='message_content_image' />
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  save: state.message.save,
});

const mapDispatchToProps = (dispatch) => ({
  setUpdatedMessage: (data) => dispatch(updateMessage(data)),
  saveMessage: (data) => dispatch(saveMessage(data)),
  removeMessage: (data) => dispatch(removeMessage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageBody);
