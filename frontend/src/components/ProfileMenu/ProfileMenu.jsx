/** @format */

import React from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  userSearchKey,
  addAll,
  addPeople,
  addBlock,
} from "../../redux/Search/search.actions";
import { userLogout } from "../../redux/user/user.actions";
import UserAvatar from "../../Assets/userAvatar.webp";
import { useTranslation } from "react-i18next";

const ProfileMenu = ({ user, logout }) => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className='profile_menu_section'>
      {/* Profile link */}
      <div
        className='profile_link_section'
        onClick={() => navigate(`/user/profile/${user.handleUn}`)}>
        <img
          src={user.p_i ? user.p_i : UserAvatar}
          className='profile_avatar'
        />
        <div className='profile_name'>
          <span className='logged_username'>
            {user.fn} {user.ln}
          </span>
          <br />
          <span className='menu_demo_text'>See your profile</span>
        </div>
      </div>

      {/* Other links */}
      <div className='other_menu_link'>
        {/* Settings */}
        <button
          className='settings_link'
          onClick={() => navigate(`/profile/info/${user.handleUn}`)}>
          <div className='menu_link'>
            <span>
              <span class='icon-settings'></span>
            </span>
            <span className='menu_link_text'>{t("Settings")}</span>
          </div>
        </button>

        {/* Help */}
        <button className='settings_link'>
          <div className='menu_link'>
            <span>
              <span class='icon-settings'></span>
            </span>
            <span className='menu_link_text'>{t("Help & support")}</span>
          </div>
        </button>

        {/* Logout */}
        <button className='settings_link' onClick={handleLogout}>
          <div className='menu_link'>
            <span>
              <span class='icon-logout_one'></span>
            </span>
            <span className='menu_link_text'>{t("Logout")}</span>
          </div>
        </button>
      </div>
    </div>
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
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userLogout()),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setSearchKey: (data) => dispatch(userSearchKey(data)),
  setAllSearch: (data) => dispatch(addAll(data)),
  setAllSearchPeople: (data) => dispatch(addPeople(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
  setMobileDrawer: (data) => dispatch(setMobileDrawer(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);
