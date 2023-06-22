/** @format */

import React from "react";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiFillRedditCircle,
  AiFillTwitterCircle,
  AiFillLinkedin,
  AiOutlineLink,
} from "react-icons/ai";
import { BsFacebook, BsArrowLeft } from "react-icons/bs";
import CustomPostFormModal from "../../components/modal/CustomPostForm";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import { useTranslation } from "react-i18next";
import {
  updateUserDisplayName,
  updateUserBio,
  updateUProfileLink,
  updateProfilePrivacy,
} from "../../redux/_user/userSlice";

const ProfileSettings = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const [dob, setDob] = React.useState("");

  const [name, setName] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [bio, setBio] = React.useState("");
  const [isDisableBio, setIsDisableBio] = React.useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [openLink, setOpenLink] = React.useState(false);
  const [link, setLink] = React.useState("");
  const [linkData, setLinkData] = React.useState(null);
  const [correctLink, setCorrectLink] = React.useState(false);
  const [profilePrivacy, setProfilePrivacy] = React.useState(
    user.profile_prv || ""
  );

  const options = [
    { name: "Reddit", index: 1, icon: <AiFillRedditCircle /> },
    { name: "Facebook", index: 2, icon: <BsFacebook /> },
    { name: "Twitter", index: 3, icon: <AiFillTwitterCircle /> },
    { name: "Linkedin", index: 4, icon: <AiFillLinkedin /> },
    { name: "Custom URL", index: 5, icon: <AiOutlineLink /> },
  ];

  const handleChangeName = (e) => {
    setName(e.target.value.slice(0, 30));
  };

  React.useEffect(() => {
    if (!name.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name]);

  // *** Handle update display name
  const handleDisplayNameUpdate = () => {
    setIsDisable(true);
    setName("");
    const data = { name: name, token };
    dispatch(updateUserDisplayName(data));
  };

  const handleChangeBio = (e) => {
    setBio(e.target.value.slice(0, 100));
  };

  React.useEffect(() => {
    if (!bio.trim()) {
      setIsDisableBio(true);
    } else {
      setIsDisableBio(false);
    }
  }, [bio]);

  // *** Handle update Profile bio
  const handleUpdateBio = () => {
    setIsDisableBio(true);
    setBio("");
    const data = { bio: bio, token };
    dispatch(updateUserBio(data));
  };

  const onClose = () => {
    setOpenModal(false);
    setLink("");
    setOpenLink(false);
    setLinkData(null);
    setCorrectLink(false);
  };

  const handleSelectLink = (data) => {
    setOpenLink(true);
    setLinkData(data);
  };

  const handleChangeLink = (e) => {
    setLink(e.target.value);
  };

  React.useEffect(() => {
    if (!link.trim()) {
      setCorrectLink(false);
    } else {
      setCorrectLink(true);
    }
  }, [link]);

  const handleUpdateLink = () => {
    setIsDisable(true);
    const data = { linkName: linkData.name, link: link, token };
    dispatch(updateUProfileLink(data));
    onClose();
  };

  const handleUpdateProfileFollowPrivacy = (value) => {
    setProfilePrivacy(value);
    const data = { profileprivacy: value, token };
    dispatch(updateProfilePrivacy(data));
  };

  return (
    <React.Fragment>
      {!user ? (
        <>Loading....</>
      ) : (
        <div className='tab_page_container'>
          {openModal && (
            <CustomPostFormModal
              onClose={onClose}
              title={
                <React.Fragment>
                  {openLink ? (
                    <div className='link_modal_title'>
                      <button
                        className='link_close_btn'
                        onClick={() => setOpenLink(false)}>
                        <BsArrowLeft />
                      </button>

                      <span className='link_modal_title_text'>
                        {t("Add social links")}
                      </span>
                      {correctLink ? (
                        <button
                          className='link_send_btn'
                          onClick={handleUpdateLink}>
                          {t("Send")}
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className='link_modal_title'>
                      <span className='link_modal_title_text'>
                        {t("Add social links")}
                      </span>
                      <button
                        className='link_close_btn'
                        onClick={() => setOpenModal(false)}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  )}
                </React.Fragment>
              }
              body={
                <React.Fragment>
                  {!openLink ? (
                    <div className='link_modal_body'>
                      {options.map((data) => (
                        <button
                          className='link_icon_btn'
                          key={data.index}
                          onClick={() => handleSelectLink(data)}>
                          <span className={`link_icon ${data.name}`}>
                            {data.icon}
                          </span>
                          <span className='link_name'>{data.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <button className='link_icon_btn' key={linkData.index}>
                        <span className={`link_icon ${linkData.name}`}>
                          {linkData.icon}
                        </span>
                        <span className='link_name'>{linkData.name}</span>
                      </button>
                      <input
                        type='text'
                        placeholder='Enter display name'
                        className='__setting_input'
                        value={link}
                        onChange={(e) => handleChangeLink(e)}
                      />
                    </div>
                  )}
                </React.Fragment>
              }
            />
          )}
          <span className='tab_page_title'>{t("Profile Settings")}</span>

          {/* Name settings */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Display name")}</div>
            <div className='__settings_subtitle'>
              {t("Set a display name. This does not change your username.")}
            </div>
            <input
              type='text'
              placeholder='Enter display name'
              className='__setting_input'
              value={name}
              onChange={(e) => handleChangeName(e)}
            />
            {!isDisable && (
              <button
                className='__settings_update_btn'
                onClick={handleDisplayNameUpdate}>
                {t("Update")}
              </button>
            )}
          </div>

          {/* About settings */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("About")} (optional)</div>
            <div className='__settings_subtitle'>
              {t("A brief description of yourself shown on your profile.")}
            </div>
            <textarea
              type='text'
              placeholder='Enter display name'
              className='__setting_textarea'
              value={bio}
              onChange={(e) => handleChangeBio(e)}
            />
            {!isDisableBio && (
              <button
                className='__settings_update_btn'
                onClick={handleUpdateBio}>
                {t("Update")}
              </button>
            )}
          </div>

          {/* Social links */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Social links")} (5 max)</div>
            <div className='__settings_subtitle'>
              {t("People who visit your profile will see your social links.")}
            </div>
            <button className='add_link_btn' onClick={() => setOpenModal(true)}>
              <AiOutlinePlus className='add_link_icon' /> {t("Add links")}
            </button>
          </div>

          {/* Profile links */}
          <div className='settings_box last_settings_box'>
            <div className='__settings_title'>
              {t("Allow people to follow you")}
            </div>
            <div className='__settings_subtitle'>
              {t(
                "Followers will be notified about posts you make to your profile and see them in their home feed."
              )}
            </div>

            {/* Radio options */}
            <div className='settings_radio_section'>
              <div
                className='radio_btn'
                onClick={() => handleUpdateProfileFollowPrivacy("all")}>
                {profilePrivacy === "all" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("All")}</div>
              </div>

              <div
                className='radio_btn'
                onClick={() => handleUpdateProfileFollowPrivacy("none")}>
                {profilePrivacy === "none" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("None")}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProfileSettings;
