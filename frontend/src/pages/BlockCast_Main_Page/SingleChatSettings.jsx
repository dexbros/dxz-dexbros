/** @format */

import React from "react";
import { useNavigate, useParams } from "react-router";
import { connect } from "react-redux";
import Layout from "../../layouts/main-layout.component";
import { setPageType } from "../../redux/page/page.actions";
import {
  selectBlockcast,
  unselectBlockcast,
} from "../../redux/block/block.action";
import UserAvatar from "../../Assets/userAvatar.webp";
import {
  AiOutlineCamera,
  AiOutlineCloudUpload,
  AiOutlineClose,
} from "react-icons/ai";
import CustomModal from "../../components/modal/CustomModal";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";

const colors = [
  "linear-gradient(to right, #457fca, #5691c8)",
  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
  "linear-gradient(to top, #88d3ce 0%, #6e45e2 100%)",
  "linear-gradient(to top, #0c3483 0%, #a2b6df 100%, #6b8cce 100%, #a2b6df 100%)",
  "linear-gradient(60deg, #29323c 0%, #485563 100%)",
];
// #ACBB78

const SingleChatSettings = ({
  user,
  token,
  selectBlockcast,
  setPageType,
  updatedBlock,
  selectBlock,
}) => {
  const { id } = useParams();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(false);
  const [isDisable1, setIsDisable1] = React.useState(false);
  const [blockData, setBlockData] = React.useState(null);
  const [openBox1, setOpenBox1] = React.useState(false);
  const [name, setName] = React.useState("");

  const [openBox2, setOpenBox2] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const [prevImage, setPrevImage] = React.useState("");
  const [image, setImage] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);

  const [openMembersModal, setOpenMemebersModal] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [admins, setAdmins] = React.useState([]);
  const [blockUsers, setBlockUsers] = React.useState([]);
  const [openAdminModal, setOpenAdminsModal] = React.useState(false);
  const [openBlockModal, setOpenBlockModal] = React.useState(false);

  // Fetch chat details...
  const fetchData = () => {
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
        console.log(response.data);
        setBlockData(response.data);
        //selectBlockcast(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchData();
  }, [id]);

  React.useLayoutEffect(() => {
    setPageType("block_cast_message_settings");
  });

  React.useEffect(() => {
    if (!name.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name]);

  // *** Handle update group name
  const handleUpdateName = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: name,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/update/name/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        selectBlockcast(result);
        setOpenBox1("");
        setName("");
        fetchData();
      })
      .catch((error) => console.log("error", error));
  };

  // *** Close Modal
  const onClose = () => {
    setOpenModal(false);
    setPrevImage("");
    setImage("");
    setOpenMemebersModal(false);
    setOpenAdminsModal(false);
    setOpenBlockModal(false);
  };

  const handleImageChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const closeImage = () => {
    setPrevImage("");
    setImage("");
  };

  // *** Handle update group image
  const handleUpdateImage = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", image);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/update/image/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        selectBlockcast(result);
        setOpenModal(false);
        setPrevImage("");
        setImage("");
        setIsLoading(false);
        fetchData();
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    if (!description.trim()) {
      setIsDisable1(true);
    } else {
      setIsDisable1(false);
    }
  }, [description]);

  // *** Handle update group descripton
  const handleUpdateDescripton = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      descripton: description,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/update/descripton/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        selectBlockcast(result);
        setIsLoading(false);
        setOpenBox2(false);
        setDescription("");
        setIsDisable1(true);
        fetchData();
      })
      .catch((error) => console.log("error", error));
  };

  // *** Fetch group memebers
  const fetchMemebers = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      members: selectBlock.mem,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/fetch/members/${id}?page=${page}&limit=${limit}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleMemeber = () => {
    fetchMemebers();
    setOpenMemebersModal(true);
  };
  React.useEffect(() => {
    fetchMemebers();
  }, [page]);

  // **** Handle remove from  group
  const handleRemoveFromGroup = (username) => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      username: "account_two",
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/remove/member/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        selectBlockcast(response.data);
        setOpenMemebersModal(false);
        fetchData();
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // **** Handle ADMIN  from  group
  const handleAdminFromGroup = (username) => {
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/admin/member/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        selectBlockcast(response.data);
        setOpenAdminsModal(false);
        fetchData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // **** Handle remove ADMIN  from  group
  const handleRemoveAdminFromGroup = (username) => {
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/admin/remove/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        selectBlockcast(response.data);
        setOpenAdminsModal(false);
        fetchData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Fetch group memebers
  const fetchAdmins = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      members: selectBlock.admins,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/fetch/admins/${id}?page=${page}&limit=${limit}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setAdmins(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAdmin = () => {
    setOpenAdminsModal(true);
    fetchAdmins();
  };

  // *** Handle blocked user
  const handleBlockUser = (username) => {
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/block/member/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        selectBlockcast(response.data);
        setOpenMemebersModal(false);
        fetchData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle Unblock user
  const handleUnblockUser = (username) => {
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/remove/block/member/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        selectBlockcast(response.data);
        setOpenMemebersModal(false);
        setOpenBlockModal(false);
        setOpenAdminsModal(false);
        fetchData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Fetch block users
  const fetchBlockUsers = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      members: selectBlock.blockUsers,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/fetch/block/members/${id}?page=${page}&limit=${limit}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setBlockUsers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleBlock = () => {
    setOpenBlockModal(true);
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
  };

  return (
    <Layout title={"Settings"}>
      {blockData ? (
        <div className='block_setting_container'>
          {/* Group profile image */}
          {openModal && (
            <CustomModal
              onClose={onClose}
              title='Update profile image'
              body={
                <React.Fragment>
                  {prevImage ? (
                    <div className='modal_image_section'>
                      <img src={prevImage} className='modal_image' />
                      <button
                        className='modal_close_btn'
                        onClick={() => closeImage("")}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  ) : (
                    <div className='modal_image_body'>
                      <label htmlFor='file' className='file_upload_icon'>
                        <AiOutlineCloudUpload className='upload_icon' />
                        <input
                          type='file'
                          className='file_input'
                          id='file'
                          onChange={(e) => handleImageChange(e)}
                        />
                      </label>
                    </div>
                  )}
                </React.Fragment>
              }
              footer={
                prevImage && (
                  <div className='modal_footer_btn'>
                    <button
                      className='update_button'
                      onClick={handleUpdateImage}>
                      {isLoading ? (
                        <LoadingIcon className='spinner' />
                      ) : (
                        <>Update</>
                      )}
                    </button>
                  </div>
                )
              }
            />
          )}

          {/* Members of the group */}
          {openMembersModal && (
            <CustomModal
              onClose={onClose}
              title='Members of the group'
              body={
                <React.Fragment>
                  {user.handleUn === blockData.b_c_un ? (
                    <div className='modal_body'>
                      {(users || []).length > 0 ? (
                        <div className='user_card_container'>
                          {users.map((profile) => (
                            <div
                              className='modal_user_card'
                              key={profile.record.bins.handleUn}>
                              <div className='modal_user_info'>
                                <img
                                  src={
                                    profile.record.bins.profilePic || UserAvatar
                                  }
                                  className='modal_user_card_image'
                                  alt=''
                                  srcset=''
                                />
                                <span className='modal_user_card_name'>
                                  {profile.record.bins.fn}{" "}
                                  {profile.record.bins.ln}
                                </span>
                                <span className='author'>
                                  {profile.record.bins.handleUn ===
                                    blockData.b_c_un && <>Author</>}
                                </span>
                                <span className='admin'>
                                  {blockData.admins.includes(
                                    profile.record.bins.handleUn
                                  ) && <>Admin</>}
                                </span>
                              </div>
                              {profile.record.bins.handleUn !==
                                blockData.b_c_un && (
                                <div className='modal_user_btn_section'>
                                  <Menu
                                    menuButton={
                                      <MenuButton className='update_button'>
                                        <span class='ico_more'></span>
                                      </MenuButton>
                                    }>
                                    {!blockData.blockUsers.includes(
                                      profile.record.bins.handleUn
                                    ) && (
                                      <>
                                        {blockData.admins.includes(
                                          profile.record.bins.handleUn
                                        ) ? (
                                          <MenuItem
                                            className='btn_menuItem'
                                            onClick={() =>
                                              handleRemoveAdminFromGroup(
                                                profile.record.bins.handleUn
                                              )
                                            }>
                                            Remove admin
                                          </MenuItem>
                                        ) : (
                                          <MenuItem
                                            className='btn_menuItem'
                                            onClick={() =>
                                              handleAdminFromGroup(
                                                profile.record.bins.handleUn
                                              )
                                            }>
                                            Add admin
                                          </MenuItem>
                                        )}
                                      </>
                                    )}
                                    {blockData.blockUsers.includes(
                                      profile.record.bins.handleUn
                                    ) ? (
                                      <MenuItem
                                        className='btn_menuItem'
                                        onClick={() =>
                                          handleUnblockUser(
                                            profile.record.bins.handleUn
                                          )
                                        }>
                                        Unblock
                                      </MenuItem>
                                    ) : (
                                      <MenuItem
                                        className='btn_menuItem'
                                        onClick={() =>
                                          handleBlockUser(
                                            profile.record.bins.handleUn
                                          )
                                        }>
                                        Block
                                      </MenuItem>
                                    )}
                                    <MenuItem
                                      className='btn_menuItem'
                                      onClick={() =>
                                        handleRemoveFromGroup(
                                          profile.record.bins.handleUn
                                        )
                                      }>
                                      Remove
                                    </MenuItem>
                                  </Menu>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className='modal_body'>
                      {(users || []).length > 0 ? (
                        <div className='user_card_container'>
                          {users.map((user) => (
                            <div
                              className='modal_user_card'
                              key={user.handleUn}>
                              <div className='modal_user_info'>
                                <img
                                  src={user.record.bins.profilePic}
                                  className='modal_user_card_image'
                                  alt=''
                                  srcset=''
                                />
                                <span className='modal_user_card_name'>
                                  {user.record.bins.fn} {user.record.bins.ln}
                                </span>
                                <span className='author'>
                                  {user.record.bins.handleUn ===
                                    blockData.b_c_un && <>Author</>}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </React.Fragment>
              }
            />
          )}

          {/* Block users modal */}
          {openBlockModal && (
            <CustomModal
              onClose={onClose}
              title='Block of the group'
              body={
                <React.Fragment>
                  {user.handleUn === blockData.b_c_un ? (
                    <div className='modal_body'>
                      {(blockUsers || []).length > 0 ? (
                        <div className='user_card_container'>
                          {blockUsers.map((profile) => (
                            <div
                              className='modal_user_card'
                              key={profile.handleUn}>
                              <div className='modal_user_info'>
                                <img
                                  src={profile.record.bins.profilePic}
                                  className='modal_user_card_image'
                                  alt=''
                                  srcSet=''
                                />
                                <span className='modal_user_card_name'>
                                  {profile.record.bins.fn}{" "}
                                  {profile.record.bins.ln}
                                </span>
                                <span className='author'>
                                  {profile.record.bins.handleUn ===
                                    blockData.b_c_un && <>Author</>}
                                </span>
                                <span className='admin'>
                                  {blockData.admins.includes(
                                    profile.record.bins.handleUn
                                  ) && <>Admin</>}
                                </span>
                              </div>
                              {profile.record.bins.handleUn !==
                                blockData.b_c_un && (
                                <div className='modal_user_btn_section'>
                                  <button
                                    className='update_button'
                                    onClick={() =>
                                      handleUnblockUser(
                                        profile.record.bins.handleUn
                                      )
                                    }>
                                    Unblock
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className='modal_body'>
                      {(blockUsers || []).length > 0 ? (
                        <div className='user_card_container'>
                          {blockUsers.map((user) => (
                            <div
                              className='modal_user_card'
                              key={user.handleUn}>
                              <div className='modal_user_info'>
                                <img
                                  src={user.record.bins.profilePic}
                                  className='modal_user_card_image'
                                  alt=''
                                  srcset=''
                                />
                                <span className='modal_user_card_name'>
                                  {user.record.bins.fn} {user.record.bins.ln}
                                </span>
                                <span className='author'>
                                  {user.record.bins.handleUn ===
                                    blockData.b_c_un && <>Author</>}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </React.Fragment>
              }
            />
          )}

          {/* Admins of the group */}
          {openAdminModal && (
            <CustomModal
              onClose={onClose}
              title='Admin of the group'
              body={
                <React.Fragment>
                  {user.handleUn === blockData.b_c_un ? (
                    <div className='modal_body'>
                      {(admins || []).length > 0 ? (
                        <div className='user_card_container'>
                          {admins.map((profile) => (
                            <div
                              className='modal_user_card'
                              key={profile.handleUn}>
                              <div className='modal_user_info'>
                                <img
                                  src={profile.record.bins.profilePic}
                                  className='modal_user_card_image'
                                  alt=''
                                  srcset=''
                                />
                                <span className='modal_user_card_name'>
                                  {profile.record.bins.fn}{" "}
                                  {profile.record.bins.ln}
                                </span>
                                <span className='author'>
                                  {profile.record.bins.handleUn ===
                                    blockData.b_c_un && <>Author</>}
                                </span>
                                <span className='admin'>
                                  {blockData.admins.includes(
                                    profile.record.bins.handleUn
                                  ) && <>Admin</>}
                                </span>
                              </div>
                              {profile.record.bins.handleUn !==
                                blockData.b_c_un && (
                                <div className='modal_user_btn_section'>
                                  <Menu
                                    menuButton={
                                      <MenuButton className='update_button'>
                                        <span class='icon-more'></span>
                                      </MenuButton>
                                    }>
                                    <MenuItem className='btn_menuItem'>
                                      Block
                                    </MenuItem>
                                    <MenuItem
                                      className='btn_menuItem'
                                      onClick={() =>
                                        handleRemoveAdminFromGroup(
                                          profile.record.bins.handleUn
                                        )
                                      }>
                                      Remove from admin
                                    </MenuItem>
                                  </Menu>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className='modal_body'>
                      {(admins || []).length > 0 ? (
                        <div className='user_card_container'>
                          {admins.map((user) => (
                            <div
                              className='modal_user_card'
                              key={user.handleUn}>
                              <div className='modal_user_info'>
                                <img
                                  src={user.record.bins.profilePic}
                                  className='modal_user_card_image'
                                  alt=''
                                  srcset=''
                                />
                                <span className='modal_user_card_name'>
                                  {user.record.bins.fn} {user.record.bins.ln}
                                </span>
                                <span className='author'>
                                  {user.record.bins.handleUn ===
                                    blockData.b_c_un && <>Author</>}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </React.Fragment>
              }
            />
          )}

          {/* Group Name */}
          <div className='blockcast_box'>
            <span className='blockcast_header_title'>Change name</span>
            {blockData.b_c_un === user.handleUn && (
              <button
                className={openBox1 ? "close_edit_button" : "edit_button"}
                onClick={() => setOpenBox1((p) => !p)}>
                {openBox1 ? <>Close</> : <>Edit</>}
              </button>
            )}
          </div>
          {openBox1 ? (
            <div className='edit_box_section'>
              <input
                type='text'
                placeholder='Change name'
                className='blockcast_edit_input'
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 20))}
              />
              <button
                className={
                  isDisable
                    ? "update_button disable_update_button"
                    : "update_button"
                }
                onClick={handleUpdateName}>
                {isLoading ? (
                  <span class='icon-loading spinner'></span>
                ) : (
                  <>Update</>
                )}
              </button>
            </div>
          ) : (
            <div className='edit_box_section'>
              <p className='box_text'>
                <span className='box_subheader'>Name </span>
                <span className='edit_name'>{blockData.name}</span>
              </p>
            </div>
          )}

          {/* Group Profile image */}
          <div className='blockcast_box'>
            <span className='blockcast_header_title'>Change profile image</span>
          </div>
          <div className='edit_box_section'>
            <div className='box_image'>
              <img
                src={blockData.b_p_img || UserAvatar}
                className='block_image_section'
              />
              {blockData.b_c_un === user.handleUn && (
                <button
                  className='upload_button'
                  onClick={() => setOpenModal(true)}>
                  <AiOutlineCamera />
                </button>
              )}
            </div>
          </div>

          {/* Group descripton */}
          <div className='blockcast_box'>
            <span className='blockcast_header_title'>
              Change group description
            </span>
            {blockData.b_c_un === user.handleUn && (
              <button
                className={openBox2 ? "close_edit_button" : "edit_button"}
                onClick={() => setOpenBox2((p) => !p)}>
                {openBox2 ? <>Close</> : <>Edit</>}
              </button>
            )}
          </div>
          {openBox2 ? (
            <div className='edit_box_section'>
              <textarea
                type='text'
                placeholder='Change description'
                className='blockcast_edit_textarea'
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              />
              <button
                className={
                  isDisable1
                    ? "update_button disable_update_button"
                    : "update_button"
                }
                onClick={handleUpdateDescripton}>
                {isLoading ? (
                  <span class='icon-loading spinner'></span>
                ) : (
                  <>Update</>
                )}
              </button>
            </div>
          ) : (
            <div className='edit_box_section'>
              <p className='box_text'>
                <span className='box_subheader'>Descripton: </span>
                <span className='edit_name'>{blockData.des}</span>
              </p>
            </div>
          )}

          {/* Others settings */}
          <div className='blockcast_box'>
            <span className='blockcast_header_title'>
              Other settings (optional)
            </span>
          </div>

          <div className='other_settings_section'>
            {/* Members */}
            <div className='other_box' onClick={() => handleMemeber()}>
              <span className='other_settings_box_title'>Members</span>
              <span className='other_settings_box_count'>
                {blockData.mem.length + 1 || 0}
              </span>
            </div>

            {/* Admins */}
            <div className='other_box' onClick={() => handleAdmin()}>
              <span className='other_settings_box_title'>Admins</span>
              <span className='other_settings_box_count'>
                {blockData.admins ? blockData.admins.length : 0}
              </span>
            </div>

            {/* Block user */}
            <div className='other_box' onClick={() => handleBlock()}>
              <span className='other_settings_box_title'>Block user</span>
              <span className='other_settings_box_count'>
                {blockData.blockUsers ? blockData.blockUsers.length : 0}
              </span>
            </div>
          </div>

          {/* Change chat background */}
          <div className='other_box'>
            <span className='other_settings_box_title'>
              Change chat background
            </span>
            {colors.map((data) => (
              <div
                style={{ backgroundImage: data }}
                className='color_picker_btn'
                id={data}
                onClick={(e) => setColor(e)}></div>
            ))}
          </div>

          {/* Others settings */}
          <div className='blockcast_box'>
            <span className='blockcast_header_title'>Creator profile</span>
          </div>

          <div className='creator_section'>
            <img
              src={blockData.b_c_img || UserAvatar}
              className='creator_avatar'
            />
            <Link
              to={`/user/profile/${blockData.b_c_un}`}
              className='creator_name'>
              {blockData.b_c_fn} {blockData.b_c_ln}
            </Link>
          </div>
        </div>
      ) : (
        <>Loading..</>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  selectBlock: state.blockCast.selectBlock,
  updatedBlock: state.blockCast.updatedBlock,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (type) => dispatch(setPageType(type)),
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
  unselectBlockcast: (data) => dispatch(unselectBlockcast(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SingleChatSettings);
