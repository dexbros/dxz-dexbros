/** @format */

import React from "react";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import {
  setBlockCast,
  newMessages,
  addMessage,
} from "../../redux/block/block.action";
import BlockMessage from "../../components/BlockMessage/BlockMessage";
import { Link, useParams } from "react-router-dom";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";
import {
  AiOutlinePlusCircle,
  AiOutlineCloudUpload,
  AiOutlineClose,
} from "react-icons/ai";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CustomPostFormModal from "../../components/modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
var selectedChat;

const CastFeed = ({
  token,
  user,
  setBlockCast,
  newMessages,
  messages,
  addMessage,
  pinnedMessage,
  selectBlock,
  updatedBlock,
  blockCast,
}) => {
  const [input, setInput] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const { id } = useParams();
  const [message, setMessage] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [imageModal, setImageModal] = React.useState(false);
  const [isDisableBtn, setIsDisableBtn] = React.useState(true);
  const [videoModal, setVideoModal] = React.useState(false);
  const [isVideoBtnDisable, setIsVideoBtnDisable] = React.useState(true);
  const [video, setVideo] = React.useState("");
  const [errmsg, setErrmsg] = React.useState("");
  const [chats, setChats] = React.useState([]);

  useSocket();

  React.useEffect(() => {
    // console.log("Socket")
    // join block
  }, [isSocketConnected]);

  const changeInputHandle = (e) => {
    setInput(e.target.value.slice(0, 200));
  };

  React.useEffect(() => {
    if (!message.trim()) {
      if (!image) {
        setIsDisable(true);
      } else {
        setIsDisable(false);
      }
    } else {
      setIsDisable(false);
    }
  }, [message, image]);

  // *** Submit message
  const submitMessage = () => {
    setIsLoading(true);
    setIsDisable(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("content", message);
    formdata.append("gif", gif);
    formdata.append("image", image);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/message/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setChats((prev) => [result, ...prev]);
        addMessage(result);
        setMessage("");
        setImage("");
        setPrevImage("");
        // setIsDisable(true);
        socket.emit("block message", result);
        scrollToBottom();
        setIsLoading(false);
        setImageModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  const submitVideoMessage = () => {
    setIsVideoBtnDisable(true);
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("content", message);
    formdata.append("gif", gif);
    formdata.append("image", video);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/message/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setChats((prev) => [result, ...prev]);
        addMessage(result);
        setMessage("");
        setImage("");
        setPrevImage("");
        setVideo("");
        setIsLoading(false);
        socket.emit("block message", result);
        scrollToBottom();
        setIsLoading(false);
        setVideoModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchMessages = () => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/message/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        newMessages(response.data.sort((a, b) => a.c_t - b.c_t));
        setChats(response.data.sort((a, b) => a.c_t - b.c_t));
        // join block
        socket.emit("join block", id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchMessages();
    scrollToBottom();

    selectedChat = id;
  }, [id, pinnedMessage]);

  React.useEffect(() => {
    socket
      .off("block message received")
      .on("block message received", (newMessage) => {
        // console.log(newMessage)
        if (!selectedChat || selectedChat !== newMessage.chatId) {
          // Notification
        } else {
          addMessage(newMessage);
        }
      });
  });

  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setOpenEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const closePreviewImage = () => {
    setPrevImage("");
    setImage("");
    setIsDisableBtn(true);
  };

  const closePreviewVideo = () => {
    setPrevImage("");
    setVideo("");
    setIsVideoBtnDisable(true);
  };

  const handleImageChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
    setIsDisableBtn(false);
  };

  const handleVideoChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setVideo(e.target.files[0]);

    if (e.target.files[0].size > 76219913) {
      setIsVideoBtnDisable(true);
      setErrmsg("Too big file size");
    } else {
      setIsVideoBtnDisable(false);
      setErrmsg("");
    }
  };

  const fetchData = (id) => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        // return response.data;
        setBlockCast(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchData(id);
    scrollToBottom();
  }, [id, updatedBlock]);

  const messagesEndRef = React.useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const onClose = () => {
    setImageModal(false);
    setVideoModal(false);
  };

  return (
    <React.Fragment>
      {blockCast && (
        <div className='blockcast_feed_container'>
          {/* Message body container */}
          {/* Image upload modal */}
          {imageModal && (
            <CustomPostFormModal
              onClose={onClose}
              title={
                <div className='feed_msg_modal_title_section'>
                  <button className='feed_msg_modal_btn' onClick={onClose}>
                    <BiArrowBack />
                  </button>
                  <div className='feed_msg_modal_title'>Image upload</div>
                </div>
              }
              body={
                <React.Fragment>
                  {prevImage ? (
                    <div className='image_preview_box'>
                      <img src={prevImage} className='preview_image_feed' />
                      <button className='close_btn' onClick={closePreviewImage}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  ) : (
                    <div className='feed_modal_body'>
                      <label
                        htmlFor='feed_img'
                        className='modal_upload_icon_section'>
                        <AiOutlineCloudUpload className='modal_upload_icon' />
                      </label>
                      <input
                        type='file'
                        className='image_file'
                        id='feed_img'
                        onChange={(e) => handleImageChange(e)}
                        accept='image/png, image/gif, image/jpeg'
                      />
                    </div>
                  )}

                  <textarea
                    type='text'
                    placeholder='Enter your thought..'
                    className='auth_input'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </React.Fragment>
              }
              footer={
                <div className='feed_modal_footer'>
                  {!isDisableBtn ? (
                    <button
                      className='message_send_btn'
                      onClick={submitMessage}>
                      Send
                    </button>
                  ) : (
                    <button className='message_send_btn disable_message_send_btn'>
                      {isLoading ? (
                        <ImSpinner2 className='message_spinner' />
                      ) : (
                        <>Send</>
                      )}
                    </button>
                  )}
                </div>
              }
            />
          )}

          {/* Video upload modal */}
          {videoModal && (
            <CustomPostFormModal
              onClose={onClose}
              title={
                <div className='feed_msg_modal_title_section'>
                  <button className='feed_msg_modal_btn' onClick={onClose}>
                    <BiArrowBack />
                  </button>
                  <div className='feed_msg_modal_title'>Video upload</div>
                </div>
              }
              body={
                <React.Fragment>
                  {prevImage ? (
                    <div className='image_preview_box'>
                      <video className='preview_image_feed' controls>
                        <source src={prevImage} type='video/mp4' />
                      </video>
                      <button className='close_btn' onClick={closePreviewVideo}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  ) : (
                    <div className='feed_modal_body'>
                      <label
                        htmlFor='feed_img'
                        className='modal_upload_icon_section'>
                        <AiOutlineCloudUpload className='modal_upload_icon' />
                      </label>
                      <input
                        type='file'
                        className='image_file'
                        id='feed_img'
                        onChange={(e) => handleVideoChange(e)}
                        accept='video/*'
                      />
                    </div>
                  )}

                  <textarea
                    type='text'
                    placeholder='Enter your thought..'
                    className='auth_input'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </React.Fragment>
              }
              footer={
                <div className='feed_modal_footer'>
                  {!isVideoBtnDisable ? (
                    <button
                      className='message_send_btn'
                      onClick={submitVideoMessage}>
                      Send
                    </button>
                  ) : (
                    <button className='message_send_btn disable_message_send_btn'>
                      {isLoading ? (
                        <ImSpinner2 className='message_spinner' />
                      ) : (
                        <>Send</>
                      )}
                    </button>
                  )}
                  <span className='err_msg_footer'>{errmsg}</span>
                </div>
              }
            />
          )}

          <div
            className={
              selectBlock.b_c_un === user.handleUn
                ? "my_block_message_body_container"
                : "message_body_container"
            }>
            {(messages || []).length > 0 ? (
              <>
                {messages.map((message) => (
                  <BlockMessage key={message.m_id} messageData={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className='empty_msg_box'>No message found</div>
            )}
          </div>
          {blockCast.b_c_un === user.handleUn && (
            <div className='message_footer_container'>
              <Menu
                menuButton={
                  <MenuButton className={"blockcast_feed_action_btn"}>
                    <AiOutlinePlusCircle />
                  </MenuButton>
                }>
                <MenuItem
                  id='hide'
                  className={"social_post_menu_item"}
                  onClick={() => setImageModal(true)}>
                  <>Image</>
                </MenuItem>
                <MenuItem
                  id='hide'
                  className={"social_post_menu_item"}
                  onClick={() => setVideoModal(true)}>
                  <>Video</>
                </MenuItem>
              </Menu>
            </div>
          )}
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
  messages: state.blockCast.messages,
  pinnedMessage: state.blockCast.pinnedMessage,
  selectBlock: state.blockCast.selectBlock,
  updatedBlock: state.blockCast.updatedBlock,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMessages: (data) => dispatch(newMessages(data)),
  addMessage: (data) => dispatch(addMessage(data)),
  setBlockCast: (data) => dispatch(setBlockCast(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CastFeed);
