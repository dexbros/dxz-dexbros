/** @format */

import React from "react";
import Layout from "../../layouts/main-layout.component";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ModalComp from "../../components/modal/ModalComp";
import "./BlockCast.css";
import { useTranslation } from "react-i18next";
import CustomModal from "../../components/modal/CustomModal";
import UserAvatar from "../../Assets/userAvatar.webp";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { MdCreate } from "react-icons/md";

import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const BlockCast = ({ token, setPageType, user }) => {
  const { t } = useTranslation(["common"]);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [searchName, setSearchName] = React.useState("");
  const [isNameVisible, setIsNameVisible] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [isDesVisible, setIsDesVisible] = React.useState(false);
  const [members, setMembers] = React.useState(["account_six", "account_nine"]);
  const [status, setStatus] = React.useState("business");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);
  const [showInput, setShowInput] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [openCllapse, setOpenCllapse] = React.useState(false);

  // open Blockcast create modal
  const [isBlockOpen, setIsBlockOpen] = React.useState(false);
  const [openSingleChatModal, setOpenSingleChatModal] = React.useState(false);
  const [openGroupChatModal, setOpenGroupChatModal] = React.useState(false);

  const [groupChatName, setGroupChatName] = React.useState("");
  const [groupChatDes, setGroupChatDes] = React.useState("");
  const [selectUser, setSelectUser] = React.useState([]);
  const [selectUserName, setSelectUserName] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(8);

  const [suggestedUser, setSeuggestedUser] = React.useState([]);
  const [userPage, setUserPage] = React.useState(1);
  const [userLimit, setUserLimit] = React.useState(10);

  const suggestedUserScrollHandler = (e) => {
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    console.log(sh, cl, sy);
    if (cl + sy + 1 >= sh) {
      setUserPage((userPage) => userPage + 1);
    }
  };

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
  const wrapperRef = React.useRef(null);
  const focusRef = React.useRef(null);

  React.useLayoutEffect(() => {
    setPageType("blockcast");
  }, []);

  React.useEffect(() => {
    if (!name.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name]);

  // *** 1. Create BLOCKCAST...
  const createBlock = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: name,
      description: description,
      status: status,
      crypto: cryptoKey,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/blockcast`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setName("");
        setDescription("");
        setStatus("Public");
        setIsLoading(false);
        setIsBlockOpen(false);
        setOpenCllapse(false);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setVisible(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleOpenInput = () => {
    setShowInput(true);
    setVisible(true);
  };

  const userRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!userRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setIsOpen(false);
        setOpenCreateModal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const onClose = () => {
    setIsBlockOpen(false);
    setOpenSingleChatModal(false);
    setOpenGroupChatModal(false);
  };

  // *** Create a single person to person chat
  const createSingleChat = (profile) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      user_firstname: profile.fn,
      user_lastname: profile.ln,
      image: profile.profilePic,
      status: "Normal",
      members: [profile.handleUn, user.handleUn],
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/personal/${profile.handleUn}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenSingleChatModal(false);
        setSearch("");
        setName("");
      })
      .catch((error) => console.log("error", error));
  };

  // *** Create group
  const createGroupChat = (profile) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: groupChatName,
      description: groupChatDes,
      image: "",
      status: "Normal",
      members: selectUserName,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/group`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenGroupChatModal(false);
        setSearch("");
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    if (!groupChatDes.trim() || !groupChatName.trim()) {
      setIsDisable(true);
    } else {
      if (selectUserName.length < 1) {
        setIsDisable(true);
      } else {
        setIsDisable(false);
      }
    }
  }, []);

  // *** Scroll event for crypto currency list
  // *** Scroll handler
  const scrollHandler = (e) => {
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    console.log(sh, cl, sy);
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  const menuRef = React.useRef();
  const closeMenu = (event) => {
    console.log("MENU REF call");
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", closeMenu);

    return () => document.removeEventListener("mousedown", closeMenu);
  });

  const handleMenu = (e) => {
    console.log("CALL");
  };

  const listRef = React.useRef(() => {
    document.addEventListener("mousedown", handleMenu);
    document.removeEventListener("mousedown", handleMenu);
  });

  return (
    <Layout goBack={true} title={"Blockcast"}>
      {/* Block cast modal */}
      {isBlockOpen && (
        <CustomModal
          onClose={onClose}
          title='Blockcast create'
          body={
            <div className='modal_form_body'>
              <input
                type='text'
                placeholder='Enter block name(required)'
                className='__modal_form_input_section'
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 20))}
              />
              <br />
              <textarea
                type='text'
                className='__modal_form_textarea_section'
                placeholder={
                  isDesVisible ? "" : "Enter block description(required)"
                }
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.slice(0, 200))
                }></textarea>
              <br />
              {/* cryptoKey */}
              <div className='crypto_container'>
                <input
                  type='text'
                  placeholder='Enter block name(required)'
                  className='__modal_form_input_section'
                  value={cryptoKey}
                  onChange={(e) => setCryptoKey(e.target.value)}
                  onFocus={() => setShowCrypto(true)}
                />
                {/* Rendering Crypto list */}
                {showCrypto && (
                  <div className='crypto_list_container' ref={listRef}>
                    {(cryptoList || []).length > 0 && (
                      <div>
                        {cryptoList.map((data) => (
                          <div
                            className='crypto_list'
                            key={data.id}
                            onClick={() => selectFavCrypto(data)}>
                            <img src={data.image} className='crypto_logo' />
                            <span className='crypto_name'>{data.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          }
          footer={
            <div className='modal_footer_section'>
              <button className='modal_blockcast_btn' onClick={createBlock}>
                {cryptoLoading ? (
                  <span class='icon-loading spinner'></span>
                ) : (
                  <>Create</>
                )}
              </button>
            </div>
          }
        />
      )}

      {/* Single chat modal */}
      {openSingleChatModal && (
        <CustomModal
          title='Chat create'
          onClose={onClose}
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

              {/* Search user list */}
              {showUserList && (
                <div className='search_user_list' ref={menuRef}>
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
                              onClick={() => createSingleChat(user)}>
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

      {/* Group chat create modal */}
      {openGroupChatModal && (
        <CustomModal
          title='Group chat create'
          onClose={onClose}
          body={
            <div className='modal_form_container'>
              <input
                type='text'
                className='__modal_input'
                placeholder='Enter group name'
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value.slice(0, 20))}
              />

              <textarea
                type='text'
                className='__modal_textarea'
                placeholder='Enter group description'
                value={groupChatDes}
                onChange={(e) =>
                  setGroupChatDes(e.target.value.slice(0, 200))
                }></textarea>

              {/* Slected users list */}
              {(selectUser || []).length > 0 && (
                <div className='selected_user_container'>
                  {selectUser.map((user) => (
                    <button
                      className='select_user_tag'
                      key={user.handleUn}
                      onClick={() => removeToHideUser(user.handleUn)}>
                      <span className=''>
                        {user.fn} {user.ln}
                      </span>
                      <span className='close_icon'>
                        <AiOutlineClose />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <input
                type='text'
                className='__modal_input'
                placeholder='Search user'
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => searchUser(e)}
                onFocus={() => setShowUserList(true)}
              />

              {showUserList ? (
                <div>
                  {(users || []).length > 0 && (
                    <div className='search_user_list' ref={menuRef}>
                      {isLoading ? (
                        <div className='users_lists_container'>
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
                                  onClick={() => addToGroupList(user)}>
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
              ) : (
                <div
                  className='suggested_user_container'
                  onScroll={(e) => suggestedUserScrollHandler(e)}>
                  {(suggestedUser || []).length > 0 && (
                    <React.Fragment>
                      {suggestedUser.map((user) => (
                        <React.Fragment>
                          {!selectUserName.includes(user.handleUn) && (
                            <div
                              className='user_card'
                              key={user.handleUn}
                              onClick={() => addToGroupList(user)}>
                              <img
                                src={user.profilePic || UserAvatar}
                                className='card_avatar'
                              />
                              <span className='user_card_name'>
                                {user.fn} {user.ln}
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  )}
                </div>
              )}
            </div>
          }
          footer={
            <div className='modal_footer_section'>
              <button
                className={
                  isDisable
                    ? "modal_blockcast_btn disable_modal_blockcast_btn"
                    : "modal_blockcast_btn"
                }
                onClick={createGroupChat}>
                {isLoading ? (
                  <span class='icon-loading spinner'></span>
                ) : (
                  <>Create</>
                )}
              </button>
            </div>
          }
        />
      )}
      <div className='blockcast_container'>
        <div className='action_btn_container'>
          <div
            className={
              openCllapse
                ? "collapse_btn_section collapse_active"
                : "collapse_btn_section"
            }>
            <button className='collase_btn'>
              <MdCreate />
              <span
                className='cloasspase_text'
                onClick={() => setIsBlockOpen(true)}>
                Blockcast
              </span>
            </button>
            <button className='collase_btn'>
              <MdCreate />
              <span
                className='cloasspase_text'
                onClick={() => setOpenGroupChatModal(true)}>
                Group
              </span>
            </button>
            <button className='collase_btn'>
              <MdCreate />
              <span
                className='cloasspase_text'
                onClick={() => setOpenSingleChatModal(true)}>
                Single
              </span>
            </button>
          </div>
          <button
            className='action_main_button'
            onClick={() => setOpenCllapse((p) => !p)}>
            <AiOutlinePlus />
          </button>
        </div>
      </div>

      {/* Block cast nested routes */}
      <div className='block_cast_nestedRoutes'>
        <NavLink
          to=''
          className='blockcast_routes'
          style={({ isActive }) => ({
            color: isActive ? "royalblue" : "black",
          })}>
          Recomended
        </NavLink>
        <NavLink to='chats' className='blockcast_routes'>
          Chats
        </NavLink>
        <NavLink to='my_blockcast' className='blockcast_routes'>
          My Blockcast
        </NavLink>
        <NavLink to='join' className='blockcast_routes'>
          Join
        </NavLink>
      </div>

      <Outlet />
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockCast);
