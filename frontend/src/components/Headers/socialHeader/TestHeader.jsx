/** @format */

import * as React from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  userSearchKey,
  addAll,
  addPeople,
  addBlock,
} from "../../../redux/Search/search.actions";
import { setMobileDrawer } from "../../../redux/page/page.actions";
import { setNotificationCount } from "../../../redux/notification/notification.actions";
import UserAvatar from "../../../Assets/userAvatar.webp";
import ProfileMenu from "../../ProfileMenu/ProfileMenu";
import { BiMenu } from "react-icons/bi";
import "./TestHeader.css";
import { MdOutlineEmail } from "react-icons/md";
import NotificationComp from "../../NotificationComp/NotificationComp";
import MenuComp from "./MenuComp";
import "dexbrosicons/style.css";
import { scrollAxis } from "../../../redux/_page/pageSelectors";
import { selectToken } from "../../../redux/_user/userSelectors";
import { useSelector, useDispatch } from "react-redux";

let useClickOutside = (handler) => {
  let domNode = React.useRef();
  const [openMenu, setOpenMenu] = React.useState(false);

  React.useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const SocialHeader = ({
  token,
  user,
  setNotificationCount,
  notificationCount,
}) => {
  const axisValue = useSelector(scrollAxis);
  const isToken = useSelector(selectToken);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openNotificationMenu, setOpenNotificationMenu] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    console.log("openMenu useEffect:", openMenu);
  }, [openMenu]);

  const openDropDownMenu = () => {
    console.log("open dropDown:", openMenu);
    console.log("reverse open dropDown:", !openMenu);
    // setOpenMenu((p) => !p);
  };

  const menuRef = React.useRef(null);

  // React.useEffect(() => {
  //   const handler = (event) => {
  //     console.log("menuRef.current:", menuRef.current);
  //     console.log("event.target:", menuRef.current);
  //     if (!menuRef.current.contains(event.target)) {
  //       setOpenMenu(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handler);
  //   return () => {
  //     document.removeEventListener("mousedown", handler);
  //   };
  // }, []);
  let domNode = useClickOutside(() => {
    // setOpenMenu(false);
    setOpenNotificationMenu(false);
  });

  const handleOpenNotification = () => {
    setOpenNotificationMenu((p) => !p);
    // fetchNotification();
    // *** Redirect to notification page
    navigate("/notifications");
  };

  const fetchNotification = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/notifications/fetch/notification/count`,
      headers: {
        Authorization: "Bearer " + isToken,
      },
    };

    axios(config)
      .then(function (response) {
        setNotificationCount(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <>
      <div
        className={
          axisValue === "Up"
            ? "mobile_navbar_section"
            : "hidden_mobile_navbar_section"
        }>
        {/* Logo Section */}
        <div className='navbar_logo'>
          <button className='navbar_logo_btn'>
            {/* <Logo className='navbar_logo_icon' /> */}
            <span className='icon icon-d_icon navbar_logo_icon'></span>
          </button>
        </div>

        {/* Other menu */}
        <div className='__other_menu_section' ref={domNode}>
          {/* Search icon */}
          <button
            className='navbar_icon_btn'
            onClick={() => navigate("/search/page")}>
            {/* <SearchIcon className='navbar_icon' /> */}
            <span class='icon-search_iv'></span>
          </button>

          {/* Notification icon */}
          <button
            className='navbar_icon_btn notification_menu_icon'
            onClick={handleOpenNotification}>
            {/* <Notification className='navbar_icon navbar_noti_icon' /> */}
            <span class='icon-notification_i'></span>
            {notificationCount > 0 && (
              <span className='noti_count'>{notificationCount}</span>
            )}
          </button>

          {/* Message icon */}
          <button
            className='navbar_icon_btn'
            onClick={() => navigate("/normal/chat")}>
            <span class='icon-message_four'></span>
          </button>

          {/* Profile menu */}
          <div className='profile_menu' onClick={() => setOpenMenu(true)}>
            <img
              src={
                user.p_i
                  ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${user.p_i}`
                  : UserAvatar
              }
              className='avatar_menu_btn'
            />
            <BiMenu className='profile_menu_icon' />
          </div>
        </div>
      </div>

      {openMenu && (
        <div className='menu_component'>
          <MenuComp setOpenMenu={setOpenMenu} />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.user.token,
  user: state.user.user,
  allSearch: state.search.all,
  allSearchPost: state.search.searchposts,
  allSearchBlock: state.search.searchblock,
  allSearchPeople: state.search.people,
  search: state.search.search,
  openDrawer: state.page.openDrawer,
  notificationCount: state.notification.notificationCount,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setSearchKey: (data) => dispatch(userSearchKey(data)),
  setAllSearch: (data) => dispatch(addAll(data)),
  setAllSearchPeople: (data) => dispatch(addPeople(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
  setMobileDrawer: (data) => dispatch(setMobileDrawer(data)),
  setNotificationCount: (count) => dispatch(setNotificationCount(count)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SocialHeader);
