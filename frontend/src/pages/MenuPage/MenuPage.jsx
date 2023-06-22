/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType, setScrollAxis } from "../../redux/page/page.actions";
import {
  userLogin,
  addFollower,
  removeFollower,
  updateUser,
  addToHideUser,
  removeToHideUser,
} from "../../redux/user/user.actions";
import MainLayout from "../../layouts/main-layout.component";
import UserAvatar from "../../Assets/userAvatar.webp";
import { SiBlockchaindotcom } from "react-icons/si";
import { GrUserSettings } from "react-icons/gr";
import { CgTrending } from "react-icons/cg";
import "./MenuPage.css";
import { CgFeed } from "react-icons/cg";
import { BsCameraReels } from "react-icons/bs";
import { BiBadgeCheck } from "react-icons/bi";
import { GrGamepad } from "react-icons/gr";

import { userLogout } from "../../redux/user/user.actions";

import { encryptData } from "../../utils/encrypt";

const MenuPage = ({ user, token, setPageType, setScrollAxis, logout }) => {
  const navigate = useNavigate();
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [blocks, setBlocks] = React.useState([]);

  const [hashData, setHashData] = React.useState("");

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, [1500]);
  }, []);

  function handleScroll(e) {
    // console.log(e.target.scrollTop);
    // setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    // console.log(e.target.scrollTop);
    if (prevScrollDirection < currentScrollPos) {
      // setScrollDirection('down');
      console.log("Down");
      setScrollAxis("Down");
    } else {
      // setScrollDirection('up');
      console.log("up");
      setScrollAxis("Up");
    }
    setPrevScrollDirection(currentScrollPos);
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  React.useLayoutEffect(() => {
    setPageType("menu");
  });

  const handleLogout = (e) => {
    e.preventDefault();
    // logout();
    var axios = require("axios");
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/logout`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("**** USER LOGOUT *****");
        logout();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    setIsLoading(true);
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group/my-group`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        setBlocks(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  React.useEffect(() => {
    const data = encryptData(user.handleUn);
    console.log(data);
    setHashData(data);
  }, [user]);

  return (
    <MainLayout title='Menu' onScroll={(e) => handleScroll(e)}>
      <div className='menu_page_container'>
        {/* Profile section */}
        <div
          className='menu_profile_section'
          onClick={() => navigate(`/user/profile/${user.handleUn}`)}>
          <div className='social_profile_menu'>
            <img
              src={
                `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${user.p_i}` ||
                UserAvatar
              }
              className='profile_menu_avatar'
            />
            <div className='menu_user_info'>
              <span className='social_menu_user_name'>
                {user.fn} {user.ln}
              </span>
              <br />
              <span className='social_menu_user_username'>
                @{user.handleUn}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet */}
        {/* <div className='menu_wallet_section'>Wallet</div> */}

        {/* Blocks */}
        {(blocks || []).length > 0 && (
          <React.Fragment>
            <span className='menu_header_text'>All blocks</span>
            <div className='block_menu_section'>
              {blocks.map((data) => (
                <div
                  key={data.b_id}
                  className='menu_block_card'
                  onClick={() => navigate(`/group/${data.g_id}`)}>
                  <img
                    src={data.g_p_img || UserAvatar}
                    className='menu_block_avatar'
                  />
                  <br />
                  <span className='menu_block_name'>{data.g_n}</span>
                </div>
              ))}
              <div
                className='menu_more_link'
                onClick={() => navigate(`/group/my-group`)}>
                See more
              </div>
            </div>
          </React.Fragment>
        )}

        <div className='menu_other_link'>
          <span className='menu_header_text'>All shortcuts</span>

          <div className='menu_sortcut_links'>
            {/* Feed */}
            <div className='link_container' onClick={() => navigate("/")}>
              <CgFeed className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Feed</span>
            </div>

            {/* Reels */}
            {/* <a
              href={`https://creels.websiteclubs.com/?un=${hashData})}`}
              className='link_container'>
              <BsCameraReels className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Reel</span>
            </a> */}

            {/* Trending */}
            {/* <div
              className='link_container'
              onClick={() => navigate("/trending")}>
              <span class='icon-trending_two tab_home_icon'></span>
              <br />
              <span className='menu_link_text'>Trending</span>
            </div> */}

            {/* News Link */}
            {/* <div className='link_container' onClick={() => navigate("/news")}>
              <News className='menu_link_icon custom' />
              <br />
              <span className='menu_link_text'>News</span>
            </div> */}

            {/* News Link */}
            {/* <div className='link_container' onClick={() => navigate("/news")}>
              <Activity className='menu_link_icon custom' />
              <br />
              <span className='menu_link_text'>Activity</span>
            </div> */}

            {/* Block Link */}
            {/* <div className='link_container' onClick={() => navigate(`/group`)}>
              <SiBlockchaindotcom className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Block</span>
            </div> */}

            {/* Blockcast Link */}
            {/* <div
              className='link_container'
              onClick={() => navigate(`/blockcast`)}>
              <Blockcast className='menu_link_icon custom' />
              <br />
              <span className='menu_link_text'>Blockcast</span>
            </div> */}

            {/* Gaming */}
            {/* <a
              className='link_container'
              href={`https://csports.websiteclubs.com/?un=${hashData})}`}>
              <GrGamepad className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Gaming</span>
            </a> */}

            {/* Crypto Gaming */}
            {/* <a
              className='link_container'
              href={`https://ccrypto.websiteclubs.com/?un=${hashData})}`}>
              <GrGamepad className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Crypto Gaming</span>
            </a> */}

            {/* NFT */}
            {/* <div className='link_container' onClick={() => navigate("/nft")}>
              <NFT className='menu_link_icon custom' />
              <br />
              <span className='menu_link_text'>NFT</span>
            </div> */}

            {/* Wallet Link */}
            {/* <a
              className='link_container'
              href={`https://cwallet.websiteclubs.com/?un=${hashData})}`}>
              <Wallet className='menu_link_icon custom' />
              <br />
              <span className='menu_link_text'>Wallet</span>
            </a> */}
          </div>
        </div>

        {/* Account Settings */}
        <div className='menu_account_settings'>
          <span className='menu_header_text'>Account shortcuts</span>
          <div className='menu_sortcut_links'>
            {/* Account settings */}
            <div
              className='link_container'
              onClick={() => navigate(`/profile/info/${user.handleUn}`)}>
              <GrUserSettings className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Account settings</span>
            </div>

            {/* Account badge */}
            <div className='link_container' onClick={() => navigate(`/badge`)}>
              <BiBadgeCheck className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Account badge</span>
            </div>

            {/* Account analytics */}
            <div
              className='link_container'
              onClick={() => navigate(`/profile/analytics/${user.handleUn}`)}>
              <CgTrending className='menu_link_icon' />
              <br />
              <span className='menu_link_text'>Account analytics</span>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <div className='logout_container'>
          <button className='menu_logout_btn' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  following: state.user.following,
  update: state.user.updateUser,
  hide: state.user.hide,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  addFollower: (data) => dispatch(addFollower(data)),
  removeFollower: (data) => dispatch(removeFollower(data)),
  setUpdatedUser: (data) => dispatch(updateUser(data)),
  addToHideUser: (data) => dispatch(addToHideUser(data)),
  removeToHideUser: (data) => dispatch(removeToHideUser(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
  logout: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage);
