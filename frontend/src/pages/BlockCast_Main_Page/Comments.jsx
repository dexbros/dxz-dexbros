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

const CommentsPage = ({
  token,
  selectMessage,
  setPageType,
  updatedBlock,
  comments,
  addComments,
  newComments,
  selectBlock,
  user,
  blockCast,
}) => {
  const { id } = useParams();
  const [blockData, setBlockData] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  // who can send messages in blockcast channel
  const [privacy, setPrivacy] = React.useState("");

  console.log(">>> ", blockCast);
  useSocket();

  React.useEffect(() => {
    socket
      .off("block comment received")
      .on("block comment received", (newMessage) => {
        console.log(newMessage);
        addComments(newMessage);
      })
      .on("typing", () => setIsTyping(true))
      .on("stop typing", () => setIsTyping(false));
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
        console.log(result);
        addComments(result);
        setMessage("");
        setPrevImage("");
        setImage("");
        setGif("");
        socket.emit("block comment", result);
      })
      .catch((error) => console.log("error", error));
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
        console.log(response.data);
        setBlockData(response.data);
        selectBlockcast(response.data);
        setPrivacy(response.data.chnl_view);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchData(id);
  }, [id, updatedBlock]);

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
        console.log(response.data);
        newComments(response.data.sort((a, b) => a.c_t - b.c_t));
        socket.emit("join block", id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchComments();
  }, [id, selectMessage]);

  const closePreviewImage = () => {
    setPrevImage("");
    setImage("");
  };

  const handleMessageInput = (e) => {
    setMessage(e.target.value.slice(0, 400));
    // if (!typing) {
    //   setTyping(true);
    //   socket.emit("typing", id);
    // }
    // var lastTimeType = new Date().getTime();
    // var timeLength = 3000;
    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTimeType;
    //   if (timeDiff > timeLength) {
    //     socket.emit("stop typing", id);
    //     setTyping(false);
    //   }
    // }, timeLength);
  };

  return (
    <React.Fragment>
      {blockData ? (
        <div className='chat_container'>
          {/* Message body */}
          <div className='chat_body'>
            {(comments || []).length > 0 ? (
              <>
                {comments.map((comment) => (
                  <MessageBody key={comment.c_id} data={comment} />
                ))}
              </>
            ) : (
              <div className='empty_msg'>This blockcast has no message</div>
            )}
          </div>

          {/* Message form field */}
          {selectBlock.block && selectBlock.block.includes(user.handleUn) ? (
            <div className='chat_form_container block_chat_form_container'>
              You are blocked by the creator
            </div>
          ) : (
            <React.Fragment>
              {user.handleUn === blockData.b_c_un ? (
                <div className='chat_form_container'>
                  {openEmoji && (
                    <div className='chat_emoji_section' ref={menuRef}>
                      <EmojiPicker />
                    </div>
                  )}
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
                  <div className='chat_footer_form'>
                    <input
                      type='text'
                      placeholder='Enter your message here'
                      className='chat_form_input'
                      value={message}
                      onChange={(e) => handleMessageInput(e)}
                    />
                    <button
                      className='form_icon_btn'
                      onClick={() => setOpenEmoji(true)}>
                      <span class='icon-emogy'></span>
                    </button>

                    <label htmlFor='file'>
                      <GalleryIcon className='form_icon file_icon' />
                    </label>
                    <input
                      type='file'
                      id='file'
                      className='file_input'
                      onChange={(e) => handleImageChange(e)}
                    />

                    <button className='form_icon_btn'>
                      <AiOutlineGif className='form_icon' />
                    </button>

                    <button className='send_btn' onClick={handleSubmitComment}>
                      <span class='icon-send_one'></span>
                    </button>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  {privacy === "all" ? (
                    <div className='chat_form_container'>
                      {openEmoji && (
                        <div className='chat_emoji_section' ref={menuRef}>
                          <EmojiPicker />
                        </div>
                      )}
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
                      <div className='chat_footer_form'>
                        <input
                          type='text'
                          placeholder='Enter your message here'
                          className='chat_form_input'
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
                          <AiOutlineGif className='form_icon' />
                        </button>

                        <button
                          className='send_btn'
                          onClick={handleSubmitComment}>
                          <span class='icon-send_one'></span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <React.Fragment>
                      {privacy === "mem" ? (
                        <>
                          {blockData.mem.includes(user.handleUn) ? (
                            <div className='chat_form_container'>
                              {openEmoji && (
                                <div
                                  className='chat_emoji_section'
                                  ref={menuRef}>
                                  <EmojiPicker />
                                </div>
                              )}
                              {prevImage && (
                                <div className='chat_image_container'>
                                  <img
                                    src={prevImage}
                                    className='chat_prevImage'
                                  />
                                  <button
                                    className='message_prev_close_btn'
                                    onClick={closePreviewImage}>
                                    <AiOutlineClose />
                                  </button>
                                </div>
                              )}
                              <div className='chat_footer_form'>
                                <input
                                  type='text'
                                  placeholder='Enter your message here'
                                  className='chat_form_input'
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
                                  <AiOutlineGif className='form_icon' />
                                </button>

                                <button
                                  className='send_btn'
                                  onClick={handleSubmitComment}>
                                  <span class='icon-send_one'></span>
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      ) : (
        <ChatSkeleton />
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
  updatedBlock: state.blockCast.updatedBlock,
  comments: state.blockCast.comments,
  selectMessage: state.message.selectMessage,
  selectBlock: state.blockCast.selectBlock,
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
});
export default connect(mapStateToProps, mapDispatchToProps)(CommentsPage);
