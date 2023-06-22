/** @format */

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { GrAnnounce } from "react-icons/gr";
import {
  AiOutlineUser,
  AiOutlineUsergroupAdd,
  AiOutlineClose,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdCreateNewFolder, MdOutlineForwardToInbox } from "react-icons/md";
import "./BlockCastDownNavbar.css";
import UserAvatar from "../../../Assets/userAvatar.webp";
import CustomModal from "../../modal/CustomModal";
import CustomPostFormModal from "../../modal/CustomPostForm";
import { BiArrowBack, BiSearchAlt } from "react-icons/bi";
import {
  selectBlockcast,
  unselectBlockcast,
} from "../../../redux/block/block.action";
import { useLocation } from "react-router-dom";
import CustomPostForm from "../../modal/CustomPostForm";
import BlockSekeletonLoader from "../../SkeletonLoading/BlockSekeletonLoader";
import BlockSearchList from "../../SearchList/BlockSearchList";
import axios from "axios";

const BlockCastDownNavbar = ({ user, token, selectBlockcast }) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [name, setName] = React.useState("");
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
  // const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [openCllapse, setOpenCllapse] = React.useState(false);
  const [isDisable2, setIsDisable2] = React.useState(true);
  const [isDisable3, setIsDisable3] = React.useState(true);

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
  const [cryptoList, setCryptoList] = React.useState([]);
  const [cryptoLoading, setCryptoLoading] = React.useState(false);
  const [cryptoKey, setCryptoKey] = React.useState("");
  const [showCrypto, setShowCrypto] = React.useState(false);
  const [showUserList, setShowUserList] = React.useState(false);

  const [suggestedUser, setSeuggestedUser] = React.useState([]);
  const [userPage, setUserPage] = React.useState(1);
  const [userLimit, setUserLimit] = React.useState(10);
  const [pathname, setPathname] = React.useState("/blockcast");
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [lists, setLists] = React.useState([]);

  const location = useLocation();
  React.useEffect(() => {
    const str = location.pathname.split("/");
    setPathname(str[str.length - 1]);
  });

  const handleOpenModal = () => {
    setOpenSearchModal(true);
  };

  // *** Fetch suggested user
  React.useEffect(() => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/users/suggested/user?page=${userPage}&limit=${userLimit}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        // setSeuggestedUser((prev) => [...prev, ...response.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [userPage]);

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

  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  function useOutsideAlerter(ref) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenMenu(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef2 = React.useRef(null);
  useOutsideAlerter(wrapperRef2);

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

  React.useEffect(() => {
    if (!name.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name]);

  // *** 1. Create BLOCKCAST...
  const createBlock = () => {
    setCryptoLoading(true);
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
        setCryptoKey("");
        setCryptoLoading(false);
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
    setOpenSearchModal(false);
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
      user: user,
      profile: profile,
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
        selectBlockcast(result.blockcast);
        navigate(`/blockcast/single/${result.blockcast.b_id}`);
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
        selectBlockcast(result.blockcast);
        navigate(`/blockcast/single/${result.blockcast.b_id}`);
      })
      .catch((error) => console.log("error", error));
    console.log("Call");
  };

  const addToGroupList = (profile) => {
    if (!selectUserName.includes(profile.handleUn)) {
      setSelectUser((prev) => [...prev, profile]);
      setSelectUserName((prev) => [...prev, profile.handleUn]);
      // setSeuggestedUser(
      //   suggestedUser.filter((user) => user.handleUn !== profile.handleUn)
      // );
    }
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

  const removeToHideUser = (profile) => {
    const users = selectUser;
    let arr = users.filter((user) => user.handleUn !== profile);
    setSelectUser(arr);

    const userNames = selectUserName;
    let temp = userNames.filter((user) => user.handleUn !== profile);
    setSelectUserName(temp);
  };

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

  // *** Select crypto from list
  const selectFavCrypto = (data) => {
    setCryptoKey(data.name);
    setShowCrypto(false);
  };

  const menuRef = React.useRef();
  const closeMenu = (event) => {
    if (!menuRef.current.contains(event.target)) {
      setShowCrypto(false);
      setShowUserList(false);
    } else {
      setShowCrypto(true);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", closeMenu);

    return () => document.removeEventListener("mousedown", closeMenu);
  });

  React.useEffect(() => {
    if (!groupChatDes.trim() || !groupChatName.trim()) {
      setIsDisable2(true);
    } else {
      if (selectUser.length === 0) {
        setIsDisable2(true);
      } else {
        setIsDisable2(false);
      }
    }
  }, [groupChatName, groupChatDes, selectUser]);

  React.useEffect(() => {
    if (search.length === 2) {
      setLoading(true);
      handleSearchGroup(search);
    } else if (search.length > 2) {
      setLoading(true);
      const delayCall = setTimeout(() => {
        handleSearchGroup(search);
      }, 1000);

      return () => clearTimeout(delayCall);
    }
  }, [search]);

  const handleSearchGroup = async (search) => {
    setLoading(true);
    if (search.trim()) {
      axios
        .get(
          `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${search}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          setLoading(false);
          setLists(response.data.block);
          console.log(response.data.block);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className='down_navbar_container'>
      {/* Block search modal */}
      {openSearchModal && (
        <CustomPostFormModal
          onClose={onClose}
          title={
            <div className='block_search_title_section'>
              <button className='back_btn' onClick={onClose}>
                <BiArrowBack />
              </button>
              <span className='block_search_title_text'>Block search</span>
            </div>
          }
          body={
            <div className='block_search_body'>
              <div className='block_search_form_section'>
                <AiOutlineSearch className='block_search_icon' />
                <input
                  type='search'
                  className='block_search_input'
                  placeholder='Search block'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className='search_list_section'>
                {loading ? (
                  <BlockSekeletonLoader />
                ) : (
                  <>
                    {(lists || []).length > 0 ? (
                      <>
                        {lists.map((data) => (
                          <BlockSearchList key={data.b_id} blockData={data} />
                        ))}
                      </>
                    ) : (
                      <div className='empty_block_search'>No block found</div>
                    )}
                  </>
                )}
              </div>
            </div>
          }
        />
      )}

      {/* Single chat modal */}
      {openSingleChatModal && (
        <CustomPostFormModal
          title={
            <div className='post_form_modal_title'>
              <div className='modal_post_form_section'>
                <button className='post_close_modal_button' onClick={onClose}>
                  <BiArrowBack />
                </button>
                <span className='modal_title_text'>Create group chat</span>
              </div>

              {!isDisable2 && (
                <button
                  className='_modal_post_button'
                  onClick={createGroupChat}>
                  Create
                </button>
              )}
            </div>
          }
          onClose={onClose}
          body={
            <div className='modal_form_body'>
              <input
                type='text'
                placeholder='Search user'
                className='__modal_form_input_section'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => searchUser(e)}
                onFocus={() => setShowUserList(true)}
              />

              {/* Search user list */}
              {showUserList ? (
                <div className='search_user_list' ref={menuRef}>
                  {isLoading ? (
                    <div className='users_lists_loader'>
                      <span class='ico-_loading'></span>
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
              ) : (
                <div
                  className='suggested_user_container'
                  onScroll={(e) => suggestedUserScrollHandler(e)}>
                  {(suggestedUser || []).length > 0 && (
                    <React.Fragment>
                      {suggestedUser.map((user) => (
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
                  )}
                </div>
              )}
            </div>
          }
        />
      )}

      {/* Create group chat modal */}
      {openGroupChatModal && (
        <CustomPostFormModal
          title={
            <div className='post_form_modal_title'>
              <div className='modal_post_form_section'>
                <button className='post_close_modal_button' onClick={onClose}>
                  <BiArrowBack />
                </button>
                <span className='modal_title_text'>Create group chat</span>
              </div>

              {!isDisable2 && (
                <button
                  className='_modal_post_button'
                  onClick={createGroupChat}>
                  Create
                </button>
              )}
            </div>
          }
          body={
            <div className='post_form_modal_blockcast'>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => searchUser(e)}
                onFocus={() => setShowUserList(true)}
              />

              {showUserList ? (
                <div>
                  {(users || []).length > 0 && (
                    <div className='search_user_list' ref={menuRef}>
                      {isLoading ? (
                        <div className='users_lists_container'>
                          <span class='icon-loading'></span>
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
                  )}
                </div>
              )}
            </div>
          }
        />
      )}

      {/* Create block chat modal */}
      {isBlockOpen && (
        <CustomPostFormModal
          title={
            <div className='post_form_modal_title'>
              <div className='modal_post_form_section'>
                <button className='post_close_modal_button' onClick={onClose}>
                  <BiArrowBack />
                </button>
                <span className='modal_title_text'>Create blockcast</span>
              </div>

              {!isDisable3 && (
                <button className='_modal_post_button' onClick={createBlock}>
                  Create
                </button>
              )}
            </div>
          }
          body={
            <div className='post_form_modal_blockcast'>
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

              {/* cryptoKey */}
              <div className='crypto_container'>
                <input
                  type='text'
                  placeholder='Select favourite coin(required)'
                  className='__modal_form_input_section'
                  value={cryptoKey}
                  onChange={(e) => setCryptoKey(e.target.value)}
                  onFocus={() => setShowCrypto(true)}
                />
                {/* Rendering Crypto list */}
                {showCrypto && (
                  <div
                    className='crypto_list_container'
                    onScroll={(e) => scrollHandler(e)}
                    ref={menuRef}>
                    <div>
                      {(cryptoList || []).length > 0 && (
                        <React.Fragment>
                          {cryptoList.map((data) => (
                            <div
                              className='crypto_list'
                              key={data.id}
                              onClick={() => selectFavCrypto(data)}>
                              <img src={data.image} className='crypto_logo' />
                              <span className='crypto_name'>{data.name}</span>
                            </div>
                          ))}
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
        />
      )}

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='/blockcast'
        className={
          pathname === "blockcast"
            ? "down_navbar_link active_down_navbar_link"
            : "down_navbar_link"
        }>
        <GrAnnounce className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>Recomended</span>
      </NavLink>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='my_blockcast'
        className={
          pathname === "my_blockcast"
            ? "down_navbar_link active_down_navbar_link"
            : "down_navbar_link"
        }>
        <span class='icon-cube'></span>
        <br />
        <span className='block_cast_down_text'>My Blockcast</span>
      </NavLink>

      <button className='down_navbar_link' onClick={() => setOpenMenu(true)}>
        <MdCreateNewFolder
          className='blockcast_down_navbar'
          onClick={() => setOpenMenu(true)}
        />
      </button>

      {/* <NavLink
        activeclassName='active_navlink_blockcast'
        to='chats'
        className='down_navbar_link'>
        <MdOutlineForwardToInbox className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>Inbox</span>
      </NavLink> */}

      <button className='down_navbar_link' onClick={handleOpenModal}>
        <BiSearchAlt className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>Search</span>
      </button>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='join'
        className={
          pathname === "join"
            ? "down_navbar_link active_down_navbar_link"
            : "down_navbar_link"
        }>
        <span class='icon-link'></span>
        <br />
        <span className='block_cast_down_text'>Join Blockcast</span>
      </NavLink>

      {openMenu && (
        <div className={"doen_navbar_menu"} ref={wrapperRef2}>
          <li className='menu_list' onClick={() => setIsBlockOpen(true)}>
            Blockcast
          </li>
          {/* <li className='menu_list' onClick={() => setOpenGroupChatModal(true)}>
            Group
          </li>
          <li
            className='menu_list'
            onClick={() => setOpenSingleChatModal(true)}>
            Single Chat
          </li> */}
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userLogout()),
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockCastDownNavbar);

// Old code
{
  /* <NavLink
        activeclassName='active_navlink_blockcast'
        to='/blockcast'
        className='down_navbar_link'>
        <GrAnnounce className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>Recomended</span>
      </NavLink>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='my_blockcast'
        className='down_navbar_link'>
        <span class="icon-cube"></span>
        <br />
        <span className='block_cast_down_text'>My Blockcast</span>
      </NavLink>

      <button className='down_navbar_link' onClick={() => setOpenMenu(true)}>
        <MdCreateNewFolder
          className='blockcast_down_navbar'
          onClick={() => setOpenMenu(true)}
        />
      </button>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='chats'
        className='down_navbar_link'>
        <MdOutlineForwardToInbox className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>Inbox</span>
      </NavLink>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='join'
        className='down_navbar_link'>
        <span class="icon-link"></span>
        <br />
        <span className='block_cast_down_text'>Join Blockcast</span>
      </NavLink>

      {openMenu && (
        <div className={"doen_navbar_menu"} ref={wrapperRef2}>
          <li className='menu_list' onClick={() => setIsBlockOpen(true)}>
            Blockcast
          </li>
          <li className='menu_list' onClick={() => setOpenGroupChatModal(true)}>
            Group
          </li>
          <li
            className='menu_list'
            onClick={() => setOpenSingleChatModal(true)}>
            Single Chat
          </li>
        </div> */
}
