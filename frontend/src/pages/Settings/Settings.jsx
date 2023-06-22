/** @format */

import React, { useState } from "react";
import {
  useParams,
  Link,
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import {
  userLogin,
  userLogout,
  addFollower,
  removeFollower,
  updateUser,
  addToHideUser,
  removeToHideUser,
} from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/main-layout.component";

const Settings = ({
  user,
  token,
  setPageType,
  setUpdatedUser,
  update,
  login,
  logout,
}) => {
  const { t } = useTranslation(["common"]);
  const [openBox1, setOpenBox1] = React.useState(false);
  const [openBox2, setOpenBox2] = React.useState(false);
  const [openBox3, setOpenBox3] = React.useState(false);
  const [openBox4, setOpenBox4] = React.useState(false);
  const [profile, setProfile] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");

  const [opensub1, setOpensub1] = React.useState(false);
  const [opensub2, setOpensub2] = React.useState(false);

  const [opensub3, setOpensub3] = React.useState(false);
  const [opensub4, setOpensub4] = React.useState(false);
  const [opensub5, setOpensub5] = React.useState(false);
  const [opensub6, setOpensub6] = React.useState(false);

  // Following status
  const [followingStatus, setFollowingStatus] = React.useState(user.flwStatus);
  // Follwers Status
  const [followersStatus, setFollowersStatus] = React.useState(user.flwrStatus);
  // About status
  const [aboutStatus, setAboutStatus] = React.useState(user.aboutStatus);
  // Current password
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [collapse1, setCollapse1] = React.useState(false);
  // New password
  const [newPassword, setNewPassword] = React.useState("");
  const [collapse2, setCollapse2] = React.useState(false);
  // Confirm password
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [collapse3, setCollapse3] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);

  const [normalPostStatus, setNormalPostStatus] = React.useState(user.npStatus);
  const [newsPostStatus, setNewsPostStatus] = React.useState(user.newpStatus);
  const [infoPostStatus, setInfoPostStatus] = React.useState(user.infoStatus);
  const [annoPostStatus, setAnnoPostStatus] = React.useState(user.annStatus);

  // *** Fetch user profile
  React.useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}profile/fetch/${user.handleUn}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.handleUn === user.handleUn) {
          login(result, token);
          setProfile(result);
        } else {
          setProfile(result);
        }
      })
      .catch((error) => console.log("error", error));
  }, [token, update]);

  React.useLayoutEffect(() => {
    setPageType("settings");
  });

  const handleUpdatefollowerFollowingPolicy = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      flwStatus: followingStatus,
      flwrStatus: followersStatus,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/privacy/follwer_following`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setOpenBox1(false);
        setUpdatedUser(response.data);
        setOpensub1(false);
        setOpensub2(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleUpdateAboutPrivacy = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      aboutStatus: aboutStatus,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/privacy/about`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setOpenBox2(false);
        setUpdatedUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      setIsDisable(true);
    } else {
      if (confirmPassword === newPassword) {
        setIsDisable(false);
      } else {
        setIsDisable(true);
      }
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleChangePassowrd = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/change/password`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        logout();
      })
      .catch(function (error) {
        console.log(error);
        setErrorMsg(error.response.data.msg);
      });
  };

  return (
    <MainLayout title={t("General Settings")}>
      {profile && (
        <div className='settings_page'>
          {/* Who can see your follower following */}
          <div className='settings_header_section'>
            <div className='settings_header_box'>
              <span className='main_title'>
                {t("Who can see your Follower or Following")}
              </span>
              <br />
              <span className='settings_subheader'>
                {t("Only selected people can see this")}
              </span>
            </div>
            <button
              className={
                openBox1
                  ? "settings_edit_btn close_settings_btn"
                  : "settings_edit_btn"
              }
              onClick={() => setOpenBox1((p) => !p)}>
              {openBox1 ? <>{t("Close")}</> : <>{t("Edit")}</>}
            </button>
          </div>
          {openBox1 && (
            <div className='settings_inner_section'>
              <div className='inner_section'>
                <div
                  className='inner_section_header'
                  onClick={() => setOpensub1((p) => !p)}>
                  {t("Following list")}
                </div>
                {opensub1 && (
                  <div className='options_sections'>
                    {/* Public */}
                    <div className='option_box'>
                      <input
                        type='radio'
                        name='public'
                        value='Public'
                        checked={followingStatus === "Public"}
                        onChange={(e) => setFollowingStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <span class='icon-public'></span>
                        <span className='options_text_scection_header'>
                          Public
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
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
                        checked={followingStatus === "Private"}
                        onChange={(e) => setFollowingStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <span class='icon-private'></span>
                        <span className='options_text_scection_header'>
                          Private
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
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
                        checked={followingStatus === "Following"}
                        onChange={(e) => setFollowingStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <span class='icon-private'></span>
                        <span className='options_text_scection_header'>
                          Following
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
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
                        checked={followingStatus === "Follower"}
                        onChange={(e) => setFollowingStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <span class='icon-private'></span>
                        <span className='options_text_scection_header'>
                          Follower
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
                          Exceprt you and your followers can see you following
                          list
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/*  */}
              <div className='inner_section'>
                <div
                  className='inner_section_header'
                  onClick={() => setOpensub2((p) => !p)}>
                  {t("Following list")}
                </div>
                {opensub2 && (
                  <div className='options_sections'>
                    {/* Public */}
                    <div className='option_box'>
                      <input
                        type='radio'
                        name='public'
                        value='Public'
                        checked={followersStatus === "Public"}
                        onChange={(e) => setFollowersStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <Public className='settings_icon' />
                        <span className='options_text_scection_header'>
                          Public
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
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
                        checked={followersStatus === "Private"}
                        onChange={(e) => setFollowersStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <span class='icon-private'></span>
                        <span className='options_text_scection_header'>
                          Private
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
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
                        checked={followersStatus === "Following"}
                        onChange={(e) => setFollowersStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <span class='icon-private'></span>
                        <span className='options_text_scection_header'>
                          Following
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
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
                        checked={followersStatus === "Follower"}
                        onChange={(e) => setFollowersStatus(e.target.value)}
                      />
                      <div className='options_text_scection'>
                        <span class='icon-private'></span>
                        <span className='options_text_scection_header'>
                          Follower
                        </span>
                        <br />
                        <span className='options_text_scection_text'>
                          Exceprt you and your followers can see you following
                          list
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className='settings_btn_container'>
                <button
                  className='update_btn'
                  onClick={handleUpdatefollowerFollowingPolicy}>
                  {t("Update")}
                </button>
              </div>
            </div>
          )}

          {/* who can see you profile about */}
          <div className='settings_header_section'>
            <div className='settings_header_box'>
              <span className='main_title'>
                {t("Who can see your basic information")}
              </span>
              <br />
              <span className='settings_subheader'>
                {t("Only selected people can see your basic information")}
              </span>
            </div>
            <button
              className={
                openBox2
                  ? "settings_edit_btn close_settings_btn"
                  : "settings_edit_btn"
              }
              onClick={() => setOpenBox2((p) => !p)}>
              {openBox2 ? <>{t("Close")}</> : <>{t("Edit")}</>}
            </button>
          </div>
          {openBox2 && (
            <div className='settings_inner_section'>
              <div className='inner_section'>
                <div className='options_sections'>
                  {/* Public */}
                  <div className='option_box'>
                    <input
                      type='radio'
                      name='public'
                      value='Public'
                      checked={aboutStatus === "Public"}
                      onChange={(e) => setAboutStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <Public className='settings_icon' />
                      <span className='options_text_scection_header'>
                        Public
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={aboutStatus === "Private"}
                      onChange={(e) => setAboutStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Private
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={aboutStatus === "Following"}
                      onChange={(e) => setAboutStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Following
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={aboutStatus === "Follower"}
                      onChange={(e) => setAboutStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Follower
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
                        Exceprt you and your followers can see you following
                        list
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='settings_btn_container'>
                <button
                  className='update_btn'
                  onClick={handleUpdateAboutPrivacy}>
                  {t("Update")}
                </button>
              </div>
            </div>
          )}

          {/* change account password */}
          <div className='settings_header_section'>
            <div className='settings_header_box'>
              <span className='main_title'>{t("Change password")}</span>
              <br />
              <span className='settings_subheader'>
                {t("Change your password at any time")}
              </span>
            </div>
            <button
              className={
                openBox3
                  ? "settings_edit_btn close_settings_btn"
                  : "settings_edit_btn"
              }
              onClick={() => setOpenBox3((p) => !p)}>
              {openBox3 ? <>{t("Close")}</> : <>{t("Edit")}</>}
            </button>
          </div>
          {openBox3 && (
            <div className='settings_inner_section'>
              <div
                className='settings_form'
                onFocus={() => setCollapse1(true)}
                onBlur={() => setCollapse1(false)}>
                {collapse1 && (
                  <label className='form_label_text'>
                    {t("Enter current password")}
                    <span className='require_label'>{t("(*Required)")}</span>
                  </label>
                )}
                <br />
                <input
                  type='password'
                  placeholder={collapse1 ? "" : "Enter current password"}
                  className='collapse_input'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div
                className='settings_form'
                onFocus={() => setCollapse2(true)}
                onBlur={() => setCollapse2(false)}>
                {collapse2 && (
                  <label className='form_label_text'>
                    {t("Enter new password")}
                    <span className='require_label'>{t("(*Required)")}</span>
                  </label>
                )}
                <br />
                <input
                  type='password'
                  placeholder={collapse2 ? "" : "Enter new password"}
                  className='collapse_input'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div
                className='settings_form'
                onFocus={() => setCollapse3(true)}
                onBlur={() => setCollapse3(false)}>
                {collapse3 && (
                  <label className='form_label_text'>
                    {t("Enter confirm password")}
                    <span className='require_label'>{t("(*Required)")}</span>
                  </label>
                )}
                <br />
                <input
                  type='password'
                  placeholder={collapse2 ? "" : "Enter confirm password"}
                  className='collapse_input'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className='settings_btn_container'>
                <button className='update_btn' onClick={handleChangePassowrd}>
                  {t("Update")}
                </button>
              </div>
            </div>
          )}

          {/* change post privacy settings */}
          <div className='settings_header_section'>
            <div className='settings_header_box'>
              <span className='main_title'>{t("Post privacy")}</span>
              <br />
              <span className='settings_subheader'>
                {t(
                  "Your default audience is set to Public. This will be your audience for future posts, but you can always change it for a specific post"
                )}
              </span>
            </div>
            <button
              className={
                openBox4
                  ? "settings_edit_btn close_settings_btn"
                  : "settings_edit_btn"
              }
              onClick={() => setOpenBox4((p) => !p)}>
              {openBox4 ? <>{t("Close")}</> : <>{t("Edit")}</>}
            </button>
          </div>
          {openBox4 && (
            <div className='inner_section'>
              {/* NORMAL POST */}
              <div
                className='inner_section_header'
                onClick={() => setOpensub3((p) => !p)}>
                {t("Normal post")}
              </div>
              {/* Normal Post options */}
              {opensub3 && (
                <div className='options_sections'>
                  {/* Public */}
                  <div className='option_box'>
                    <input
                      type='radio'
                      name='public'
                      value='Public'
                      checked={normalPostStatus === "Public"}
                      onChange={(e) => setNormalPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <Public className='settings_icon' />
                      <span className='options_text_scection_header'>
                        Public
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={normalPostStatus === "Private"}
                      onChange={(e) => setNormalPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Private
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={normalPostStatus === "Following"}
                      onChange={(e) => setNormalPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Following
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={normalPostStatus === "Follower"}
                      onChange={(e) => setNormalPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Follower
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
                        Exceprt you and your followers can see you following
                        list
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* NEWS POST */}
              <div
                className='inner_section_header'
                onClick={() => setOpensub4((p) => !p)}>
                {t("News post")}
              </div>
              {/* News Post options */}
              {opensub4 && (
                <div className='options_sections'>
                  {/* Public */}
                  <div className='option_box'>
                    <input
                      type='radio'
                      name='public'
                      value='Public'
                      checked={newsPostStatus === "Public"}
                      onChange={(e) => setNewsPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <Public className='settings_icon' />
                      <span className='options_text_scection_header'>
                        Public
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={newsPostStatus === "Private"}
                      onChange={(e) => setNewsPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Private
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={newsPostStatus === "Following"}
                      onChange={(e) => setNewsPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Following
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={newsPostStatus === "Follower"}
                      onChange={(e) => setNewsPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Follower
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
                        Exceprt you and your followers can see you following
                        list
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* INFORMATION POST */}
              <div
                className='inner_section_header'
                onClick={() => setOpensub5((p) => !p)}>
                {t("Information post")}
              </div>
              {opensub5 && (
                <div className='options_sections'>
                  {/* Public */}
                  <div className='option_box'>
                    <input
                      type='radio'
                      name='public'
                      value='Public'
                      checked={infoPostStatus === "Public"}
                      onChange={(e) => setInfoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <Public className='settings_icon' />
                      <span className='options_text_scection_header'>
                        Public
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={infoPostStatus === "Private"}
                      onChange={(e) => setInfoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Private
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={infoPostStatus === "Following"}
                      onChange={(e) => setInfoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Following
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={infoPostStatus === "Follower"}
                      onChange={(e) => setInfoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Follower
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
                        Exceprt you and your followers can see you following
                        list
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ANNOUNCEMENT POST */}
              <div
                className='inner_section_header'
                onClick={() => setOpensub6((p) => !p)}>
                {t("Announcement post")}
              </div>
              {opensub6 && (
                <div className='options_sections'>
                  {/* Public */}
                  <div className='option_box'>
                    <input
                      type='radio'
                      name='public'
                      value='Public'
                      checked={annoPostStatus === "Public"}
                      onChange={(e) => setAnnoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <Public className='settings_icon' />
                      <span className='options_text_scection_header'>
                        Public
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={annoPostStatus === "Private"}
                      onChange={(e) => setAnnoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Private
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={annoPostStatus === "Following"}
                      onChange={(e) => setAnnoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Following
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
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
                      checked={annoPostStatus === "Follower"}
                      onChange={(e) => setAnnoPostStatus(e.target.value)}
                    />
                    <div className='options_text_scection'>
                      <span class='icon-private'></span>
                      <span className='options_text_scection_header'>
                        Follower
                      </span>
                      <br />
                      <span className='options_text_scection_text'>
                        Exceprt you and your followers can see you following
                        list
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className='settings_btn_container'>
                <button className='update_btn'>{t("Update")}</button>
              </div>
            </div>
          )}
        </div>
      )}
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
  logout: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
