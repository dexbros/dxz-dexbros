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
import { chatLoggedUser } from "../../../utils/checkLogginUserChat";

const colors = [
  "linear-gradient(to right, #457fca, #5691c8)",
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(to top, #88d3ce 0%, #6e45e2 100%)",
  "linear-gradient(to top, #0c3483 0%, #a2b6df 100%, #6b8cce 100%, #a2b6df 100%)",
  "linear-gradient(60deg, #29323c 0%, #485563 100%)",
];

const SingleChatHeader = ({
  unselectBlockcast,
  selectBlock,
  user,
  token,
  selectBlockcast,
}) => {
  console.log(selectBlock);
  const { id } = useParams();
  // const navgate = useNavigate();
  const [openMenu, setOpneMenu] = React.useState(false);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [showUserList, setShowUserList] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openColorModal, setOpenColorModal] = React.useState(false);

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
    // unselectBlockcast(null)
  };

  const handleToViewProfile = () => {
    // console.log()
    navigate(`/user/profile/${getUser(selectBlock.mem, user.handleUn)}`);
  };

  // *** close modal
  const onClose = () => {
    setOpenModal(false);
    setSearchKey("");
    setUsers([]);
    setOpenColorModal(false);
  };

  const handleToViewSettings = () => {
    navigate(`/blockcast/single/settings/${selectBlock.b_id}`);
  };

  // *** Search user
  const searchUser = (e) => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/search/user?search=${e.target.value}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.user);
        setUsers(result.user);
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const userMenuRef = React.useRef();
  const closeMenu = (event) => {
    if (!userMenuRef.current.contains(event.target)) {
      // setShowCrypto(false);
      setShowUserList(false);
    } else {
      setShowUserList(true);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", closeMenu);

    return () => document.removeEventListener("mousedown", closeMenu);
  });

  const addNewMember = (username) => {
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/add/member/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        selectBlockcast(response.data);
        setName("");
        setShowUserList(false);
        setOpenModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
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

  const handleBlock = () => {
    // setOpenBlockModal(true);
    fetchBlockUsers();
  };

  React.useEffect(() => {
    const cureentColor = localStorage.getItem("chat-color");
    setTheme(cureentColor);
  }, []);

  const setTheme = (color) => {
    document.documentElement.style.setProperty(
      "--chat-body-background-color",
      color
    );
  };

  const setColor = (e) => {
    const currentColor = e.target.id;
    setTheme(currentColor);
    localStorage.setItem("chat-color", currentColor);
    setOpenColorModal(false);
  };

  return (
    <div className='blockcast_header_section'>
      {/* Add new user to group */}
      {openModal && (
        <CustomModal
          onClose={onClose}
          title='Add new user'
          body={
            <div className='modal_form_body'>
              <input
                type='text'
                placeholder='Enter block name(required)'
                className='modal_search_input'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => searchUser(e)}
                onFocus={() => setShowUserList(true)}
              />
              {showUserList && (
                <div className='search_user_list' ref={userMenuRef}>
                  {isLoading ? (
                    <div className='users_lists_loader'>
                      <span class='icon-loading spinner'></span>
                    </div>
                  ) : (
                    <div className='users_lists_container'>
                      {(users || []).length > 0 ? (
                        <React.Fragment>
                          {users.map((user) => (
                            <div
                              className='user_card'
                              key={user.handleUn}
                              onClick={() => addNewMember(user.handleUn)}>
                              <img
                                src={user.profilePic || UserAvatar}
                                className='card_avatar'
                              />
                              <span className='user_card_name'>
                                {user.fn} {user.ln}
                              </span>
                            </div>
                          ))}
                        </React.Fragment>
                      ) : (
                        <div className='users_lists_container'>
                          No user found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />
      )}
      {openColorModal && (
        <CustomModal
          onClose={onClose}
          title='Add new user'
          body={
            <div className='modal_color_body'>
              {colors.map((data) => (
                <div
                  style={{ backgroundImage: data }}
                  className='color_picker_box'
                  id={data}
                  onClick={(e) => setColor(e)}></div>
              ))}
            </div>
          }
        />
      )}
      {selectBlock.isGroupChat ? (
        <div className='chat_header_user_info'>
          <button className='chat_header_back_btn' onClick={() => backBtn()}>
            <BiArrowBack />
          </button>
          <img
            src={selectBlock.b_p_img || UserAvatar}
            className='chat_header_profilePic'
          />
          <span className='chat_name'>{selectBlock.name}</span>
        </div>
      ) : (
        <div className='chat_header_user_info'>
          <button className='chat_header_back_btn' onClick={() => backBtn()}>
            <BiArrowBack />
          </button>
          <img
            src={chatLoggedUser(selectBlock, user).profilePicture || UserAvatar}
            className='chat_header_profilePic'
          />
          <span className='chat_name'>
            {chatLoggedUser(selectBlock, user).name}
          </span>
        </div>
      )}
      <button className='header_menubtn' onClick={() => setOpneMenu((p) => !p)}>
        <span class='icon-more'></span>
      </button>

      {openMenu && (
        <div className='header_menu' ref={menuRef}>
          <li
            className='header_menu_list'
            onClick={() => setOpenColorModal(true)}>
            Change theme
          </li>

          {/* <li
            className='header_menu_list'
            onClick={() => setOpenColorModal(true)}>
            View Profile
          </li> */}

          {/* <li
            className='header_menu_list'
            onClick={() => setOpenColorModal(true)}>
            Delete chat
          </li> */}

          {}
        </div>
      )}
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
export default connect(mapStateToProps, mapDispatchToProps)(SingleChatHeader);
