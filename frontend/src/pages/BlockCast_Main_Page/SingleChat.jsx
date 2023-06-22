/** @format */

import React from "react";
import Layout from "../../layouts/main-layout.component";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { useParams } from "react-router-dom";
import { AiOutlineCamera } from "react-icons/ai";
import "./BlockMain.css";
import { io } from "socket.io-client";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import ChatSkeleton from "../../components/SkeletonLoading/ChatSkeleton";
import { AiOutlineGif } from "react-icons/ai";
import EmojiPicker from "../../components/EmojiPicker/EmojiPicker";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";
import {
  setBlockCast,
  newMessages,
  addMessage,
  addComments,
  newComments,
  updatBlockCast,
  selectBlockcast,
  unselectBlockcast,
} from "../../redux/block/block.action";
import MessageBody from "../../components/MessageBody/MessageBody";
import { AiOutlineClose } from "react-icons/ai";
import CustomModal from "../../components/modal/CustomModal";
import ReplyMessage from "../../components/MessageBody/ReplyMessage";
import { putNotifications } from "../../redux/notification/notification.actions";

const SingleChat = ({
  token,
  selectMessage,
  setPageType,
  updatedBlock,
  comments,
  addComments,
  newComments,
  selectBlock,
  user,
  notifications,
  putNotifications,
}) => {
  const { id } = useParams();
  const [blockData, setBlockData] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [limit, setLimit] = React.useState(10);
  const [gifs, setGifs] = React.useState([]);
  const [openGifModal, setOpenGifModal] = React.useState(false);
  const [chatData, setChatData] = React.useState(null);
  const [isFocus, setIsFocus] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  useSocket();

  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    socket
      .off("block comment received")
      .on("block comment received", (newMessage) => {
        console.log("New message receive");
        addComments(newMessage);
      });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  });

  const handleSubmitComment = () => {
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
      `${process.env.REACT_APP_URL_LINK}api/blockcast/comment/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        addComments(result);
        setMessage("");
        setPrevImage("");
        setImage("");
        setGif("");
        setOpenGifModal(false);
        socket.emit("block comment", result);
        scrollToBottom();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // *** Fetch chat
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
        setBlockData(response.data);
        selectBlockcast(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    // fetchData(id);
  }, [id, updatedBlock]);

  React.useLayoutEffect(() => {
    setPageType("block_cast_single");
  });

  const handleImageChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

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

  const fetchComments = () => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/comment/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        newComments(response.data.sort((a, b) => a.c_t - b.c_t));
        socket.emit("join block", id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchComments();
    scrollToBottom();
  }, [id, selectMessage]);

  const closePreviewImage = () => {
    setPrevImage("");
    setImage("");
    setGif("");
  };

  React.useEffect(() => {
    const cureentColor = localStorage.getItem("chat-color");
    // alert(cureentColor)
    setTheme(cureentColor);
  }, []);

  const setTheme = (color) => {
    document.documentElement.style.setProperty(
      "--chat-body-background-color",
      color
    );
  };

  const addEmoji = (e) => {
    setMessage((prev) => prev + e.native);
  };

  const fetchGifs = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=QtQnZ2h65BcHyuHsQMrYzEzZLg5t8SfE&limit=${limit}&rating=g`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result.data);
        setGifs(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    fetchGifs();
  }, [limit]);

  const onClose = () => {
    setOpenGifModal(false);
  };

  const handleGifSubmit = (url) => {
    setGif(url);
    setOpenGifModal(false);
  };

  const handleMessageInput = (e) => {
    setMessage(e.target.value.slice(0, 400));
    if (!typing) {
      setTyping(true);
      socket.emit("typing", id);
    }
    var lastTimeType = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTimeType;
      if (timeDiff > timeLength) {
        socket.emit("stop typing", id);
        setTyping(false);
      }
    }, timeLength);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <React.Fragment>
      <Layout>
        {openGifModal && (
          <CustomModal
            onClose={onClose}
            title={"Gifs"}
            body={
              <div className='modal_body'>
                <div className='gifs_container'>
                  {gifs.map((data, index) => (
                    <div
                      className='gif_card'
                      onClick={() => handleGifSubmit(data.images.original.url)}>
                      <img
                        src={data.images.original.url}
                        className='gif_image'
                      />
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        )}
        <div className='chat_container'>
          {/* Messages */}
          <div
            className={
              prevImage ? "chat_body" : "chat_body empty_preview_image"
            }>
            {(comments || []).length > 0 ? (
              <>
                {comments.map((comment) => (
                  <MessageBody
                    key={comment.c_id}
                    data={comment}
                    setChatData={setChatData}
                  />
                ))}
                <div ref={messagesEndRef} />
                {/* {typing ? <img src={Typing} className='typing_gif' /> : null} */}
              </>
            ) : (
              <div className='empty_msg'>This blockcast has no message</div>
            )}

            {/* Message Reply container */}
            {chatData && (
              <ReplyMessage chatData={chatData} setChatData={setChatData} />
            )}
          </div>

          {prevImage && (
            <div className='__message_image_container'>
              <img src={prevImage} className='chat_prevImage' />
              <button
                className='__message_prev_close_btn'
                onClick={closePreviewImage}>
                <AiOutlineClose />
              </button>
            </div>
          )}

          {/* Gif */}
          {/* {gif && (
            <div className='chat_image_container'>
              <img src={gif} className='chat_prevImage' />
              <button
                className='message_prev_close_btn'
                onClick={closePreviewImage}>
                <AiOutlineClose />
              </button>
            </div>
          )} */}

          {/* Message form */}
          {!selectBlock.isGroupChat ? (
            <div className='chat_form_footer'>
              {isFocus ? (
                <div className='message_form_container'>
                  <input
                    type='text'
                    placeholder='Message...'
                    className='message_input_form'
                    value={message}
                    onChange={(e) => handleMessageInput(e)}
                  />
                  <button
                    className='form_icon_btn'
                    onClick={() => setOpenEmoji(true)}>
                    <span class='icon-emogy'></span>
                  </button>

                  <label htmlFor='file'>
                    <span class='icon-gallery'></span>
                  </label>
                  <input
                    type='file'
                    id='file'
                    className='file_input'
                    onChange={(e) => handleImageChange(e)}
                  />

                  <button className='form_icon_btn'>
                    <AiOutlineGif
                      className='form_icon'
                      onClick={() => setOpenGifModal(true)}
                    />
                  </button>

                  <button className='send_btn' onClick={handleSubmitComment}>
                    <span class='icon-send_one'></span>
                  </button>
                </div>
              ) : (
                <input
                  type='text'
                  placeholder='Message...'
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  className='message_input_form'
                  value={message}
                />
              )}
            </div>
          ) : (
            <>
              {selectBlock.blockUsers.includes(user.handleUn) ? (
                <div className='chat_form_container block_chat_form_container'>
                  You are blocked by the creator
                </div>
              ) : (
                <div className='chat_form_container'>
                  {/* Emoji container */}
                  {openEmoji && (
                    <div className='chat_emoji_section' ref={menuRef}>
                      <EmojiPicker onEmojiSelect={(e) => addEmoji(e)} />
                    </div>
                  )}

                  {/* Preview image */}
                  {prevImage && (
                    <div className='chat_image_container'>
                      <img src={prevImage} className='chat_prevImage' />
                      <button
                        className='message_prev_close_btn'
                        onClick={closePreviewImage}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  )}

                  {/* Gif */}
                  {gif && (
                    <div className='chat_image_container'>
                      <img src={gif} className='chat_prevImage' />
                      <button
                        className='message_prev_close_btn'
                        onClick={closePreviewImage}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  )}

                  {!selectBlock.blockUsers.includes(user.handleUn) && (
                    <div className='chat_footer_form'>
                      {isFocus ? (
                        <React.Fragment>
                          <input
                            type='text'
                            placeholder='Message'
                            className='chat_form_input'
                            value={message}
                            onChange={(e) =>
                              setMessage(e.target.value.slice(0, 400))
                            }
                          />
                          <button
                            className='form_icon_btn'
                            onClick={() => setOpenEmoji(true)}>
                            <span class='icon-emogy'></span>
                          </button>

                          <label htmlFor='file'>
                            <span class='icon-gallery'></span>
                          </label>
                          <input
                            type='file'
                            id='file'
                            className='file_input'
                            onChange={(e) => handleImageChange(e)}
                          />

                          <button className='form_icon_btn'>
                            <AiOutlineGif
                              className='form_icon'
                              onClick={() => setOpenGifModal(true)}
                            />
                          </button>

                          <button
                            className='send_btn'
                            onClick={handleSubmitComment}>
                            <span class='icon-send_one'></span>
                          </button>
                        </React.Fragment>
                      ) : (
                        <input type='text' placeholder='Enter message' />
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Layout>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  blockCast: state.blockCast.blockCast,
  updatedBlock: state.blockCast.updatedBlock,
  comments: state.blockCast.comments,
  selectMessage: state.message.selectMessage,
  selectBlock: state.blockCast.selectBlock,
  notifications: state.notification.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setBlockCast: (data) => dispatch(setBlockCast(data)),
  updatBlockCast: (data) => dispatch(updatBlockCast(data)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMessages: (data) => dispatch(newMessages(data)),
  addMessage: (data) => dispatch(addMessage(data)),
  addComments: (data) => dispatch(addComments(data)),
  newComments: (data) => dispatch(newComments(data)),
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
  unselectBlockcast: (data) => dispatch(unselectBlockcast(data)),
  putNotifications: (data) => dispatch(putNotifications(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SingleChat);
