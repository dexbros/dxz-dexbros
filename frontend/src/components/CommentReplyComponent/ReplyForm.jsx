/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import { ImSpinner } from "react-icons/im";
import { GrSend } from "react-icons/gr";
import { putReplyLast } from "../../redux/reply/reply.actions";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";

import { appendReply } from "../../redux/_post/postSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import { handleReplyComment } from "../../redux/_post/postSlice";

const ReplyForm = ({ cmntId, putReplyLast, setReplyCount }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  useSocket();
  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);

  React.useEffect(() => {
    if (!text.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [text]);

  // *** Handle comment reply
  const handleReply = async () => {
    setIsLoading(true);

    const data = { text, token, cmntId };
    const replyData = await dispatch(handleReplyComment(data));
    dispatch(appendReply(replyData.data.reply));
    setIsLoading(false);
    setText("");
    setIsDisable(true);
    if (replyData.data.notificationData) {
      socket.emit("notification receive", replyData.data);
    } else {
      console.log(result);
    }
  };

  return (
    <div className='reply_form_container'>
      <input
        type='text'
        placeholder='Reply'
        className='__input_field'
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 100))}
      />
      {!isDisable && (
        <button className='reply_btn' onClick={handleReply}>
          {isLoading ? (
            <div className='reply_spinner_icon'></div>
          ) : (
            <GrSend className='reply_icon' />
          )}
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putReplyLast: (data) => dispatch(putReplyLast(data)),
});

export default ReplyForm;
