/** @format */

import React from "react";
import UserAvatar from "../../Assets/userAvatar.webp";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectBlockcast,
  unselectBlockcast,
} from "../../redux/block/block.action";
import { chatLoggedUser } from "../../utils/checkLogginUserChat";

const ChatList = ({ data, selectBlockcast, unselectBlockcast, user }) => {
  const history = useNavigate();
  console.log(data);

  const handleRedirect = (data) => {
    selectBlockcast(data);
    history("/blockcast/single/" + data.b_id);
  };

  return (
    <React.Fragment>
      {data.isGroupChat ? (
        <React.Fragment>
          {!data.isDelete && (
            <div
              className={
                data.isGroupChat
                  ? "chat_list_card group_chat"
                  : "chat_list_card"
              }
              onClick={() => handleRedirect(data)}>
              <img src={UserAvatar} className='chat_avatar' />
              <div className='chat_info'>
                <span className='chat_name'>{data.name}</span>
                <br />
                <>
                  {data.lstMsg && (
                    <span className='chat_descripton'>
                      {data.lstMsg.slice(0, 60)}...
                    </span>
                  )}
                </>
              </div>
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {!data.isDelete && (
            <div
              className={data.isGroup ? "chat_list_card" : "chat_list_card"}
              onClick={() => handleRedirect(data)}>
              <img
                src={chatLoggedUser(data, user).profilePicture || UserAvatar}
                className='chat_avatar'
              />
              <div className='chat_info'>
                <span className='chat_name'>
                  {chatLoggedUser(data, user).name}
                </span>
                <br />
                <>
                  {data.latestMsg && (
                    <span className='chat_descripton'>
                      {data.latestMsg.slice(0, 60)}...
                    </span>
                  )}
                </>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  blockCast: state.blockCast.blockCast,
  updatedBlock: state.blockCast.updatedBlock,
});
const mapDispatchToProps = (dispatch) => ({
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
  unselectBlockcast: (data) => dispatch(unselectBlockcast(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
