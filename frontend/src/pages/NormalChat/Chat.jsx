/** @format */

import React from "react";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import Layout from "../../layouts/main-layout.component";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { MdCreate } from "react-icons/md";
import CustomPostForm from "../../components/modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";
import {
  selectBlockcast,
  unselectBlockcast,
} from "../../redux/block/block.action";
import ChatList from "../../components/Blockcast_List/ChatList";
import { useNavigate } from "react-router";

const Chat = ({ user, token, setPageType, selectBlockcast }) => {
  const navigate = useNavigate();
  const [opensingleChat, setOpenSingleChat] = React.useState(false);
  const [openGroupChat, setOpenGroupchat] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [handleUnList, setHandleUnList] = React.useState([]);
  const [groupName, setGroupName] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [blockData, setBlockData] = React.useState([]);

  React.useLayoutEffect(() => {
    setPageType("normal_chat");
  });

  const onClose = () => {
    setOpenSingleChat(false);
    setOpenGroupchat(false);
  };

  const searchUser = (value) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Berer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/search/user?search=${value}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.user);
        setUsers(result.user);
      })
      .catch((error) => console.log("error", error));
  };

  const addToList = (data) => {
    if (!handleUnList.includes(data.handleUn)) {
      setHandleUnList((prev) => [...prev, data.handleUn]);
      setList((prev) => [...prev, data]);
    }
  };

  React.useEffect(() => {
    if (handleUnList.length > 0) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [handleUnList]);

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
        setOpenSingleChat(false);
        setSearch("");
        // setName("");
        selectBlockcast(result.blockcast);
        navigate(`/blockcast/single/${result.blockcast.b_id}`);
      })
      .catch((error) => console.log("error", error));
  };

  // **** Handle scroll function
  const scrollHandler = (e) => {
    console.log("Scroll");
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    console.log(sy);
    let sh = e.currentTarget.scrollHeight;
    console.log(sh, cl, sy);
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  // Fetch personal chats
  const fetchChats = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/personal/chat?page=${page}}&limit=${limit}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // setIsLoading(false);
        console.log(result);
        setBlockData(result);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    fetchChats();
  }, [page]);

  // Create Group chat
  const createGroupChat = (profile) => {
    alert("CLick");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: groupName,
      description: "",
      image: "",
      status: "Normal",
      members: handleUnList,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/group/chat`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenGroupchat(false);
        setSearch("");
        setGroupName("");
        selectBlockcast(result.blockcast);
        navigate(`/blockcast/single/${result.blockcast.b_id}`);
      })
      .catch((error) => console.log("error", error));
    console.log("Call");
  };

  return (
    <Layout>
      <div className='chat_page_container'>
        {/* Open Single Chat modal */}
        {opensingleChat && (
          <CustomPostForm
            title={
              <div className='trending_header'>
                <button className='header_back_btn' onClick={onClose}>
                  <BiArrowBack />
                </button>
                <span className='header_title'>Create new chat</span>
              </div>
            }
            body={
              <div className='message_modal_body'>
                <input
                  type='text'
                  className='search_input'
                  placeholder='Search User'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => searchUser(e.target.value)}
                />
                <div className='user_list_section'>
                  {(users || []).length > 0 ? (
                    <div>
                      {users.map((data) => (
                        <div
                          className='user_msg_card'
                          onClick={() => createSingleChat(data)}>
                          <img
                            src={`${process.env.REACT_APP_PUBLIC_URL}${data.p_i}`}
                            className='message_card_user_avatar'
                          />
                          <span className='message_card_name'>
                            {data.fn} {data.ln}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='empty_user_list'>No user found</div>
                  )}
                </div>
              </div>
            }
          />
        )}

        {/* Open Group Chat modal */}
        {openGroupChat && (
          <CustomPostForm
            title={
              <div className='trending_header message_title_header'>
                <button className='header_back_btn' onClick={onClose}>
                  <BiArrowBack />
                </button>
                <span className='header_title'>Create new group</span>
                {!isDisable && (
                  <button className='update_btn' onClick={createGroupChat}>
                    Create
                  </button>
                )}
              </div>
            }
            body={
              <div className='message_modal_body'>
                <div>
                  {(list || []).length > 0 && (
                    <div className='tag_section'>
                      {list.map((data) => (
                        <div className='user_tag' key={data.handleUn}>
                          {data.fn} {data.ln}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type='text'
                  className='search_input'
                  placeholder='Search User'
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value.slice(0, 40))}
                />
                <input
                  type='text'
                  className='search_input'
                  placeholder='Search User'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => searchUser(e.target.value)}
                />
                <div className='user_list_section'>
                  {(users || []).length > 0 ? (
                    <div>
                      {users.map((data) => (
                        <div
                          className='user_msg_card'
                          key={data.handdleUn}
                          onClick={() => addToList(data)}>
                          <img
                            src={`${process.env.REACT_APP_PUBLIC_URL}${data.p_i}`}
                            className='message_card_user_avatar'
                          />
                          <span className='message_card_name'>
                            {data.fn} {data.ln}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='empty_user_list'>No user found</div>
                  )}
                </div>
              </div>
            }
          />
        )}
        <Menu
          menuButton={
            <MenuButton className={"floating_btn"}>
              <MdCreate />
            </MenuButton>
          }>
          <MenuItem
            className={"block_post_menuItem"}
            onClick={() => setOpenSingleChat(true)}>
            Chat
          </MenuItem>
          <MenuItem
            className={"block_post_menuItem"}
            onClick={() => setOpenGroupchat(true)}>
            Group Chat
          </MenuItem>
        </Menu>

        <div
          className='block_cast_chats_section'
          onScroll={(e) => scrollHandler(e)}>
          <>
            {(blockData || []).length > 0 ? (
              <>
                {blockData.map((data) => (
                  <ChatList key={data.b_id} data={data} />
                ))}
              </>
            ) : (
              <>No active chat is present</>
            )}
          </>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  blockCast: state.blockCast.blockCast,
  messages: state.blockCast.messages,
  pinnedMessage: state.blockCast.pinnedMessage,
  selectBlock: state.blockCast.selectBlock,
  updatedBlock: state.blockCast.updatedBlock,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMessages: (data) => dispatch(newMessages(data)),
  addMessage: (data) => dispatch(addMessage(data)),
  // setBlockCast: (data) => dispatch(setBlockCast(data)),
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
