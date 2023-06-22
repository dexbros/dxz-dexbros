/** @format */
/** @format */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { putPosts } from "../../../redux/post/post.actions";
import { connect } from "react-redux";
import { userLogout } from "../../../redux/user/user.actions";
import { GrAddCircle, GrGamepad } from "react-icons/gr";
import { BiWalletAlt } from "react-icons/bi";
// import "./SocialDownNavbar.css";
import CustomPostForm from "../../modal/CustomPostForm";

import { BiArrowBack } from "react-icons/bi";
import Apiip from "apiip.net";
const apiip = Apiip("28052519-acc6-412a-8469-961eca613fbe");
import { BsCameraVideo } from "react-icons/bs";
import UserAvatar from "../../../Assets/userAvatar.webp";
import { MentionsInput, Mention } from "react-mentions";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineRight, AiOutlineClose } from "react-icons/ai";

import { useSocket, socket, isSocketConnected } from "../../../socket/socket";
import Compressor from "compressorjs";

const BlockDownNavar = ({ user, logout, axisValue, token, putPosts }) => {
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

  return (
    <div className='down_navbar_container'>
      <button className='down_nav_brn' onClick={() => navigate("/")}>
        <span class='icon-home_two'></span>
        <br />
        <span className='down_nav_icon_text'>Feed</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(BlockDownNavar);
