/** @format */

import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/main-layout.component";
import {
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import intToString from "../../utils/PostCount";
import "../Group/Group.css";
import { AiOutlineClose, AiOutlineCamera, AiOutlineMail } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import "@szhsin/react-menu/dist/index.css";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../Assets/userAvatar.webp";
import BlockSkeleton from "../../components/SkeletonLoading/BlockSkeleton";
import GroupForm from "../../components/GroupForm/GroupForm";
import { FiTrendingUp, FiSettings } from "react-icons/fi";
import { BiUserPlus, BiUserCheck, BiArrowBack } from "react-icons/bi";
import {
  selectBlockcast,
} from "../../redux/block/block.action";
import { GrChannel } from "react-icons/gr";
import CustomPostFormModal from "../../components/modal/CustomPostForm";
import { RiUserStarFill, RiUserSettingsLine } from "react-icons/ri";
import GroupPostContainer from "./GroupPost";
import GroupEvent from "./GroupEvent";
import { ImSpinner2 } from "react-icons/im";
import UserListLoader from "../../components/SkeletonLoading/UserLiastSkeleton";
import Compressor from "compressorjs";

/**
 * TOOLKIT
 */
import { useDispatch, useSelector } from "react-redux";
import { setPageType, setScrollAxis } from "../../redux/_page/pageSlice";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import {
  handleFetchBlock,
  setGroupData,
  handleCoverImage,
  setUpdatedGroupData,
  handleProfileImage,
  handleFetchGroupMembers,
  handleAddGroupMember,
} from "../../redux/_block/blockSlice";
import {
  selectGroupData,
  selectUpdatedGroupData,
} from "../../redux/_block/blockSelectors";

const Group = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const group = useSelector(selectGroupData);
  const updateGroup = useSelector(selectUpdatedGroupData);

  // ***
  // const [group, setGroup] = useState(null);
  const [cover_img, setCover_img] = useState("");
  const [prevImg, setPrevImg] = useState("");
  const [profile_img, setProfile_img] = useState("");
  const [profileModal, setProfileModal] = useState(false);
  const [openCoverModal, setOpenCoverModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openMemeberModal, setOpenMemberModal] = React.useState(false);
  const scrollContainerRef = React.useRef(null);
  const [isDisable, setIsDisable] = React.useState(false);
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);
  const [coverBtnDisable, setCoverBtnDisable] = React.useState(true);
  const [profileBtnDisable, setProfileBtnDisable] = React.useState(true);
  const [admins, setAdmins] = React.useState([]);
  const [activeState, setActiveState] = React.useState("post");
  const [members, setMembers] = React.useState([]);
  // ***
  const [dm, setDm] = React.useState("all");
  const [join, setJoin] = React.useState("all");
  const [viewDetails, setViewDetails] = React.useState("all");
  const [viewListDetails, setViewListDetails] = React.useState("all");
  const [postDetails, setPostDetails] = React.useState("all");
  const [createEventDetails, setCreateEventDetails] = React.useState("all");
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const [isMemberLoading, setIsMemberLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    dispatch(setPageType("block_page"));
    // setPageType("block_page");
  }, []);

  React.useEffect(() => {
    if (!cover_img) {
      setCoverBtnDisable(true);
    } else {
      setCoverBtnDisable(false);
    }
  }, [cover_img]);

  React.useEffect(() => {
    if (!profile_img) {
      setProfileBtnDisable(true);
    } else {
      setProfileBtnDisable(false);
    }
  }, [profile_img]);

  function handleScroll(e) {
    // console.log(e.target.scrollTop);
    // setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    if (prevScrollDirection < currentScrollPos) {
      // setScrollAxis("Down");
      dispatch(setScrollAxis("Down"));
    } else {
      // setScrollAxis("Up");
      dispatch(setScrollAxis("Up"));
    }
    setPrevScrollDirection(currentScrollPos);
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = { id, token };
      const result = await dispatch(handleFetchBlock(data));
      dispatch(setGroupData(result));
      setDm(result.dm_prv || "all"); // DM privacy
      setJoin(result.join_prv || "all"); // Join privacy
      setViewDetails(result.view || "all"); // View details privacy
      setViewListDetails(result.l_view || "all"); // View group members details privacy
      setPostDetails(result.post_prv || "all"); // Block post form privacy
      setCreateEventDetails(result.eve_prv); // create block event privacy
      setIsLoading(false);
      setMembers(result.g_mem);
      setAdmins(result.admins);
    }
    fetchData();
  }, [id, updateGroup]);

  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_URL_LINK}/group/${id}`
    );
  };

  const handleOpenCoverModal = (id) => {
    setCoverModal(true);
    setPostId(id);
  };

  const fileHandleChange = async (e) => {
    console.log("Original file: ", e.target.files[0]);

    if (e.target.files[0].size < 1000000) {
      setPrevImg(URL.createObjectURL(e.target.files[0]));
      setCover_img(e.target.files[0]);
    } else {
      new Compressor(e.target.files[0], {
        quality: 0.2,
        success(result) {
          console.log("RESULT: ", result);
          setPrevImg(URL.createObjectURL(result));
          setCover_img(result);
        },
      });
    }
  };

  useEffect(() => {
    if (prevImg !== "") {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [prevImg]);

  const uploadCoverImage = async () => {
    setIsBtnLoading(true);
    setCoverBtnDisable(true);
    const data = { cover_img: cover_img, token, id };
    const result = await dispatch(handleCoverImage(data));
    console.log(result);
    dispatch(setUpdatedGroupData(result));
    setIsLoading(false);
    setOpenCoverModal(false);
    setCover_img("");
    setPrevImg("");
    setIsBtnLoading(false);
  };

  const handleProfileModal = () => {
    setProfileModal(true);
    setPostId(id);
  };
  const fileProfileHandleChange = (e) => {
    setPrevImg(URL.createObjectURL(e.target.files[0]));
    setProfile_img(e.target.files[0]);
  };

  // *** Upload Block profile image
  const uploadProfileImage = async () => {
    setIsBtnLoading(true);
    setProfileBtnDisable(true);
    const data = { token, id, profile_img: profile_img };
    const result = await dispatch(handleProfileImage(data));
    dispatch(setUpdatedGroupData(result));
    setCover_img("");
    setPrevImg("");
    setIsBtnLoading(false);
    setProfileModal(false);
  };

  const addNewMenmber = (id) => {
    navigate(`/group/recomend/${id}`);
  };

  const unFollowedGroup = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}/api/group/unfollow/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
      })
      .catch((error) => console.log("error", error));
  };

  const followedGroup = () => {
    if (members.includes(user.handleUn)) {
      console.log(">> HAVE");
      const arr = members;
      const temp = arr.filter((data) => data !== user.handleUn);
      setMembers(temp);
    } else {
      console.log("NOT HAVE <<<");
      console.log("Not includes");
      setMembers((prev) => [...prev, user.handleUn]);
    }
    const data = { token, id };
    dispatch(handleAddGroupMember(data));
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);

    // var requestOptions = {
    //   method: "PUT",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };

    // fetch(
    //   `${process.env.REACT_APP_URL_LINK}api/group/follow/${id}`,
    //   requestOptions
    // )
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result);
    //     setPinnedPost(result);
    //   })
    //   .catch((error) => console.log("error", error));
  };

  const closePreviewImage = () => {
    setPrevImg("");
  };

  // *** Handle cover image chage
  const handleCoverImageChange = async (e) => {
    setPrevImg(URL.createObjectURL(e.target.files[0]));
    setCover_img(e.target.files[0]);
  };

  // *** Handle profile image change
  const handleProfileImageChange = async (e) => {
    setPrevImg(URL.createObjectURL(e.target.files[0]));
    setProfile_img(e.target.files[0]);
    try {
      const compressedFile = await ImageCompressor(e.target.files[0], {
        quality: 0.6, // Adjust the quality as per your requirements (0.1 - 1)
        maxWidth: 800, // Set the maximum width of the compressed image
        maxHeight: 800, // Set the maximum height of the compressed image
        mimeType: "image/jpeg", // Specify the desired output image format
      });
      // Handle the compressed file (e.g., upload or display it)
      console.log(compressedFile);
    } catch (error) {
      // Handle any error that occurs during compression
      console.error(error);
    }
  };

  // *** Join block
  // const joinGroup = (id) => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", "Bearer " + token);
  //   myHeaders.append("Content-Type", "application/json");

  //   var raw = JSON.stringify({
  //     groupId: id,
  //     userDisplayUsername: user.handleUn,
  //   });

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   fetch(
  //     `${process.env.REACT_APP_URL_LINK}api/group/join/group`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log(result);
  //       setUpdateGroup(result);
  //     })
  //     .catch((error) => console.log("error", error));
  // };

  // Add user to admin list
  const handleAddAdmin = async (username) => {
    if (admins.includes(username)) {
      console.log("Admin");
    } else {
      console.log("Not Admin");
      admins.push(username);
    }
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/admin/members/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        // setMembers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const closePrevImage = () => {
    setCover_img("");
    setProfile_img("");
    setPrevImg("");
  };

  const handleRedirectToEditPage = () => {
    navigate(`/group/edit/${id}`);
  };

  const handleRedirectToAnalytics = () => {
    navigate(`/group/${id}/analytics`);
  };

  // *** Handle fetch members
  const handleFetchMemebers = async () => {
    setIsMemberLoading(true);
    const data = { id, token };
    const result = await dispatch(handleFetchGroupMembers(data));
    setMembers(result);
    setIsMemberLoading(false);
  };
  const handleOpenMemeberModal = () => {
    setOpenMemberModal(true);
    handleFetchMemebers();
  };

  const onClose = () => {
    setOpenMemberModal(false);
  };

  /**
   * @THIS_API_CALL_SHOULD_BE_CONVERTED_INTO_TOOLKIT
   */
  // Create DM for block
  const handleCreateMessage = (group) => {
    // console.log(group);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      group: group,
      user: user,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/dm/${group.g_id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        navigate(`/blockcast/dm/${result.chat.b_id}`);
        selectBlockcast(result.chat);
      })
      .catch((error) => console.log("error", error));
  };

  const redirectToProfile = (id) => {
    navigate(`/user/profile/${id}`);
  };

  const handleCloseModal = () => {
    setOpenMemberModal(false);
    setProfileModal(false);
    setOpenCoverModal(false);
    setProfile_img("");
    setPrevImg("");
  };

  const handleCloseProfileImage = () => {
    setPrevImg("");
    setProfile_img("");
  };

  return (
    <React.Fragment>
      {group ? (
        <MainLayout goBack={true} title={group.g_n}>
          {openCoverModal && (
            <CustomPostFormModal
              onClose={handleCloseModal}
              title={
                <div className='custom_modal_title_section'>
                  <button
                    className='custom_modal_header_btn'
                    onClick={handleCloseModal}>
                    <BiArrowBack />
                  </button>
                  <div className='custom_modal_title_text'>
                    Upload cover image
                  </div>
                </div>
              }
              body={
                <div className='custom_modal_body_section'>
                  <div className='upload_section'>
                    {!prevImg ? (
                      <div className='custom_upload_section'>
                        <label
                          htmlFor='cover_img'
                          className='social_cover_image_upload_btn'>
                          <BsCloudUpload className='social_cover_image_upload_icon' />
                        </label>
                        <input
                          type='file'
                          id='cover_img'
                          className='file_input'
                          onChange={(e) => fileHandleChange(e)}
                        />
                      </div>
                    ) : (
                      <div className='custom_modal_prev_image_section'>
                        <img
                          src={prevImg}
                          className='custom_modal_prev_image'
                        />
                        <button
                          className='custom_modal_close_btn'
                          onClick={handleCloseProfileImage}>
                          <AiOutlineClose />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='generate_prev_image_section'></div>
                </div>
              }
              footer={
                <div className='custom_modal_footer_section'>
                  {coverBtnDisable ? (
                    <button className='custom_modal_btn disable_custom_modal_btn'>
                      {isBtnLoading ? (
                        <div>
                          <ImSpinner2 className='custom_loader' />
                        </div>
                      ) : (
                        <>Upload</>
                      )}
                    </button>
                  ) : (
                    <button
                      className='custom_modal_btn'
                      onClick={uploadCoverImage}>
                      Upload
                    </button>
                  )}
                </div>
              }
            />
          )}
          {profileModal && (
            <CustomPostFormModal
              onClose={handleCloseModal}
              title={
                <div className='custom_modal_title_section'>
                  <button
                    className='custom_modal_header_btn'
                    onClick={handleCloseModal}>
                    <BiArrowBack />
                  </button>
                  <div className='custom_modal_title_text'>
                    Upload profile image
                  </div>
                </div>
              }
              body={
                <div className='custom_modal_body_section'>
                  <div className='upload_section'>
                    {!prevImg ? (
                      <div className='custom_upload_section'>
                        <label
                          htmlFor='profile_image'
                          className='social_cover_image_upload_btn'>
                          <BsCloudUpload className='social_cover_image_upload_icon' />
                        </label>
                        <input
                          type='file'
                          id='profile_image'
                          className='file_input'
                          onChange={(e) => handleProfileImageChange(e)}
                        />
                      </div>
                    ) : (
                      <div className='custom_modal_prev_image_section'>
                        <img
                          src={prevImg}
                          className='custom_modal_prev_image'
                        />
                        <button
                          className='custom_modal_close_btn'
                          onClick={handleCloseProfileImage}>
                          <AiOutlineClose />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='generate_prev_image_section'></div>
                </div>
              }
              footer={
                <div className='custom_modal_footer_section'>
                  {profileBtnDisable ? (
                    <button className='custom_modal_btn disable_custom_modal_btn'>
                      {isBtnLoading ? (
                        <div>
                          <ImSpinner2 className='custom_loader' />
                        </div>
                      ) : (
                        <>Upload</>
                      )}
                    </button>
                  ) : (
                    <button
                      className='custom_modal_btn'
                      onClick={uploadProfileImage}>
                      Upload
                    </button>
                  )}
                </div>
              }
            />
          )}
          {/* Rendering all group members */}
          {openMemeberModal && (
            <CustomPostFormModal
              onClose={onClose}
              title={
                <div className='custom_modal_title_section'>
                  <button
                    className='custom_modal_header_btn'
                    onClick={handleCloseModal}>
                    <BiArrowBack />
                  </button>
                  <div className='custom_modal_title_text'>
                    View block members
                  </div>
                </div>
              }
              body={
                <div className='custom_modal_body_section members_modal_body'>
                  {isMemberLoading ? (
                    <UserListLoader />
                  ) : (
                    <>
                      {members.map((profile, index) => (
                        <div className='modal_user_card' key={index}>
                          <div
                            className='block_member_info_section'
                            onClick={() =>
                              redirectToProfile(profile.record.bins.handleUn)
                            }>
                            <img
                              src={profile.record.bins.profilePic || UserAvatar}
                              className='modal_user_card_image'
                              alt=''
                              srcSet=''
                            />
                            <span className='block_user_card_name'>
                              {profile.record.bins.fn} {profile.record.bins.ln}
                            </span>
                            <span className='block_author_tag'>
                              {profile.record.bins.handleUn ===
                                group.g_c_dun && (
                                <RiUserStarFill className='admin_icon' />
                              )}
                            </span>
                            <span className='admin'>
                              {admins.includes(
                                profile.record.bins.handleUn
                              ) && (
                                <RiUserSettingsLine className='admin_icon' />
                              )}
                            </span>
                          </div>

                          {profile.record.bins.handleUn === group.g_c_dun && (
                            <>
                              {profile.record.bins.handleUn !==
                                group.g_c_dun && (
                                <button
                                  className='mod_button'
                                  onClick={() =>
                                    handleAddAdmin(profile.record.bins.handleUn)
                                  }>
                                  <RiUserSettingsLine />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              }
            />
          )}
          <div
            className='block_profile_container'
            onScroll={(e) => handleScroll(e)}>
            {/* Block image section */}
            <div className='block_image_container'>
              <div className='profile_cover_image_box'>
                {group.g_c_img ? (
                  <img
                    src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${group.g_c_img}`}
                    className={
                      group.g_c_img
                        ? "social_cover_image"
                        : "social_cover_image_empty"
                    }
                  />
                ) : (
                  <div className='empty_group_image'></div>
                )}

                {group.g_c_dun === user.handleUn && (
                  <button
                    className='social_cover_modal_btn'
                    onClick={() => setOpenCoverModal(true)}>
                    <AiOutlineCamera className='_icon' />
                  </button>
                )}
              </div>

              {/* Block profile picture section */}
              <div className='block_profile_image_container'>
                {!group.g_p_img ? (
                  <img src={UserAvatar} className={"block_profile_image"} />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${group.g_p_img}`}
                    className={"block_profile_image"}
                  />
                )}

                {group.g_c_dun === user.handleUn && (
                  <button
                    className='block_profile_image_btn'
                    onClick={() => setProfileModal(true)}>
                    <AiOutlineCamera className='_icon' />
                  </button>
                )}
              </div>
            </div>

            {/* Block button section */}
            <div className='block_profile_button_section'>
              {group.g_c_dun === user.handleUn ? (
                <div>
                  {/* Blockcast button */}
                  <button
                    className='group_msg_button'
                    onClick={() => navigate(`/blockcast/${group.g_id}`)}>
                    <GrChannel />
                  </button>
                  {/* Settings button */}
                  <button
                    className='group_msg_button'
                    onClick={() => handleRedirectToEditPage()}>
                    <FiSettings className='settings_icon' />
                  </button>

                  {/* Block analytics button */}
                  <button
                    className='group_msg_button'
                    onClick={() => handleRedirectToAnalytics()}>
                    <FiTrendingUp className='settings_icon' />
                  </button>
                </div>
              ) : (
                <div className='block_profile_button_section'>
                  {/* Blockcast button */}
                  <button
                    className='group_msg_button'
                    onClick={() => navigate(`/blockcast/${group.g_id}`)}>
                    <GrChannel />
                  </button>

                  {/* Join block button */}
                  {members.includes(user.handleUn) ? (
                    <button
                      className={
                        !members.includes(user.handleUn)
                          ? "block_joining_btn"
                          : "block_joined_btn"
                      }
                      onClick={() => followedGroup()}>
                      {!members.includes(user.handleUn) ? (
                        <BiUserPlus />
                      ) : (
                        <BiUserCheck />
                      )}
                    </button>
                  ) : (
                    <>
                      {join === "none" ? null : (
                        <button
                          className={
                            !group.g_mem.includes(user.handleUn)
                              ? "block_joining_btn"
                              : "block_joined_btn"
                          }
                          onClick={() => followedGroup()}>
                          {!group.g_mem.includes(user.handleUn) ? (
                            <BiUserPlus />
                          ) : (
                            <BiUserCheck />
                          )}
                        </button>
                      )}
                    </>
                  )}

                  {/* DM button */}
                  {dm === "all" ? (
                    <button
                      className='group_msg_button'
                      onClick={() => handleCreateMessage(group)}>
                      <AiOutlineMail />
                    </button>
                  ) : (
                    <>
                      {dm === "mem" ? (
                        <>
                          {group.g_mem.includes(user.handleUn) ? (
                            <button
                              className='group_msg_button'
                              onClick={() => handleCreateMessage(group)}>
                              <AiOutlineMail />
                            </button>
                          ) : null}
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Block information setion */}
            <div className='block_info_section'>
              <span className='block_name'>{group.g_n}</span>
              {group.tob === "business" && <span class='icon_block'></span>}
              <span className='block_type'>{group.g_type}</span>

              <React.Fragment>
                {viewDetails === "all" ? (
                  <>
                    {/* Block details */}
                    <div className='block_bio'>
                      {group.g_bio.length > 50 ? (
                        <>{group.g_bio.slice(0, 50)}....</>
                      ) : (
                        <>{group.g_bio}</>
                      )}
                    </div>
                    {/* Block creator link */}
                    <div className='creator_link'>
                      <span className=''>View Cretor profile</span>
                      <Link
                        to={`/user/profile/${group.g_c_dun}`}
                        className='profile_link'>
                        {group.g_c_fn} {group.g_c_ln}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {viewDetails === "mem" ? (
                      <>
                        {group.g_mem.includes(user.handleUn) ? (
                          <>
                            {/* Block details */}
                            <div className='block_bio'>
                              {group.g_bio.length > 50 ? (
                                <>{group.g_bio.slice(0, 50)}....</>
                              ) : (
                                <>{group.g_bio}</>
                              )}
                            </div>
                            {/* Block creator link */}
                            <div className='creator_link'>
                              <span className=''>View Cretor profile</span>
                              <Link
                                to={`/user/profile/${group.g_c_dun}`}
                                className='profile_link'>
                                {group.g_c_fn} {group.g_c_ln}
                              </Link>
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </>
                )}
              </React.Fragment>

              {/* Block members list */}
              {group.g_c_dun === user.handleUn ? (
                <div
                  className='block_memners'
                  onClick={() => handleOpenMemeberModal()}>
                  Members:{" "}
                  <span className='block_member_count'>
                    {intToString(members.length) || "0"}
                  </span>
                </div>
              ) : (
                <React.Fragment>
                  {viewListDetails === "all" ? (
                    <div
                      className='block_memners'
                      onClick={() => handleOpenMemeberModal()}>
                      Members:{" "}
                      <span className='block_member_count'>
                        {intToString(members.length) || "0"}
                      </span>
                    </div>
                  ) : (
                    <React.Fragment>
                      {viewListDetails === "mem" ? (
                        <React.Fragment>
                          {group.g_mem.includes(user.handleUn) ? (
                            <div
                              className='block_memners'
                              onClick={() => handleOpenMemeberModal()}>
                              Members:{" "}
                              <span className='block_member_count'>
                                {intToString(members.length) || "0"}
                              </span>
                            </div>
                          ) : null}
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>

            {/* Block post form */}
            {group.g_c_dun === user.handleUn ? (
              <GroupForm
                createEventDetails={createEventDetails}
                group={group}
              />
            ) : (
              <>
                {postDetails ? (
                  <>
                    {postDetails === "all" ? (
                      <GroupForm
                        createEventDetails={createEventDetails}
                        group={group}
                      />
                    ) : (
                      <>
                        {postDetails === "mem" ? (
                          <>
                            {group.g_mem.includes(user.handleUn) ? (
                              <GroupForm
                                createEventDetails={createEventDetails}
                                group={group}
                              />
                            ) : null}
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                ) : (
                  <GroupForm />
                )}
              </>
            )}

            {/* Block nested routes */}
            {group.blockPrivacy ? (
              <>
                {group.blockPrivacy === "all" ? (
                  <>
                    <div className='block_neted_routes'>
                      <button
                        className={
                          activeState === "post"
                            ? "block_main_tab active_block_main_tab"
                            : "block_main_tab"
                        }
                        onClick={() => setActiveState("post")}>
                        Post
                      </button>

                      <button
                        className={
                          activeState === "events"
                            ? "block_main_tab active_block_main_tab"
                            : "block_main_tab"
                        }
                        onClick={() => setActiveState("events")}>
                        Events
                      </button>
                    </div>
                    <div className='render_block_component'>
                      {activeState === "post" ? (
                        <GroupPostContainer activeState={activeState} />
                      ) : (
                        <GroupEvent activeState={activeState} />
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {group.blockPrivacy === "members" ? (
                      <>
                        {group.g_mem.includes(user.handleUn) ? (
                          <>
                            <div className='block_neted_routes'>
                              <button
                                className={
                                  activeState === "post"
                                    ? "block_main_tab active_block_main_tab"
                                    : "block_main_tab"
                                }
                                onClick={() => setActiveState("post")}>
                                Post
                              </button>

                              <button
                                className={
                                  activeState === "events"
                                    ? "block_main_tab active_block_main_tab"
                                    : "block_main_tab"
                                }
                                onClick={() => setActiveState("events")}>
                                Events
                              </button>
                            </div>
                            <div className='render_block_component'>
                              {activeState === "post" ? (
                                <GroupPostContainer activeState={activeState} />
                              ) : (
                                <GroupEvent activeState={activeState} />
                              )}
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              <>
                <div className='block_neted_routes'>
                  <button
                    className={
                      activeState === "post"
                        ? "block_main_tab active_block_main_tab"
                        : "block_main_tab"
                    }
                    onClick={() => setActiveState("post")}>
                    Post
                  </button>

                  <button
                    className={
                      activeState === "events"
                        ? "block_main_tab active_block_main_tab"
                        : "block_main_tab"
                    }
                    onClick={() => setActiveState("events")}>
                    Events
                  </button>
                </div>
                <div className='render_block_component'>
                  {activeState === "post" ? (
                    <GroupPostContainer activeState={activeState} />
                  ) : (
                    <GroupEvent activeState={activeState} />
                  )}
                </div>
              </>
            )}
          </div>
        </MainLayout>
      ) : (
        <BlockSkeleton />
      )}
    </React.Fragment>
  );
};

export default Group;
