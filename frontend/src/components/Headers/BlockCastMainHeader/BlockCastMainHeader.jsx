/** @format */

import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router";
import UserAvatar from "../../../Assets/userAvatar.webp";
import { connect } from "react-redux";
import getUser from "../../../utils/getUser";
import {
  selectBlockcast,
  unselectBlockcast,
} from "../../../redux/block/block.action";
import CustomModal from "../../modal/CustomModal";
import { SiElectron } from "react-icons/si";

const BlockCastMainHeader = ({
  unselectBlockcast,
  selectBlock,
  user,
  token,
  selectBlockcast,
  blockCast,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openMenu, setOpneMenu] = React.useState(false);

  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setOpneMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const backBtn = () => {
    navigate(-1);
  };

  const leaveGroup = (username) => {
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/leave/group/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        selectBlockcast(response.data);
        navigate(`/blockcast/chats`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deletGroup = () => {
    var axios = require("axios");

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/delete/group/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        selectBlockcast(response.data);
        navigate(`/blockcast/chats`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const redirectToSettings = () => {
    // navigate(`/blockcast/main/settings/${id}`);
    navigate(`/group/edit/${id}`);
  };

  const redirectToMainGroup = () => {
    // navigate(`/blockcast/main/settings/${id}`);
    navigate(`/group/${id}`);
  };

  return (
    <div className='blockcast_header_section'>
      <div className='blockcast_info_section'>
        <div className='blockcast_info_section'>
          <button
            className='custom_header_back_button'
            onClick={() => backBtn()}>
            <BiArrowBack />
          </button>
          <img
            src={selectBlock.image ? selectBlock.image : UserAvatar}
            className='header_user_avatar'
          />
          <div className='block_cast_header_text_container'>
            <p className='custom_blockcast_header_title'>{selectBlock.name}</p>
            <br />
            <p className='custom_blockcast_header_des'>
              {selectBlock.des && <>{selectBlock.des.slice(0, 80)}...</>}
            </p>
          </div>
        </div>
        <button
          className='header_menubtn'
          onClick={() => setOpneMenu((p) => !p)}>
          <span class='icon-more'></span>
        </button>

        {openMenu && (
          <div className='header_menu' ref={menuRef}>
            <li
              className='header_menu_list'
              onClick={() => redirectToMainGroup()}>
              Visit block
            </li>
            {selectBlock.b_c_un === user.handleUn && (
              <li
                className='header_menu_list'
                onClick={() => redirectToSettings()}>
                Privacy & Settings
              </li>
            )}

            {selectBlock.b_c_un === user.handleUn && (
              <li
                className='header_menu_list delete_chat'
                onClick={() => deletGroup()}>
                Delete
              </li>
            )}

            {selectBlock.b_c_un !== user.handleUn && (
              <li
                className='header_menu_list delete_chat'
                onClick={() => leaveGroup(user.handleUn)}>
                Leave blockcast
              </li>
            )}
          </div>
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
  blockCast: state.blockCast.blockCast,
  updatedBlock: state.blockCast.updatedBlock,
  selectBlock: state.blockCast.selectBlock,
});
const mapDispatchToProps = (dispatch) => ({
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
  unselectBlockcast: (data) => dispatch(unselectBlockcast(data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockCastMainHeader);
