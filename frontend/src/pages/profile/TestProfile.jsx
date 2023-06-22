/** @format */

import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  useParams,
  Link,
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";
import MainLayout from "../../layouts/main-layout.component";
import {
  AiOutlineCamera,
  AiOutlineClose,
  AiFillCheckCircle,
  AiFillHeart,
} from "react-icons/ai";
import {
  BsCloudUpload,
  BsGraphDown,
  BsEmojiLaughingFill,
  BsFillEmojiDizzyFill,
  BsArrowLeft,
} from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../Assets/userAvatar.webp";
import axios from "axios";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import SkeletonLoaderProfile from "../../components/SkeletonLoading/SkeletonLoaderProfile";
import CustomPostFormModal from "../../components/modal/CustomPostForm";
import { BiUserPlus, BiUserCheck } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
import Compressor from "compressorjs";
import { BiArrowBack } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";

import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectToken,
  selectProfile,
  selectIsLoading,
  selectUpdateUser,
} from "../../redux/_user/userSelectors";
import {
  fetchProfileDetails,
  updateProfileCoverImage,
  updateProfileImage,
  handleFollowUser,
} from "../../redux/_user/userSlice";
import { setPageType } from "../../redux/_page/pageSlice";

const TestProfile = ({ setScrollAxis, selectBlockcast }) => {
  const dispatch = useDispatch();
  const isToken = useSelector(selectToken);
  const isUser = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  const isPageLoading = useSelector(selectIsLoading);
  const updateUser = useSelector(selectUpdateUser);
  const { handleUn } = useParams();
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();

  // const [profile, setProfile] = useState(null);
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImg, setProfileImage] = useState("");
  const [openHideModal, setOpenHideModal] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState("");
  const [verify, setVerify] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [prevScrollDirection, setPrevScrollDirection] = useState(0);
  const [handleOpenProfileImage, setHandleOpenProfileImage] = useState(false);
  const [openEmojiLike, setOpenEmojiLike] = useState(false);
  const [query, setQuery] = useState("");
  const [profileId, setProfileId] = useState("");
  const [coverBtnDisable, setCoverBtnDisable] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [profileBtnDisable, setProfileBtnDisable] = useState(true);

  const [isPLoading, setIsPLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [selectUrl, setSelectUrl] = useState("");
  const [isDisableBtn, setIsDisableBtn] = useState(true);
  const [isBtnPLoading, setIsBtnPLoading] = useState(false);
  const [formData, setFormData] = useState({
    prompt: "",
    negative_prompt: null,
    width: "120",
    height: "120",
    samples: "",
  });

  useLayoutEffect(() => {
    dispatch(setPageType("profile"));
  });

  // *** Fetch user profile details
  useEffect(() => {
    console.log(">>>> This function again call <<<<");
    const data = {
      handleUn: handleUn,
      isToken,
      myHandleUn: isUser.handleUn,
    };
    const pro = dispatch(fetchProfileDetails(data));
  }, [isToken, handleUn, updateUser]);

  useLayoutEffect(() => {
    setPageType("profile");
  }, []);

  // *** Profile cover modal handler
  const coverModalHandler = () => {
    setOpenCoverModal(true);
  };
  // *** Profile cover image chnage handler
  const handleCoverImageChange = (e) => {
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setCoverImg(e.target.files[0]);
  };
  // *** Click handle for closing preview image..
  const closePrevImage = () => {
    setPreviewImage("");
    setCoverImg("");
    setProfileImage("");
    setSelectUrl("");
  };
  // *** Upload profile cover image
  const handleProfileCoverImage = async () => {
    setCoverBtnDisable(true);
    setIsBtnLoading(true);
    const data = { coverImg: coverImg, isToken };
    await dispatch(updateProfileCoverImage(data));
    try {
      setIsBtnLoading(false);
      setPreviewImage("");
      setCoverImg("");
      setOpenCoverModal("");
    } catch (error) {
      console.log("ERROR");
    }
  };

  // *** Profile image change handler
  const profileModalHandler = () => {
    setOpenProfileModal(true);
  };

  // *** Handle profile image input file change handler
  const handleProfileImageChange = (e) => {
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    // setProfileImage(e.target.files[0]);
    const image = e.target.files[0];
    new Compressor(image, {
      quality: 0.7, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        // setCompressedFile(res);
        setProfileImage(compressedResult);
      },
    });
  };

  // *** Uploading profile image
  const handleProfileImage = async () => {
    setIsBtnLoading(true);
    setProfileBtnDisable(true);
    const data = { profileImg: profileImg, isToken };
    await dispatch(updateProfileImage(data));
    try {
      setOpenProfileModal(false);
      setIsBtnLoading(false);
      setPreviewImage("");
      setProfileImage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (userId, flwr) => {
    const data = { isToken, userId };
    dispatch(handleFollowUser(data));
  };

  // *** Profile visitors
  useEffect(() => {
    if (handleUn !== isUser.handleUn) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + isToken);

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `${process.env.REACT_APP_URL_LINK}api/users/visitors/${handleUn}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    }
  }, []);

  useEffect(() => {
    if (!isUser.isVerified) {
      setVerify(true);
    } else {
      setVerify(false);
    }
  }, []);

  // *** Verify profile
  const verifyProfile = () => {
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/users/verify/profile/`,
      headers: {
        Authorization: "Bearer " + isToken,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setIsResponse(true);
        setResponseMsg(response.data.msg);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    const checkBadge = async () => {
      var axios = require("axios");

      var config = {
        method: "put",
        url: `${process.env.REACT_APP_URL_LINK}api/users/check/badges`,
        headers: {
          Authorization: "Bearer " + isToken,
        },
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const timer = setTimeout(() => {
      checkBadge();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setOpenCoverModal(false);
    setOpenProfileModal(false);
    setPreviewImage("");
    setCoverImg("");
    setProfileImage("");
    setHandleOpenProfileImage(false);
  };

  function handleScroll(e) {
    // console.log(e.target.scrollTop);
    // setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    // console.log(e.target.scrollTop);
    if (prevScrollDirection < currentScrollPos) {
      // setScrollDirection('down');
      // console.log("Down");
      setScrollAxis("Down");
    } else {
      // setScrollDirection('up');
      // console.log("up");
      setScrollAxis("Up");
    }
    setPrevScrollDirection(currentScrollPos);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useLayoutEffect(() => {
    setPageType("social");
  }, []);

  // *** Handle to create chat
  const handleCreateChat = (profile) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + isToken);
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
        // setOpenSingleChatModal(false);
        // setSearch("");
        // setName("");
        selectBlockcast(result.blockcast);
        navigate(`/blockcast/single/${result.blockcast.b_id}`);
      })
      .catch((error) => console.log("error", error));
  };

  const handleShowProfileImage = () => {
    setHandleOpenProfileImage(true);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenEmojiLike(false);
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
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    if (!coverImg) {
      setCoverBtnDisable(true);
    } else {
      setCoverBtnDisable(false);
    }
  }, [coverImg]);

  // profileImg
  useEffect(() => {
    if (!previewImage) {
      setProfileBtnDisable(true);
    } else {
      setProfileBtnDisable(false);
    }
  }, [previewImage]);

  const generateImages = () => {
    setIsPLoading(true);
    setIsDisable(true);
    setFormData({
      prompt: "",
      negative_prompt: null,
      width: "120",
      height: "120",
      samples: "",
    });
    axios
      .post("http://websiteclubs.com:3300/ai/image-generation", formData)
      .then((response) => {
        console.log("RESPONSE: ", response);
        setImageUrls(response.data.data.response.output);
        setIsPLoading(false);
      })
      .catch((Error) => {
        console.log("Error: ", Error);
      });
  };

  const handleSelectImage = (url) => {
    setSelectUrl(url);
    setPreviewImage(url);
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!formData.prompt.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [formData.prompt]);

  return (
    <React.Fragment>
      {isPageLoading ? (
        <SkeletonLoaderProfile />
      ) : (
        <>
          {profile ? (
            <MainLayout goBack={true} title={`${profile.fn} ${profile.ln}`}>
              {openCoverModal && (
                <CustomPostFormModal
                  title={
                    <div className='custom_modal_title_section'>
                      <button
                        className='custom_modal_header_btn'
                        onClick={handleCloseModal}>
                        <BiArrowBack />
                      </button>
                      <div className='custom_modal_title_text'>
                        {t("Upload cover image")}
                      </div>
                    </div>
                  }
                  body={
                    <div className='custom_modal_body_section'>
                      <div className='upload_section'>
                        {!previewImage ? (
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
                              onChange={(e) => handleCoverImageChange(e)}
                            />
                          </div>
                        ) : (
                          <div className='custom_modal_prev_image_section'>
                            <img
                              src={previewImage}
                              className='custom_modal_prev_image'
                            />
                            <button
                              className='custom_modal_close_btn'
                              onClick={closePrevImage}>
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
                            <>{t("Upload")}</>
                          )}
                        </button>
                      ) : (
                        <button
                          className='custom_modal_btn'
                          onClick={handleProfileCoverImage}>
                          {t("Upload")}
                        </button>
                      )}
                    </div>
                  }
                />
              )}

              {openProfileModal && (
                <CustomPostFormModal
                  title={
                    <div className='custom_modal_title_section'>
                      <button
                        className='custom_modal_header_btn'
                        onClick={handleCloseModal}>
                        <BiArrowBack />
                      </button>
                      <div className='custom_modal_title_text'>
                        {t("Upload profile image")}
                      </div>
                    </div>
                  }
                  body={
                    <div className='custom_modal_body_section'>
                      <div className='upload_section'>
                        {!previewImage ? (
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
                              src={previewImage}
                              className='custom_modal_prev_image'
                            />
                            <button
                              className='custom_modal_close_btn'
                              onClick={closePrevImage}>
                              <AiOutlineClose />
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Divider */}
                      <div class='__divider'>OR</div>

                      <div className='profile_avatar_generate_section'>
                        {/* Promt section */}
                        <div className='prompt_form_section'>
                          <input
                            type='text'
                            name='prompt'
                            placeholder='Enter prompt to generate image'
                            className='prompt_modal_input'
                            value={formData.prompt}
                            onChange={(e) => handleChange(e)}
                          />
                          {isDisable ? (
                            <button className='disable_modal_btn'>
                              {t("Generate images")}
                            </button>
                          ) : (
                            <button
                              className='image_generate_btn'
                              onClick={generateImages}>
                              {t("Generate images")}
                            </button>
                          )}
                        </div>
                        {isPLoading ? (
                          <div
                            className='progress'
                            role='progressbar'
                            aria-label='Basic example'
                            aria-valuenow='0'
                            aria-valuemin='0'
                            aria-valuemax='100'>
                            <div
                              className='progress-bar'
                              style={{ width: "50%" }}></div>
                          </div>
                        ) : (
                          <>
                            {(imageUrls || []).length > 0 ? (
                              <div className='generate_prev_image_section'>
                                {imageUrls.map((data, index) => (
                                  <div
                                    key={index}
                                    className='generated_image_section'>
                                    {selectUrl === data && (
                                      <AiFillCheckCircle className='select_icon' />
                                    )}
                                    <img
                                      src={data}
                                      className='generate_img_preview'
                                      onClick={() => handleSelectImage(data)}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className='generate_empty_preview_image'>
                                No preview image found
                              </div>
                            )}
                          </>
                        )}
                      </div>
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
                            <>{t("Upload")}</>
                          )}
                        </button>
                      ) : (
                        <button
                          className='custom_modal_btn'
                          onClick={handleProfileImage}>
                          {t("Upload")}
                        </button>
                      )}
                    </div>
                  }
                />
              )}

              {handleOpenProfileImage && (
                <CustomPostFormModal
                  title={
                    <div className='profile_image_modal_header'>
                      <button
                        className='profile_close_modal_button'
                        onClick={handleCloseModal}>
                        <BsArrowLeft />
                      </button>
                      <span className='modal_header_title'>Profile Image</span>
                      <button>
                        <MdMoreHoriz />
                      </button>
                    </div>
                  }
                  onClose={handleCloseModal}
                  body={
                    profile.profilePic ? (
                      <div className='modal_profile_image_body'>
                        <div className='__modal_profile_image'>
                          <img
                            src={profile.profilePic}
                            className='__profile_image'
                          />
                        </div>
                        <div className='modal_btns_sections'>
                          <button className='modal_emoji_btn'>
                            <AiFillHeart />
                          </button>
                          <button className='modal_emoji_btn'>
                            <BsEmojiLaughingFill />
                          </button>
                          <button className='modal_emoji_btn'>
                            <BsFillEmojiDizzyFill />
                          </button>
                          <button className='modal_emoji_btn'>
                            <AiFillHeart />
                          </button>
                        </div>

                        <div className='modal_btns_sections'>
                          <button className='modal_emoji_btn'>0</button>
                          <button className='modal_emoji_btn'>0</button>
                          <button className='modal_emoji_btn'>0</button>
                          <button className='modal_emoji_btn'>0</button>
                        </div>
                      </div>
                    ) : (
                      <div className='empty_profile_pic'>
                        User did not set any profile picture
                      </div>
                    )
                  }
                />
              )}
              {/* Profile Image container */}
              <div className='social_profile_image_box'>
                {profile.c_i ? (
                  <div className='profile_cover_image_box'>
                    <img
                      src={
                        profile.c_i
                          ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${profile.c_i}`
                          : ""
                      }
                      className={
                        profile.c_i
                          ? "social_cover_image"
                          : "social_cover_image_empty"
                      }
                    />
                    {profile.handleUn === isUser.handleUn && (
                      <button
                        className='social_cover_modal_btn'
                        onClick={coverModalHandler}>
                        <AiOutlineCamera className='_icon' />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className='profile_cover_image_box'>
                    {profile.handleUn === isUser.handleUn && (
                      <button
                        className='social_cover_modal_btn'
                        onClick={coverModalHandler}>
                        <AiOutlineCamera className='_icon' />
                      </button>
                    )}
                  </div>
                )}

                <div className='social_profile_picture_box'>
                  <img
                    id='view_image'
                    onClick={handleShowProfileImage}
                    src={
                      profile.p_i
                        ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${profile.p_i}`
                        : UserAvatar
                    }
                    className={
                      profile.p_i
                        ? "social_profile_img"
                        : "social_profile_img social_empty_profile_img_image"
                    }
                  />
                  {isUser.handleUn === profile.handleUn && (
                    <button
                      id='upload_image'
                      className='social_profile__modal_btn'
                      onClick={profileModalHandler}>
                      <AiOutlineCamera className='_icon' />
                    </button>
                  )}
                </div>
              </div>

              {/* Follow folling button */}
              <div className='social_profile_btn_section'>
                {profile.handleUn !== isUser.handleUn ? (
                  <div className='other_profile_buttons'>
                    {profile.msg_prv === "none" ? null : (
                      <>
                        {profile.msg_prv === "flwr" ? (
                          <>
                            {profile.flwr.includes(isUser.handleUn) ? (
                              <button
                                className='profile_msg_btn'
                                onClick={() => handleCreateChat(profile)}>
                                <MdEmail />
                              </button>
                            ) : null}
                          </>
                        ) : (
                          <button
                            className='profile_msg_btn'
                            onClick={() => handleCreateChat(profile)}>
                            <MdEmail />
                          </button>
                        )}
                      </>
                    )}

                    <button
                      className={
                        profile.flwr.includes(isUser.handleUn, profile.flwr)
                          ? "follwed_btn follow_following_btn"
                          : "follow_following_btn"
                      }
                      onClick={() =>
                        handleFollow(profile.handleUn, profile.flwr)
                      }>
                      {profile.flwr.includes(isUser.handleUn) ? (
                        <BiUserCheck />
                      ) : (
                        <BiUserPlus />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className='profile_buttons'>
                    <button
                      className='social_profile_edit_btn'
                      onClick={() =>
                        navigate(`/profile/analytics/${isUser.handleUn}`)
                      }>
                      <BsGraphDown />
                    </button>
                    {profile && (
                      <button
                        className='social_profile_edit_btn'
                        onClick={() => navigate(`/badge`)}>
                        <HiOutlineBadgeCheck />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Information section */}
              <div className='profile_info_section'>
                {/* Name */}
                <div className='social_profile_name'>
                  {profile.dn ? (
                    <>{profile.dn}</>
                  ) : (
                    <>
                      {profile.fn} {profile.ln}
                    </>
                  )}
                  <span className='social_profile_handleUsername'>
                    @{profile.handleUn}
                  </span>
                  <br />
                </div>

                {/* Username */}
                <div className='social_profile_bio'>{profile.p_bio || ""}</div>

                {/* Gender */}
                {profile.gen ? (
                  <div className='profile_gender'>
                    <span className='gender_header'>Gender: </span>
                    {profile.gen}
                  </div>
                ) : null}

                {/* Country */}
                {profile.gen ? (
                  <div className='profile_gender'>
                    <span className='gender_header'>Country: </span>
                    {profile.con}
                  </div>
                ) : null}

                {/* profile bio */}
                {profile.dob ? (
                  <div className='profile_gender'>
                    <span className='gender_header'>DOB: </span>
                    {profile.dob}
                  </div>
                ) : null}

                {/* profile view button */}
                <div className='social_profile_info_btn'></div>

                {/* Follow following */}
                <div className='social_profile_follower_section'>
                  {/* Following */}
                  <Link
                    to={`/user/profile/follower-following/${handleUn}`}
                    className='social_follower_following_list'>
                    Following:
                    <span className='social_follow_follower_count'>
                      {profile.flw_c || "0"}
                    </span>
                  </Link>

                  {/* Following */}
                  <Link
                    to={`/user/profile/follower-following/${handleUn}`}
                    className='social_follower_following_list'>
                    Follower:
                    <span className='social_follow_follower_count'>
                      {profile.flwr_c || "0"}
                    </span>
                  </Link>
                </div>

                {/* Profile nested routes */}
                <div className='social_profile_routes_section'>
                  <div className='nav_routes'>
                    <NavLink
                      to={`/user/profile/${handleUn}`}
                      className={({ isActive }) =>
                        isActive
                          ? "social_nav_item social_active_nav_item"
                          : "social_nav_item"
                      }>
                      {t("Activity")}
                    </NavLink>
                  </div>

                  {/* Mentions */}
                  <div className='nav_routes'>
                    <NavLink
                      to={`/user/profile/${handleUn}/mentions`}
                      className={({ isActive }) =>
                        isActive
                          ? "social_nav_item social_active_nav_item"
                          : "social_nav_item"
                      }>
                      {t("Mentions")}
                    </NavLink>
                  </div>
                </div>

                <div className='profile_outlet'>{/* <Outlet /> */}</div>
              </div>
            </MainLayout>
          ) : (
            <MainLayout goBack={true} title={`${""} ${""}`}>
              <div className='empty_profile'>{t("No user found")}</div>
            </MainLayout>
          )}
        </>
      )}
    </React.Fragment>
  );
};
export default TestProfile;
