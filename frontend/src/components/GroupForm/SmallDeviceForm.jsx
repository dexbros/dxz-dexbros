/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import {
  addGroupPost,
  updateGroupPost,
  setUpdateGroup,
} from "../../redux/Group/group.actions";
import { useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import {
  AiOutlineFileGif,
  AiOutlineCloudUpload,
  AiOutlineClose,
  AiOutlineRight,
} from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import CustomPostFormModal from "../modal/CustomPostForm";
import {
  addNewPost,
  appendSinglePost,
} from "../../redux/GroupPost/groupPost.action";

import { GrGallery } from "react-icons/gr";
import {
  BsCalendar3Event,
  BsCameraVideo,
  BsEmojiLaughing,
} from "react-icons/bs";
import { addEventFirst } from "../../redux/GroupPost/groupPost.action";
import CustomPostForm from "../modal/CustomPostForm";
import { IoMdAdd } from "react-icons/io";
import { BiUserPlus, BiUserCheck } from "react-icons/bi";

// Tookit
import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import {
  handleCreatePost,
  prepandPosts,
} from "../../redux/_blockPost/blockPostSlice";

const SmallDeviceForm = ({
  group,
  appendSinglePost,
  setUpdateGroup,
  createEventDetails,
  addEventFirst,
}) => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const { id } = useParams();

  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState("");
  const [content, setContent] = React.useState("");
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [openEventModal, setOpenEventModal] = React.useState(false);
  const [openPostPrivacy, setOpenPostPrivacy] = React.useState(false);
  const [postPrivacy, setPostPrivacy] = React.useState("Public");
  const [openPostType, setOpenPostType] = React.useState(false);
  const [typeOfPost, setTypeOfPost] = React.useState("np");

  const [EventisDisable, setEventIsDisable] = React.useState(true);
  const [formatMsg, setFormatMsg] = React.useState(false);
  const [wordCount, setWordCount] = React.useState(0);
  const [visibleMsg, setVisibleMsg] = React.useState(false);

  const [location, setLocation] = React.useState("");
  const [pricing, setPricing] = React.useState("");
  const [prevImg, setPrevImg] = React.useState("");
  const [eventimage, setEventimage] = React.useState("");
  const [eventType, setEventType] = React.useState("");
  const [link, setLink] = React.useState("");
  const [price, setPrice] = React.useState();
  const [eventImg, setEventImg] = React.useState("");
  const [prevEventImg, setPrevEventImg] = React.useState("");
  const [err, setErr] = React.useState("");
  const [eventMode, setEventMode] = React.useState("online");
  const [city, setCity] = React.useState("");
  const [country, setCounty] = React.useState("");
  const [disableBtn, setDisableBtn] = React.useState(true);

  // **************************

  const [title, setTitle] = React.useState("");
  const [isFocusTitle, setIsFocusTitle] = React.useState(false);
  const [isTitleEmpty, setIsTitleEmpty] = React.useState(true);

  const [description, setDescription] = React.useState("");
  const [isFocusDescription, setIsFocusDescription] = React.useState(false);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = React.useState(true);

  const [startdate, setstartdate] = React.useState("");
  const [isStartDateError, setIsStartDateError] = React.useState(true);
  const [isStartDateErrorMsg, setIsStartDateErrorMsg] = React.useState("");

  const [enddate, setenddate] = React.useState("");
  const [isEndDateError, setIsEndDateError] = React.useState(true);
  const [isEndDateErrorMsg, setIsEndDateErrorMsg] = React.useState("");

  const [starttime, setstarttime] = React.useState("");

  const [endtime, setendtime] = React.useState("");
  const [prevVideo, setPrevVideo] = React.useState("");

  const [progressBar, setProgressBar] = React.useState(0);
  const [showProgressBar, setShowProgressBar] = React.useState(false);

  const [openMore, setOpenMore] = React.useState(false);
  const [moreCredMenu, setMoreCredMenu] = React.useState(false);
  const [selectCred, setSelectCred] = React.useState("");
  const [statusText, setStatusText] = React.useState("");
  const [userLocation, setUserLocation] = React.useState("");

  const handleCloseImage = () => {
    setImage("");
    setImagePreview("");
  };
  React.useEffect(() => {
    if (!content.trim()) {
      setIsDisable(true);
      // if (!image) {
      //   setIsDisable(true);
      // } else {
      //   setIsDisable(false);
      // }
    } else {
      setIsDisable(false);
    }
  }, [content, image]);

  const handleFocus = () => {
    setOpenModal(true);
  };
  // *** Handle group post input change
  const handleGroupPost = (e) => {
    setContent(e.target.value.slice(0, 200));
  };

  // *** Handle image change
  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  // *** Handle close image
  const closePrevImage = () => {
    setImage("");
    setPrevImage("");
    setPrevVideo("");
  };

  // *** Add emoji to text
  const addEmoji = (e) => {
    setContent((prev) => prev + e.native);
  };

  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // *** Handle post privacy
  const handlePrivacySettings = (value) => {
    setPostPrivacy(value);
    setOpenPostPrivacy(false);
  };

  // *** Handle post catagory
  const handlePostCatagory = (value) => {
    setTypeOfPost(value);
    setOpenPostType(false);
  };

  // *** Create Block post
  const handleSubmit = async () => {
    const data = {
      token: token,
      id: id,
      post: {
        image: image,
        content: content,
        gif: gif,
        user_id: user.u_id,
        user_fn: user.fn,
        user_ln: user.ln,
        user_DUN: user.handleUn,
        profilePic: user.p_i,
        group_id: id,
        privacy: postPrivacy,
        post_type: typeOfPost,
        postOf: user.handleUn,
        statusText: statusText,
        userLocation: userLocation,
      },
    };
    const result = await dispatch(handleCreatePost(data));
    dispatch(prepandPosts(result));
    setImage("");
    setContent("");
    setPrevImage("");
    setIsDisable(true);
    setWordCount(0);
    setVisibleMsg(false);
    setIsLoading(false);
    setOpenModal(false);
    /**
     *
     */
    // setIsLoading(true);
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);

    // var formdata = new FormData();
    // formdata.append("image", image);
    // formdata.append("content", content);
    // formdata.append("gif", gif);
    // formdata.append("user_id", user.u_id);
    // formdata.append("user_fn", user.fn);
    // formdata.append("user_ln", user.ln);
    // formdata.append("user_DUN", user.handleUn);
    // formdata.append("profilePic", user.profilePic);
    // formdata.append("group_id", id);
    // formdata.append("privacy", postPrivacy);
    // formdata.append("post_type", typeOfPost);
    // formdata.append("postOf", user.handleUn);
    // formdata.append("statusText", statusText);
    // formdata.append("userLocation", userLocation);

    // var requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: formdata,
    //   redirect: "follow",
    // };
    // fetch(
    //   `${process.env.REACT_APP_URL_LINK}api/group/post/create/post/${id}`,
    //   requestOptions
    // )
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result);
    //     // updateGroupPost(result);
    //     appendSinglePost(result);
    //     setImage("");
    //     setContent("");
    //     setPrevImage("");
    //     setIsDisable(true);
    //     setWordCount(0);
    //     setVisibleMsg(false);
    //     setIsLoading(false);
    //     setUpdateGroup(result);
    //     setOpenModal(false);
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //     setImage("");
    //     setContent("");
    //     setPrevImage("");
    //     setIsDisable(true);
    //     setIsLoading(false);
    //   });
  };

  // *** Handle ctreate block event
  const createEvent = async () => {
    // const data = {
    //   token,
    //   post: {
    //     eventimage: eventimage,
    //     title: title,
    //     description: description,
    //     startdate: startdate,
    //     enddate: enddate,
    //     blockId: id,
    //     type: eventMode,
    //     city: city,
    //     country: country,
    //     link: link,
    //     price: price,
    //   },
    // };
    // const result = await dispatch(handleCreateEvent(data));
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("eventimage", eventImg);
    formdata.append("title", title);
    formdata.append("description", description);

    formdata.append("startdate", startdate);
    formdata.append("enddate", enddate);
    formdata.append("blockId", id);
    formdata.append("type", eventMode);
    formdata.append("city", city);
    formdata.append("country", country);
    formdata.append("link", link);
    // formdata.append("starttime", starttime);
    // formdata.append("endtime", endtime);
    formdata.append("price", price);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/event/create`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setOpenEventModal(false);
        // addEventFirst(result)
      })
      .catch((error) => console.log("error", error));
  };

  const handleEventFileChange = (e) => {
    setPrevEventImg(URL.createObjectURL(e.target.files[0]));
    setEventImg(e.target.files[0]);
  };

  const handleEndDateChange = (e) => {
    setenddate(e.target.value);
  };

  const handleChange = (e) => {
    setstartdate(e.target.value);
  };

  const onClose = () => {
    setOpenModal(false);
    setImage("");
    setContent("");
    setPrevImage("");
    setIsDisable(true);
    setIsLoading(false);
    setPostPrivacy(false);
  };

  const onClose2 = () => {
    setOpenPostPrivacy(false);
  };

  const onClose3 = () => {
    setOpenPostType(false);
  };

  const handleOpenEventModal = () => {
    setOpenEventModal(true);
    setOpenModal(false);
  };
  const onCloseEvent = () => {
    setOpenEventModal(false);
  };

  const handleLinkChange = (event) => {
    const pattern =
      "/^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$/";
    setLink(event.target.value);
  };

  const closePreviewImage = () => {
    setPrevEventImg("");
    eventImg("");
  };

  React.useEffect(() => {
    if (!title.trim() || !description.trim()) {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  });

  React.useEffect(() => {
    if (!title.trim()) {
      setIsTitleEmpty(true);
    } else {
      setIsTitleEmpty(false);
    }
  }, [title]);

  React.useEffect(() => {
    if (!description.trim()) {
      setIsDescriptionEmpty(true);
    } else {
      setIsDescriptionEmpty(false);
    }
  }, [description]);

  React.useEffect(() => {
    const sdate = new Date(startdate).getTime();
    const currentdate = new Date().getTime();
    if (!startdate.trim()) {
      setIsStartDateError(true);
      setIsStartDateErrorMsg("");
    } else {
      if (sdate - currentdate > 0) {
        setIsStartDateError(false);
        // setIsStartDateErrorMsg("");
      } else {
        setIsStartDateError(true);
        setIsStartDateErrorMsg("You cannot select past dates as starting date");
      }
    }
  }, [startdate]);

  React.useEffect(() => {
    if (!enddate.trim()) {
      setIsEndDateError(true);
      setIsEndDateErrorMsg("");
    } else {
      const sdate = new Date(startdate).getTime();
      console.log("start date ", sdate);
      const edate = new Date(enddate).getTime();
      console.log("end date ", edate);

      if (edate - sdate >= 0) {
        setIsEndDateError(false);
      } else {
        setIsEndDateError(true);
        setIsEndDateErrorMsg("End date cannot be before of starting date");
      }
    }
  }, [enddate, startdate]);

  const handleVideoFileChange = (e) => {
    console.log(URL.createObjectURL(e.target.files[0]));
    setPrevVideo(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleCloseCred = () => {
    setOpenMore(false);
    setSelectCred("");
    setStatusText("");
  };
  const handleAddCred = () => {
    setOpenMore(false);
  };

  const handleSelectStatus = (value) => {
    console.log(value);
    setSelectCred(value);
    setMoreCredMenu(false);
  };

  return (
    <React.Fragment>
      <div className='small_screen_block_form_section'>
        {/* Block poxt modal */}
        {openModal && (
          <CustomPostFormModal
            title={
              <div className='post_form_modal_title'>
                <div className='modal_post_form_section'>
                  <button className='post_close_modal_button' onClick={onClose}>
                    <BiArrowBack />
                  </button>
                  <span className='modal_title_text'>Post</span>
                </div>

                {!isDisable && (
                  <button className='_modal_post_button' onClick={handleSubmit}>
                    Post
                  </button>
                )}
              </div>
            }
            body={
              <div className='post_form_modal_body'>
                <div className='modal_textarea_section'>
                  <div className='block_post_modal_body_section'>
                    <div className='block_modal_seation_one'>
                      <img
                        src={
                          user.p_i
                            ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${user.p_i}`
                            : null
                        }
                        className='post_form_user_avatar'
                      />

                      <>
                        <span className='modal_user_name'>
                          {user.fn} {user.ln}
                        </span>
                        <button
                          className='post_cread_btn'
                          onClick={() => setOpenMore(true)}>
                          <span className='post_cread_btn_text'>Add more</span>
                          <AiOutlineRight className='post_cread_btn_icon' />
                        </button>
                      </>
                    </div>
                    <div className='select_cred_container'>
                      {statusText && (
                        <button
                          className='cred_tag'
                          onClick={() => setStatusText("")}>
                          {statusText}
                          <AiOutlineClose className='cred_close_icon' />
                        </button>
                      )}

                      {userLocation && (
                        <button className='cred_tag'>
                          {userLocation}
                          <AiOutlineClose className='cred_close_icon' />
                        </button>
                      )}
                    </div>
                    <textarea
                      className='group_form_input'
                      value={content}
                      placeholder={t("group_frm_placeholder")}
                      onChange={(e) => handleGroupPost(e)}></textarea>
                  </div>
                </div>
                {prevImage && (
                  <div className='image_prev_container'>
                    <div className='modal_form_prev_image'>
                      <img src={prevImage} className='image' />
                    </div>
                    <button onClick={closePrevImage} className='close_btn'>
                      <IoCloseSharp />
                    </button>
                  </div>
                )}

                {prevVideo && (
                  <div className='image_prev_container'>
                    <div className='modal_form_prev_image'>
                      <video
                        width='750'
                        height='500'
                        controls
                        className='image'>
                        <source src={prevVideo} type='video/mp4' />
                      </video>
                    </div>
                    <button onClick={closePrevImage} className='close_btn'>
                      <IoCloseSharp />
                    </button>
                  </div>
                )}

                {showProgressBar && (
                  <div className='progress-bar-section'>
                    <span className='progress-count-num'>{progressBar}%</span>
                    <span
                      style={{
                        backgroundColor: "crimson",
                        backgroundImage: `linear-gradient(90deg, rgba(46,204,113,1) 20%, rgba(255,255,255,1) 20%)`,
                      }}></span>
                  </div>
                )}
              </div>
            }
            footer={
              <div className='post_form_modal_footer'>
                <label className='gallery_icon icon_btn' htmlFor='modal_file'>
                  <GrGallery className='modal_post_footer_icon' />{" "}
                  <span className='icon_text'>Gallery</span>
                </label>
                <input
                  type='file'
                  id='modal_file'
                  className='file_input'
                  accept='.png, .jpg, .jpeg'
                  onChange={(e) => handleFileChange(e)}
                />

                {/* Gif */}
                <button className='icon_btn'>
                  <AiOutlineFileGif className='modal_post_footer_icon' />{" "}
                  <span className='icon_text'>GIF</span>
                </button>

                {/* Emoji icon */}
                <button
                  className='icon_btn'
                  onClick={() => setShowEmoji((prev) => !prev)}>
                  <BsEmojiLaughing className='modal_post_footer_icon' />{" "}
                  <span className='icon_text'>Emoji</span>
                </button>

                <label className='gallery_icon icon_btn' htmlFor='video_file'>
                  <BsCameraVideo className='modal_post_footer_icon' />{" "}
                  <span className='icon_text'>Gallery</span>
                </label>
                <input
                  type='file'
                  id='video_file'
                  className='file_input'
                  accept='video/mp4,video/x-m4v,video/*'
                  onChange={(e) => handleVideoFileChange(e)}
                />

                {/* Event icon */}
                {group.g_c_dun === user.handleUn ? (
                  <button
                    onClick={() => handleOpenEventModal()}
                    className='icon_btn'>
                    <BsCalendar3Event className='modal_post_footer_icon' />{" "}
                    <span className='icon_text'>Event</span>
                  </button>
                ) : (
                  <React.Fragment>
                    {createEventDetails === "mem" ? (
                      <>
                        {group.g_mem.includes(user.handleUn) ? (
                          <button
                            onClick={() => handleOpenEventModal()}
                            className='icon_btn'>
                            <BsCalendar3Event className='modal_post_footer_icon' />{" "}
                            <span className='icon_text'>Event</span>
                          </button>
                        ) : null}
                      </>
                    ) : null}
                  </React.Fragment>
                )}
              </div>
            }
          />
        )}

        {openMore && (
          <CustomPostForm
            title={
              <div className='modal_post_title'>
                <div className='title_section_one'>
                  <button
                    className='modal_backwrd_icon'
                    onClick={() => handleCloseCred()}>
                    <BiArrowBack />
                  </button>
                  <span className='header_title_text'>Add credentials</span>
                </div>
                <button
                  className={"modal_post_button"}
                  onClick={() => handleAddCred()}>
                  Add
                </button>
              </div>
            }
            body={
              <div className='modal_button_container'>
                <span className='modal_cread_header_text'>
                  Choose answer credential
                </span>
                <br />
                <span className='modal_cread_subheader_text'>
                  Credentials add credibility to your content
                </span>
                <div className='modal_cred_btn_section'>
                  <button
                    className='modal_menu_btn'
                    onClick={() => setMoreCredMenu(true)}>
                    <IoMdAdd className='modal_cred_btn_icon' />
                    Add a credentials
                  </button>

                  {moreCredMenu && (
                    <div className='cred_menu' ref={menuRef}>
                      <li
                        className='cred_list'
                        onClick={() => handleSelectStatus("location")}>
                        Location
                      </li>
                      <li
                        className='cred_list'
                        onClick={() => handleSelectStatus("status")}>
                        Status
                      </li>
                    </div>
                  )}
                </div>

                {selectCred === "status" ? (
                  <textarea
                    type='text'
                    value={statusText}
                    className='modal_textarea'
                    placeholder='Enter post status'
                    onChange={(e) =>
                      setStatusText(e.target.value.slice(0, 10))
                    }></textarea>
                ) : (
                  <>
                    {selectCred === "location" ? (
                      <input
                        type='text'
                        className='input_field'
                        placeholder='Enter your location'
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                      />
                    ) : null}
                  </>
                )}
              </div>
            }
          />
        )}

        {/* Event Modal */}
        {openEventModal && (
          <CustomPostFormModal
            title={
              <div className='post_form_modal_title'>
                <div className='modal_post_form_section'>
                  <button
                    className='post_close_modal_button'
                    onClick={onCloseEvent}>
                    <BiArrowBack />
                  </button>
                  <span className='modal_title_text'>Event</span>
                </div>

                {!disableBtn && (
                  <button className='_modal_post_button' onClick={createEvent}>
                    Post
                  </button>
                )}
              </div>
            }
            body={
              <div className='event_modal_body'>
                {/* Title */}
                <div className='event_form_section'>
                  <input
                    type='text'
                    placeholder={isFocusTitle ? "Enter event title" : ""}
                    className='event_form_input'
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 30))}
                    onFocus={() => setIsFocusTitle(true)}
                    onBlur={() => setIsFocusTitle(false)}
                  />
                  <span
                    className={
                      isFocusTitle || !isTitleEmpty
                        ? "event_form_label focus_title"
                        : "event_form_label"
                    }>
                    Title
                  </span>
                </div>

                {/* Description */}
                <div className='event_textarea_description'>
                  <textarea
                    className='event_textarea'
                    placeholder={
                      isFocusDescription ? "Enter event description" : ""
                    }
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value.slice(0, 200))
                    }
                    onFocus={() => setIsFocusDescription(true)}
                    onBlur={() => setIsFocusDescription(false)}></textarea>
                  <span
                    className={
                      isFocusDescription || !isDescriptionEmpty
                        ? "event_textarea_label focus_textarea"
                        : "event_textarea_label"
                    }>
                    Description
                  </span>
                </div>

                {/* Starting date picker */}
                <div className='event_start_date_section'>
                  <span className='start_date_label'>Start date: </span>
                  <input
                    type='date'
                    className='event_date_picker'
                    min={new Date()}
                    value={startdate}
                    onChange={(e) => setstartdate(e.target.value)}
                  />
                  <br />
                  {isStartDateError && (
                    <>
                      {isStartDateErrorMsg.trim() && (
                        <span className='start_date_err'>
                          {isStartDateErrorMsg}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* End date picker */}
                <div className='event_start_date_section'>
                  <span className='start_date_label'>End date: </span>
                  <input
                    type='date'
                    className='event_date_picker'
                    value={enddate}
                    onChange={(e) => setenddate(e.target.value)}
                  />
                  <br />
                  {isEndDateError && (
                    <>
                      {isEndDateErrorMsg.trim() && (
                        <span className='start_date_err'>
                          {isEndDateErrorMsg}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Starting time picker */}
                {/* <div className='event_start_date_section'>
                  <span className='start_date_label'>Start date: </span>
                  <input
                    type='time'
                    className='event_date_picker'
                    value={starttime}
                    onChange={(e) => setstarttime(e.target.value)}
                  />
                  <br />
                </div> */}
                <span className='radio_label'>Event mode</span>
                <input
                  type='radio'
                  name='eventType'
                  id='online'
                  value='online'
                  onChange={(e) => setEventMode(e.target.value)}
                  className='radio_input'
                  checked={eventMode === "online"}
                />
                <label htmlFor='online' className='radio_label_text'>
                  Online
                </label>
                <input
                  type='radio'
                  name='eventType'
                  id='offline'
                  value='offline'
                  onChange={(e) => setEventMode(e.target.value)}
                  className='radio_input'
                  checked={eventMode === "offline"}
                />
                <label htmlFor='offline' className='radio_label_text'>
                  Offline
                </label>

                <div>
                  {eventMode === "online" ? (
                    <>
                      <input
                        type='text'
                        placeholder='Event official link'
                        className='form_input'
                        pattern={
                          "/^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$/"
                        }
                        value={link}
                        onChange={(e) => handleLinkChange(e)}
                      />
                      <br />
                      <span className='err_msg_input'>{err}</span>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        placeholder='Enter city name'
                        className='form_input'
                        value={city}
                        onChange={(e) => setCity(e.target.value.slice(0, 30))}
                      />
                      <input
                        type='text'
                        placeholder='Enter country name'
                        className='form_input'
                        value={country}
                        onChange={(e) => setCounty(e.target.value.slice(0, 30))}
                      />
                    </>
                  )}
                </div>

                <input
                  type='number'
                  placeholder='Enter entry fees'
                  className='form_input'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />

                {prevEventImg ? (
                  <div className='preview_event_image_section'>
                    <img src={prevEventImg} className='event_preview_image' />
                    <button
                      className='close_prev_btn'
                      onClick={closePreviewImage}>
                      <AiOutlineClose />
                    </button>
                  </div>
                ) : (
                  <div className='upload_icon'>
                    <label htmlFor='file' className='upload_icon'>
                      <AiOutlineCloudUpload />
                    </label>
                    <input
                      type='file'
                      id='file'
                      placeholder='Enter entry fees'
                      className='file_input'
                      onChange={(e) => handleEventFileChange(e)}
                    />
                  </div>
                )}
              </div>
            }
          />
        )}
        <div className='small_screen_form_box'>
          <img
            src={
              user.p_i
                ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${user.p_i}`
                : null
            }
            className='post_form_user_avatar'
          />
          <textarea
            type='text'
            placeholder='Enter new status...'
            className='mobile_post_form'
            onFocus={() => handleFocus()}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  updatePost: state.group.updatePost,
  selectGroup: state.group.selectGroup,
  token: state.user.token,
  user: state.user.user,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  addGroupPost: (data) => dispatch(addGroupPost(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
  setUpdateGroup: (data) => dispatch(setUpdateGroup(data)),
  addNewPost: (data) => dispatch(addNewPost(data)),
  addEventFirst: (data) => dispatch(addEventFirst(data)),
  appendSinglePost: (data) => dispatch(appendSinglePost(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
});
export default SmallDeviceForm;
