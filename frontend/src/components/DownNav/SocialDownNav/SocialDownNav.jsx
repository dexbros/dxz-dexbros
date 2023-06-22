/** @format */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { putPosts } from "../../../redux/post/post.actions";
import { connect } from "react-redux";
import { userLogout } from "../../../redux/user/user.actions";
import "./SocialDownNavbar.css";

import { BiArrowBack } from "react-icons/bi";
import Apiip from "apiip.net";
const apiip = Apiip("28052519-acc6-412a-8469-961eca613fbe");

import { useSocket, socket, isSocketConnected } from "../../../socket/socket";
import Compressor from "compressorjs";

const SocialDownNav = ({ user, logout, axisValue, token, putPosts }) => {
  const navigate = useNavigate();
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
  const [compressedFile, setCompressedFile] = React.useState(null);

  const inputRef = React.useRef(null);

  useSocket();

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
    if (e.target.files[0].size > 10000000) {
      console.log("Maximum image size 1MB");
      setImgErr(true);
      setIsBtnDisable(true);
      setImgErrMsg("Maximum image size 1MB");
      // setImagePreview(URL.createObjectURL(e.target.files[0]));
      // setImage(e.target.files[0]);
    } else {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
      const image = e.target.files[0];
      new Compressor(image, {
        quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          // setCompressedFile(res);
          console.log(compressedResult);
        },
      });
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

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };
  return (
    <div className='down_navbar_container'>
      {/* Post modal form */}

      <button className='down_nav_brn' onClick={() => navigate("/group")}>
        <span class='icon-join_blockcast tab_home_icon'></span>
        <br />
        <span className='down_nav_icon_text'>Blockcast</span>
      </button>

      {/* Reels */}
      <button className='down_nav_brn'>
        <span class='icon-reels_one'></span>
        <br />
        <span className='down_nav_icon_text'>Reels</span>
      </button>

      {/* Post create button */}
      <button className='down_nav_brn'>
        <span class='icon-nft_one'></span>
        <br />
        <span className='down_nav_icon_text'>Nft</span>
      </button>

      <button className='down_nav_brn'>
        <span class='icon-gaming'></span>
        <br />
        <span className='down_nav_icon_text'>Gaming</span>
      </button>

      <button className='down_nav_brn'>
        <span class='icon-walet-one tab_home_icon'></span>
        <br />
        <span className='down_nav_icon_text'>Wallet</span>
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  axisValue: state.page.axisValue,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userLogout()),
  putPosts: (posts) => dispatch(putPosts(posts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialDownNav);
