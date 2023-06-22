import React from 'react';
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import { setNewPinnedPost } from "../../redux/post/post.actions";
import MyModal from "../modal/MyModal";
import "./CommentReply.css"

const CommentReply = ({ commentId, postId, firstName, lastName, token, user, reports, setPinnedPost, handleUn }) => {
  const [showTag, setShowTag] = React.useState(true);
  const [text, setText] = React.useState("");
  const [showIcons, setShowIcons] = React.useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  }

  const inputKeyDown = (e) => {
    if (e.keyCode == 8 && text.length === 0) {
      setShowTag(false);
    }
  }

  const submitReplies = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "postId": postId,
      "content": text,
      "repliedUserFirstName": firstName,
      "repliedUserLastName": lastName,
      "repliedUserUserName": handleUn
    });

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/${commentId}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data);
        setText("");
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  return (
    <div className='comment_reply_container' onFocus={() => setShowIcons(true)}>
      {
        showTag &&
        <span className='user_tag'>{firstName} {" "} {lastName}</span>
      }

      <input
        type="text"
        placeholder='Reply'
        className={showTag ? 'reply_input_field' : 'reply_input_field nomal_input'}
        value={text}
        onChange={e => handleTextChange(e)}
        onKeyDown={(e) => inputKeyDown(e)}
      />
      {
        showIcons &&
        <div className='reply_cmnt_icons_container'>
            <div className='reply_icons'></div>

            <button className='reply_btn' onClick={submitReplies}>Send</button>
            <button className='close_reply_btn' onClick={() => setShowIcons(false)}>close</button>
        </div>
      }
    </div>
  )
}
const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  letePost: (post) => dispatch(deletePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentReply);
// PostCommentReplies
