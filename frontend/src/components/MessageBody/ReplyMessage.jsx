import React from 'react';
import { connect } from "react-redux";
import UserAvatar from "../../Assets/userAvatar.webp";
import { AiOutlineClose } from "react-icons/ai";
import { useParams } from 'react-router';
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

const ReplyMessage = ({ chatData, setChatData, token, addComments }) => {
  const { id } = useParams();
  const [message, setMessage] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  useSocket();

  const handleSubmitComment = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "message": message,
      "content": chatData.content,
      "fn": chatData.c_u_fn,
      "ln": chatData.c_u_ln,
      "image": chatData.image,
      "gif": chatData.gif
    });

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/comment/reply/${id}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        addComments(response.data);
        setChatData(null);
        setMessage("")
        socket.emit("block comment", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  React.useEffect(() => {
    if (!message.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [message])
  return (
    <div className='reply_msg_container'>
      {/* Chat Header */}
      <div className='reply_msg_header'>
        <div className='message_user_info'>
          <img
            src={chatData.c_u_pic || UserAvatar}
            className='message_avatar'
          />
          <span className='sender_name'>
            {chatData.c_u_fn} {chatData.c_u_ln}
          </span>
        </div>
        <button onClick={() => setChatData(null)}>
          <AiOutlineClose />
        </button>
      </div>

      <div className='message_body_section'>
        <span className='message_body_text'>{chatData.content}</span>
        {chatData.image && (
          <div className='message_body_image_container'>
            <img
              src={chatData.image}
              alt=''
              srcset=''
              className='message_body_image'
            />
          </div>
        )}
        {chatData.gif && (
          <div className='message_body_image_container'>
            <img
              src={chatData.gif}
              alt=''
              srcset=''
              className='message_body_image'
            />
          </div>
        )}
      </div>

      <div className='reply_footer_container'>
        <input
          type='text'
          placeholder='Enter your message here'
          className='chat_form_input'
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 400))}
        />
        {!isDisable && (
          <button className='send_btn' onClick={handleSubmitComment}>
            <span class='icon-send_one'></span>
          </button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  save: state.message.save
});

const mapDispatchToProps = (dispatch) => ({
  addComments: (data) => dispatch(addComments(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReplyMessage);