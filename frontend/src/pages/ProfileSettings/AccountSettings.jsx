/** @format */

import React from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CountryData from "../../data/country.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiFillCaretDown } from "react-icons/ai";

import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectToken,
  selectProfile,
} from "../../redux/_user/userSelectors";
import { setPageType } from "../../redux/_page/pageSlice";
import ProfileSettings from "../../components/SkeletonLoading/ProfileSettings";
import { useTranslation } from "react-i18next";
import {
  updateUserGender,
  updateUserLanguage,
  updateUserCountry,
  updateUserBirthday,
} from "../../redux/_user/userSlice";

const AccountSettings = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const [dob, setDob] = React.useState("");

  // *** Handle update profile gender
  const handleUpdateGender = (value) => {
    const data = { gender: value, token };
    dispatch(updateUserGender(data));
  };

  // *** Handle update profile language
  const handleUpdateLanguage = (value) => {
    const data = { language: value, token };
    dispatch(updateUserLanguage(data));
  };

  // *** Handle update profile language
  const handleUpdateCountry = (value) => {
    const data = { country: value, token };
    dispatch(updateUserCountry(data));
  };

  // *** Handle update profile language
  const handleUpdateDOB = (value) => {
    const data = { dob: value, token };
    dispatch(updateUserBirthday(data));
  };

  return (
    <React.Fragment>
      {user && (
        <div className='tab_page_container'>
          <span className='tab_page_title'>{t("Account Settings")}</span>

          {/* Gender settings */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Gender")}</div>
            <div className='__settings_subtitle'>
              {t(
                "This information may be used to improve your recommendation and ads"
              )}
            </div>

            {/* Gender menu */}
            <Menu
              menuButton={
                <MenuButton className={"__settings_menu_btn"}>
                  <span>
                    {user.gen ? <>{user.gen}</> : <>{t("Select gender")}</>}
                  </span>
                  <AiFillCaretDown className='menu_icon' />
                </MenuButton>
              }>
              <MenuItem
                className='_settings_menu_item'
                onClick={() => handleUpdateGender("Male")}>
                {t("Male")}
              </MenuItem>
              <MenuItem
                className='_settings_menu_item'
                onClick={() => handleUpdateGender("Female")}>
                {t("Female")}
              </MenuItem>
              <MenuItem
                className='_settings_menu_item'
                onClick={() => handleUpdateGender("Non-Binary")}>
                {t("Non-Binary")}
              </MenuItem>
              <MenuItem
                className='_settings_menu_item'
                onClick={() => handleUpdateGender("I prefer not to say")}>
                {t("I prefer not to say")}
              </MenuItem>
            </Menu>
          </div>

          {/* Language settings */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Language")}</div>
            <div className='__settings_subtitle'>
              {t(
                "Select the language you'd like to experience thr website interface in."
              )}
            </div>

            {/* Gender menu */}
            <Menu
              menuButton={
                <MenuButton className={"__settings_menu_btn"}>
                  <span>
                    {user.lan ? <>{user.lan}</> : <>{t("Select language")}</>}
                  </span>
                  <AiFillCaretDown className='menu_icon' />
                </MenuButton>
              }>
              <MenuItem
                className='_settings_menu_item'
                onClick={() => handleUpdateLanguage("English")}>
                {t("English")}
              </MenuItem>
              <MenuItem
                className='_settings_menu_item'
                onClick={() => handleUpdateLanguage("Hindi")}>
                {t("Hindi")}
              </MenuItem>
              <MenuItem
                className='_settings_menu_item'
                onClick={() => handleUpdateLanguage("Bengali")}>
                {t("Bengali")}
              </MenuItem>
            </Menu>
          </div>

          {/* Country settings */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Country")}</div>
            <div className='__settings_subtitle'>
              {t("This is your primary location")}
            </div>

            {/* Gender menu */}
            <Menu
              menuButton={
                <MenuButton className={"__settings_menu_btn"}>
                  <span>
                    {user.con ? <>{user.con}</> : <>{t("Select country")}</>}
                  </span>
                  <AiFillCaretDown className='menu_icon' />
                </MenuButton>
              }>
              {(CountryData || []).length > 0 && (
                <>
                  {CountryData.map((data) => (
                    <MenuItem
                      key={data.code}
                      className='_settings_menu_item'
                      onClick={() => handleUpdateCountry(data.name)}>
                      {data.name}
                    </MenuItem>
                  ))}
                </>
              )}
            </Menu>
          </div>

          <div className='tab_page_container'>
            <span className='tab_page_title'>Select birthday</span>
            <DatePicker
              selected={dob}
              onChange={(date) => handleUpdateDOB(date)}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default AccountSettings;
