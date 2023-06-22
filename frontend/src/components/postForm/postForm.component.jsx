/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { putPosts } from "../../redux/post/post.actions";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import ModalComp from "../modal/ModalComp";
import CustomPostForm from "../modal/CustomPostForm";
import { ReactComponent as AtTheRateIcon } from "../../Assets/Icons/atthe.svg";
import { ReactComponent as Dropdown } from "../../Assets/Icons/droupdown.svg";
import EmojiData from "../../data/emoji.json";
import CryptoData from "../../data/crypto.json";
import { BiArrowBack } from "react-icons/bi";
import Apiip from "apiip.net";
const apiip = Apiip("28052519-acc6-412a-8469-961eca613fbe");
import { BsCameraVideo } from "react-icons/bs";
// import "../../../local_modules/dexbros-crypto-icons"
import UserAvatar from "../../Assets/userAvatar.webp";
const max_len = 200;
const emojiSearchList = [];

import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "./defaultStyle";
import defaultMentionStyle from "./defaultMentionStyle";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineRight, AiOutlineClose } from "react-icons/ai";
import { BiUserPlus, BiUserCheck } from "react-icons/bi";
import axios from "axios";

function PostForm({ user, token, putPosts }) {
  const { t } = useTranslation(["common"]);
  const [content, setContent] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showLabel, setShowLabel] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [image, setImage] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState("");
  const [oepnGif, setOpenGif] = React.useState(false);
  const [gifs, setGifs] = React.useState("");
  const [limit, setLimit] = React.useState(5);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [isSlide, setIsSlide] = React.useState(false);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [priority, setPriority] = React.useState("All");
  const [check, setCheck] = React.useState(false);
  const [cName, setCName] = React.useState("");
  const [blockId, setBlockId] = React.useState("");
  const [currentCity, setCurrentCity] = React.useState("");
  const [currentCountry, setCurrentCountry] = React.useState("");
  const [openPostPrivacy, setOpenPostPrivacy] = React.useState(false);
  const [openFeeling, setOpenFeeling] = React.useState(false);
  const [postPrivacy, setPostPrivacy] = React.useState("Public");
  const [openPostType, setOpenPostType] = React.useState(false);
  const [typeOfPost, setTypeOfPost] = React.useState("np");
  const [searchListBlock, setSearchListBlock] = React.useState([]);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchKey, setSearchKey] = React.useState("");
  const [emojiSearchList, setEmojiSearchList] = React.useState([]);
  const [showSearchList, setShowSearchList] = React.useState(false);
  const [feeling, setFeeling] = React.useState("");
  const [feelingIcon, setFeelingIcon] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [emojis, setEmojis] = React.useState([]);
  const [openCryptoModal, setOpenCryptoModal] = React.useState(false);
  const [cryptos, setCryptos] = React.useState([]);
  const [cryptoSearch, setCryptoSearch] = React.useState("");
  const [cryptoSearchList, setCryptoSearchList] = React.useState([]);
  const [showCrypotSearchList, setShowCrypotSearchList] = React.useState(false);
  const [isBtnDisable, setIsBtnDisable] = React.useState(true);
  const [err, setErr] = React.useState("");
  const [charCount, setCharCount] = React.useState(0);
  const [errLength, setErrLength] = React.useState("");
  const [imgErr, setImgErr] = React.useState(false);
  const [imgErrMsg, setImgErrMsg] = React.useState("");
  const [openUserList, setOpenUserList] = React.useState(false);
  const [selectUser, setSelectUser] = React.useState("HUMAN");
  const [users, setUsers] = React.useState([]);
  const [openCryptoList, setOpenCryptoList] = React.useState(false);
  const [video, setVideo] = React.useState(false);
  const [previevVideo, setPreviewVideo] = React.useState("");
  const [focusCursor, setFocusCusor] = React.useState(false);
  const [openMore, setOpenMore] = React.useState(false);
  const [moreCredMenu, setMoreCredMenu] = React.useState(false);
  const [selectCred, setSelectCred] = React.useState("");
  const [statusText, setStatusText] = React.useState("");
  const [userLocation, setUserLocation] = React.useState("");
  const [blockList, setBlockList] = React.useState([]);
  const [blockName, setBlockName] = React.useState("");
  const [showMenu, setShowMenu] = React.useState(false);

  const inputRef = React.useRef(null);

  const handleOpenPostModal = () => {
    setIsOpenModal(true);
    // var element = document.createElement("span");
    // element.className = 'span_text';
    // document.getElementById('box').appendChild(element);
  };

  // *** Close post modal
  const onClose = () => {
    setIsOpenModal(false);
  };

  // *** Handle post privacy settings
  const handlePrivacySettings = (value) => {
    setPostPrivacy(value);
    setOpenPostPrivacy(false);
  };

  // *** Handle post category
  const handlePostCatagory = (value) => {
    setTypeOfPost(value);
    menu;
    setOpenPostType(false);
  };

  const containerRef = React.useRef(null);

  // *** Handle input content change
  const handleContentChange = (e) => {
    setContent(e.target.value);
    // if (e.target.value.length > 420) {
    //   setErrLength("Maximum character limit reach");
    //   setCharCount(e.target.value.length);
    // }
    // else {
    //   setCharCount(e.target.value.length);
    //   setErrLength("")
    //   setContent(e.target.innerText);
    //   setCharCount(e.target.value.length);
    //   setOpenUserList(findAllByDisplayValue);
    //   setOpenUserList(false);
    //   setOpenCryptoList(false);

    //   // if (e.target.value.split(" ").includes('@')) {
    //   //   setOpenUserList(true);
    //   //   inputRef.current.focus();
    //   // } else if (e.target.value.split(" ").includes('$')) {
    //   //   setOpenCryptoList(true);
    //   // }
    // }
  };

  // *** Handle close image preview
  const handleCloseImage = () => {
    setImage("");
    setImagePreview("");
    setImgErr(false);
    setImgErrMsg("");
    setVideo(false);
  };

  // *** Close menu
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setOpenEmoji(false);
        setMoreCredMenu(false);
        setOpenUserList(false);
        setOpenCryptoList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // *** Get user current location
  const getUserLocation = async () => {
    const data = await apiip.getLocation();
    console.log(data);
    setCurrentCountry(data.countryName);
    setCurrentCity(data.city);
  };

  // *** Handle image change
  const handleFileChange = (e) => {
    setVideo(false);
    console.log(e.target.files[0].size);
    if (e.target.files[0].size > 1000000) {
      setImgErr(true);
      setImgErrMsg("Maximum image size 1MB");
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    } else {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  // *** Fetching post emoji
  const fetchEmoji = () => {
    setOpenFeeling(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/fetch/emoji?page=${page}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        if (page > 1) {
          var arr = JSON.parse(result);
          setEmojis((prev) => [...prev, ...arr]);
        } else {
          setEmojis(JSON.parse(result));
        }
      })
      .catch((error) => console.log("error", error));
  };

  // *** Scroll handler function
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

  React.useEffect(() => {
    if (openFeeling) {
      fetchEmoji();
    }
  }, [page]);

  // *** Add to feeling to post
  const addToFeelings = (data) => {
    setFeeling(data.description);
    setFeelingIcon(data.emoji);
    setOpenFeeling(false);
  };

  // *** Handle post submit
  const handleSubmit = () => {
    // console.log(content);
    setIsDisable(true);
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", image);
    formdata.append("content", content);
    formdata.append("postOf", typeOfPost);
    formdata.append("privacy", postPrivacy);
    formdata.append("isPaid", check);
    formdata.append("country", currentCountry);
    formdata.append("city", currentCity);
    formdata.append("cName", blockName);
    formdata.append("blockId", blockId);
    formdata.append("feeling", feeling);
    formdata.append("feelingIcon", feelingIcon);
    formdata.append("userLocation", userLocation);
    formdata.append("statusText", statusText);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/create`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setIsLoading(false);
        setIsDisable(true);
        setContent("");
        putPosts([result]);
        setIsLoading(false);
        setImagePreview("");
        setImage("");
        setShowLabel(false);
        setTypeOfPost("np");
        setIsSlide(false);
        setIsOpenModal(false);
        setCheck(false);
        setCName("");
        setTypeOfPost("np");
        setPostPrivacy("Public");
        setErr("");
        setCount("");
        setErrLength("");
        setImgErr(false);
        setImgErrMsg("");
        setImage("");
        setImagePreview("");
      })
      .catch((error) => console.log("error", error));
  };

  // *** Handling reder post button
  React.useEffect(() => {
    if (!content.trim()) {
      // setIsDisable(true);
      if (!imagePreview.trim()) {
        setIsDisable(true);
      } else {
        if (imgErr) {
          setIsDisable(true);
        } else {
          setIsDisable(false);
        }
      }
    } else {
      if (content.length >= 420) {
        setIsDisable(true);
      } else {
        if (imgErr) {
          setIsDisable(true);
        } else {
          setIsDisable(false);
        }
      }
    }
  }, [content, imagePreview]);

  // *** Handle Search user
  const searchUser = () => {
    var target = content.split("@");
    console.log("Call users ");
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/search/user?search=${target[1]}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.user);
        setUsers(result.user);
        // setIsLoading(false);
        return users;
      })
      .catch((error) => console.log("error", error));
  };

  const mensionUsers = (query, callback) => {
    if (!query) return;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/suggestion/list`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        const data = [
          {
            id: "jack",
            display: "Jack",
          },
          {
            id: "john",
            display: "john",
          },
        ];
        const userData = result;
        callback(userData);
      })
      .catch((error) => console.log("error", error));
  };

  const addSpaceAtEndOfBox = (e) => {
    console.log("keypress", e);
    if (e.key == " ") {
      document.getElementById("box").insertAdjacentHTML("beforeend", ` `);
      document.getElementById("box").focus();
    }
  };

  // *** Handle selected user
  const handleSelectUser = (user) => {
    var element = document.createElement("span");
    element.className = "box_name_tag";
    element.appendChild(
      document.createTextNode(`@${user.fn} ${user.ln}${" "}`)
    );
    document.getElementById("box").appendChild(element);
    const id = "somethingUnique";
    setOpenUserList(false);
    document.getElementById("box").focus();
  };

  const fetchCrypto = (query, callback) => {
    if (!query) return;
    console.log("Fetch crypto");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/fetch/crypto`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        const data = result.filter((value) =>
          value.display.toLowerCase().includes(query.toLowerCase())
        );
        callback(data);
      })
      .catch((error) => console.log("error", error));
  };

  const onAdd = () => {
    console.log("Add");
  };

  const handleVideoFileChange = (e) => {
    setVideo(true);
    console.log(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files[0]);
    if (e.target.files[0] / 1048576 > 75) {
      setImage("");
      setImagePreview("");
      setErr("File size is to big to upload");
    } else {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFocus = () => {
    setFocusCusor(true);
  };

  const handleSelectStatus = (value) => {
    console.log(value);
    setSelectCred(value);
    setMoreCredMenu(false);
  };
  const handleAddCred = () => {
    setOpenMore(false);
  };

  const handleCloseCred = () => {
    setOpenMore(false);
    setSelectCred("");
    setStatusText("");
  };

  const handleSearchGroup = () => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${cName}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response.data.block);
        setBlockList(response.data.block);
        // setIsLoading(false);
        // setBlocks(response.data.block);
        // setAllSearchBlock(response.data.block);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddCName = (data) => {
    setBlockName(data.b_n);
    setBlockId(data.b_id);
    setShowMenu(false);
    setCName("");
  };

  const closeCompanyName = () => {
    setBlockName("");
    setBlockId("");
    setShowMenu(false);
    setCheck(false);
    setCName("");
  };

  return (
    <div className='mobile_post_form_container'>
      {/* Post modal form */}
      {isOpenModal && (
        <CustomPostForm
          title={
            <div className='modal_post_title'>
              <div className='title_section_one'>
                <button
                  className='modal_backwrd_icon'
                  onClick={() => setIsOpenModal(false)}>
                  <BiArrowBack />
                </button>
                <span className='header_title_text'>Create post</span>
              </div>
              {!isDisable ? (
                <button
                  className={
                    isDisable
                      ? "modal_post_button disable_modal_post_button"
                      : "modal_post_button"
                  }
                  onClick={handleSubmit}>
                  Post
                </button>
              ) : (
                <React.Fragment>
                  {isLoading && (
                    <button
                      className={
                        isDisable
                          ? "modal_post_button disable_modal_post_button"
                          : "modal_post_button"
                      }>
                      <span class='icon-loading spinner'></span>
                    </button>
                  )}
                </React.Fragment>
              )}
            </div>
          }
          body={
            <div className='modal_body_section'>
              {/*** POST PRIVACY MODAL ***/}
              {openPostPrivacy && (
                <ModalComp
                  onClose={setOpenPostPrivacy}
                  title='Post privacy'
                  body={
                    <div>
                      <div className='privacy_modal_header'>
                        <span className='privacy_header_title'>
                          Select post privacy
                        </span>
                        <br />
                        <span className='privacy_header_subtitle'>
                          By selecting post privacy you can choose who can see
                          this post. By default <b>Public</b> has been set
                        </span>
                      </div>
                      <div className='modal_post_section'>
                        {/* Public */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='public'
                            value='Public'
                            checked={postPrivacy === "Public"}
                            onChange={(e) =>
                              handlePrivacySettings(e.target.value)
                            }
                          />
                          <div
                            className='options_text_scection'
                            id='Public'
                            onClick={(e) => handlePrivacySettings(e.target.id)}>
                            <span class='icon-public'></span>
                            <span
                              className='options_text_scection_header'
                              id='Public'>
                              Public
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='Public'>
                              All other people can see you following list
                            </span>
                          </div>
                        </div>

                        {/* Private */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='private'
                            value='Private'
                            checked={postPrivacy === "Private"}
                            onChange={(e) =>
                              handlePrivacySettings(e.target.value)
                            }
                          />
                          <div
                            className='options_text_scection'
                            id='Private'
                            onClick={(e) => handlePrivacySettings(e.target.id)}>
                            <span class='icon-private' id='Private'></span>
                            <span
                              className='options_text_scection_header'
                              id='Private'>
                              Private
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='Private'>
                              Exceprt you no one can see you following list
                            </span>
                          </div>
                        </div>

                        {/* Following */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='following'
                            value='Following'
                            checked={postPrivacy === "Following"}
                            onChange={(e) =>
                              handlePrivacySettings(e.target.value)
                            }
                          />
                          <div
                            className='options_text_scection'
                            id='Following'
                            onClick={(e) => handlePrivacySettings(e.target.id)}>
                            <span class='icon-private' id='Following'></span>
                            <span
                              className='options_text_scection_header'
                              id='Following'>
                              Following
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='Following'>
                              Exceprt you and your following person can see you
                              following list
                            </span>
                          </div>
                        </div>

                        {/* Followers */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='followers'
                            value='Follower'
                            checked={postPrivacy === "Follower"}
                            onChange={(e) =>
                              handlePrivacySettings(e.target.value)
                            }
                          />
                          <div
                            className='options_text_scection'
                            id='Follower'
                            onClick={(e) => handlePrivacySettings(e.target.id)}>
                            <span class='icon-private' id='Follower'></span>
                            <span
                              className='options_text_scection_header'
                              id='Follower'>
                              Follower
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='Follower'>
                              Exceprt you and your followers can see you
                              following list
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              )}

              {/*** POST CATEGORY MODAL ***/}
              {openPostType && (
                <ModalComp
                  onClose={setOpenPostType}
                  title='Post catagory'
                  body={
                    <div>
                      <div className='privacy_modal_header'>
                        <span className='privacy_header_title'>
                          Select post catagory
                        </span>
                        <br />
                        <span className='privacy_header_subtitle'>
                          By selecting post catagory you can sortout your post
                          according to your post catagory
                        </span>
                      </div>
                      <div className='modal_post_section'>
                        {/* Public */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='typeOf'
                            value='np'
                            checked={typeOfPost === "np"}
                            onChange={(e) => handlePostCatagory(e.target.value)}
                          />
                          <div
                            className='options_text_scection'
                            id='np'
                            onClick={(e) => handlePostCatagory(e.target.id)}>
                            <Public className='settings_icon' id='np' />
                            <span
                              className='options_text_scection_header'
                              id='np'>
                              Normal post
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='np'>
                              All other people can see you following list
                            </span>
                          </div>
                        </div>

                        {/* News */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='typeOf'
                            value='news'
                            checked={typeOfPost === "news"}
                            onChange={(e) => handlePostCatagory(e.target.value)}
                          />
                          <div
                            className='options_text_scection'
                            id='news'
                            onClick={(e) => handlePostCatagory(e.target.id)}>
                            <Private className='settings_icon' id='news' />
                            <span
                              className='options_text_scection_header'
                              id='news'>
                              News post
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='news'>
                              Exceprt you no one can see you following list
                            </span>
                          </div>
                        </div>

                        {/* Following */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='typeOf'
                            value='anc'
                            checked={typeOfPost === "anc"}
                            onChange={(e) => handlePostCatagory(e.target.value)}
                          />
                          <div
                            className='options_text_scection'
                            id='anc'
                            onClick={(e) => handlePostCatagory(e.target.value)}>
                            <span class='icon-private' id='anc'></span>
                            <span
                              className='options_text_scection_header'
                              id='anc'>
                              Announcement Post
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='anc'>
                              Exceprt you and your following person can see you
                              following list
                            </span>
                          </div>
                        </div>

                        {/* Followers */}
                        <div className='option_box'>
                          <input
                            type='radio'
                            name='typeOf'
                            value='info'
                            checked={postPrivacy === "info"}
                            onChange={(e) => handlePostCatagory(e.target.value)}
                          />
                          <div
                            className='options_text_scection'
                            id='info'
                            onClick={(e) => handlePostCatagory(e.target.id)}>
                            <span class='icon-private' id='info'></span>
                            <span
                              className='options_text_scection_header'
                              id='info'>
                              Informative post
                            </span>
                            <br />
                            <span
                              className='options_text_scection_text'
                              id='info'>
                              Exceprt you and your followers can see you
                              following list
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              )}

              {/* Post status */}
              {/* {openMore} */}

              {/*** POST FEELINGS MODAL ***/}
              {openFeeling && (
                <ModalComp
                  title='Feelings'
                  onClose={setOpenFeeling}
                  body={
                    <React.Fragment>
                      {!showSearchList ? (
                        <div
                          className='feelings_container'
                          onScroll={(e) => scrollHandler(e)}>
                          {(emojis || []).length > 0 && (
                            <>
                              {emojis.map((data, index) => (
                                <div
                                  className='feelings_box'
                                  key={index}
                                  onClick={() => addToFeelings(data)}>
                                  <div className='feelings_btn'>
                                    <span className='emoji_icon'>
                                      {data.emoji}
                                    </span>
                                    <span className='emoji_description'>
                                      {data.description}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className='feelings_container'>
                          {/* Search */}
                          {emojiSearchList.map((data, index) => (
                            <div
                              className='feelings_box'
                              key={index}
                              onClick={() => addToFeelings(data)}>
                              <div className='feelings_btn'>
                                <span className='crypto_icon'>
                                  {data.emoji}
                                </span>
                                <span className='emoji_description'>
                                  {data.description}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  }
                />
              )}

              {/* Open User List */}
              {openUserList && !openCryptoList && (
                <div className='modal_user_list_container' ref={menuRef}>
                  <input
                    type='search'
                    placeholder='Search user'
                    className='modal_search_input'
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    onKeyDown={(e) => searchUser(e)}
                    ref={inputRef}
                  />

                  {/* Rendering users list */}
                  <React.Fragment>
                    {(users || []).length > 0 ? (
                      <div className='modal_user_list'>
                        {users.map((user) => (
                          <div
                            className='__modal_user_card'
                            key={user.handleUn}
                            onClick={() => handleSelectUser(user)}>
                            <img
                              src={user.profilePic || UserAvatar}
                              className='__modal_user_avatar'
                            />
                            <span className='__modal_user_name'>
                              {user.fn} {user.ln}
                            </span>
                            <span className='__modal_user_username'>
                              @{user.handleUn}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='modal_user_list empty_users_list'>
                        {t("No user found")}
                      </div>
                    )}
                  </React.Fragment>
                </div>
              )}

              <div className='post_user_info_section'>
                <img
                  src={user.p_i ? user.p_i : UserAvatar}
                  className='modal_user_avatar'
                />
                <div className='post_user_info_box'>
                  <span className='modal_name'>
                    {user.fn} {user.ln}
                  </span>
                  <br />
                  <div className='modal_post_type_btn_container'>
                    <button
                      className='modal_post_type_button'
                      onClick={() => setOpenPostType(true)}>
                      {typeOfPost === "np" ? (
                        <>Normal Post</>
                      ) : (
                        <>
                          {typeOfPost === "news" ? (
                            <>News Post</>
                          ) : (
                            <>
                              {typeOfPost === "anc" ? (
                                <>Announcement Post</>
                              ) : (
                                <>Informative Post</>
                              )}
                            </>
                          )}
                        </>
                      )}
                      <Dropdown className='dropdown_icon' />
                    </button>
                    <button
                      className='modal_post_type_button'
                      onClick={() => setOpenPostPrivacy(true)}>
                      {postPrivacy}
                      <Dropdown className='dropdown_icon' />
                    </button>

                    <div className='post_credential_btn_container'>
                      <button
                        className='post_cread_btn'
                        onClick={() => setOpenMore(true)}>
                        <span className='post_cread_btn_text'>Add more</span>
                        <AiOutlineRight className='post_cread_btn_icon' />
                      </button>
                      {/* {openMore && (
                        <ol className='more_list_container'>
                          <li className='more_list_item'>Add location</li>
                          <li className='more_list_item'>Add Status</li>
                        </ol>
                      )} */}
                    </div>
                  </div>
                  {(currentCity || currentCountry) && (
                    <span className='user_location'>
                      {currentCity}, {currentCountry}
                    </span>
                  )}
                  <div className='selected_feelings_section'>
                    {feelingIcon} {feeling}
                  </div>
                </div>
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

              {/* post modal text area section */}
              <div className='modal_post_textarea_section'>
                <MentionsInput
                  className='mobile_post_form_textarea'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  // placeholder={"Create your post"}
                  a11ySuggestionsListLabel={"Suggested mentions"}
                  onFocus={handleFocus}
                  // style={defaultStyle}
                  style={{ cursor: focusCursor ? "text" : "" }}>
                  <Mention
                    trigger='@'
                    data={mensionUsers}
                    appendSpaceOnAdd={true}
                    markup='@[__display__]'
                    className='mentios_mention'
                    // style={defaultStyle}
                  />
                  <Mention
                    trigger='$'
                    data={fetchCrypto}
                    appendSpaceOnAdd={true}
                    markup='$[__display__]'
                    className='mentios_mention'
                    // style={defaultStyle}
                    onAdd={onAdd}
                  />
                </MentionsInput>
              </div>
              {imagePreview && (
                <React.Fragment>
                  {video ? (
                    <div className='modal_post_image_preview_section'>
                      <video className='preview_modal_image' controls autoplay>
                        <source src={imagePreview} />
                      </video>
                      <button
                        className='modal_close_btn'
                        onClick={handleCloseImage}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  ) : (
                    <div className='modal_post_image_preview_section'>
                      <img src={imagePreview} className='preview_modal_image' />
                      <button
                        className='modal_close_btn'
                        onClick={handleCloseImage}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  )}
                </React.Fragment>
              )}
              {/* post modal checkbox */}
              <div className='post_modal_checkbox_section'>
                <label className='checkbox_label'>
                  <input
                    type='checkbox'
                    className='input_checkbox'
                    checked={check}
                    onChange={() => setCheck((prev) => !prev)}
                  />
                  Is this a paid promotion?
                </label>
                <br />
                {check && (
                  <React.Fragment>
                    <div className='check_area_input'>
                      <input
                        type='text'
                        className='check_text_input'
                        placeholder='Enter company name'
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        onKeyDown={() => handleSearchGroup()}
                        onFocus={() => setShowMenu(true)}
                      />
                      <AtTheRateIcon className='attheRate_icon' />

                      {/* Rendering block */}
                      {showMenu && (
                        <div className='rendering_block'>
                          {(blockList || []).length > 0 ? (
                            <div>
                              {blockList.map((data) => (
                                <div
                                  className='form_block_card'
                                  onClick={() => handleAddCName(data)}>
                                  <img
                                    src={data.g_p_img || UserAvatar}
                                    className='block_card_profile_image'
                                  />
                                  <span className='block_card_profile_name'>
                                    {data.b_n}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className='empty_block'>No block found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )}

                {blockName && (
                  <button className='form_block_tag' onClick={closeCompanyName}>
                    {blockName}
                    <AiOutlineClose className='form_block_tag_close_btn' />
                  </button>
                )}
              </div>

              {/* Modal post button */}
              {openEmoji ? (
                <div ref={menuRef}>
                  <EmojiPicker />
                </div>
              ) : null}
            </div>
          }
          footer={
            <div className='modal_post_buttons_section'>
              <label
                htmlFor='post_file'
                className='__modal_post_icons_button modal_file_icon'>
                <span class='icon-gallery'></span>
                <span className='modal_post_footer_text'>Image</span>
              </label>
              <input
                type='file'
                id='post_file'
                name='postfile'
                className='input_file'
                onChange={(e) => handleFileChange(e)}
                accept='image/*'
                required
              />

              {/* emoji */}
              <button
                className='__modal_post_icons_button'
                onClick={() => setOpenEmoji((p) => !p)}>
                <span class='icon-emogy'></span>
                <span className='modal_post_footer_text'>Emoji</span>
              </button>

              {/* Location */}
              <button
                className='__modal_post_icons_button'
                onClick={getUserLocation}>
                <span class='icon-location'></span>
                <span className='modal_post_footer_text'>Location</span>
              </button>

              {/* Feelings */}
              <button
                className='__modal_post_icons_button'
                onClick={() => fetchEmoji()}>
                <span class='icon-celebration'></span>
                <span className='modal_post_footer_text'>Celebration</span>
              </button>

              {/* Video */}
              <label
                htmlFor='post_video_file'
                className='__modal_post_icons_button modal_file_icon'>
                <BsCameraVideo className='modal_post_footer_icon' />
                <span className='modal_post_footer_text'>Video</span>
              </label>
              <input
                type='file'
                id='post_video_file'
                name='video'
                className='input_file'
                accept='video/*'
                onChange={(e) => handleVideoFileChange(e)}
                required
              />
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
      <img
        src={user.p_i ? user.p_i : UserAvatar}
        className='post_form_user_avatar'
      />
      <textarea
        className='mobile_post_form'
        placeholder='Write something here.....'
        onFocus={() => handleOpenPostModal()}></textarea>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  putPosts: (posts) => dispatch(putPosts(posts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostForm);
