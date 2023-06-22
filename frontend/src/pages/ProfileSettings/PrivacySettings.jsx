/** @format */

import React from "react";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import { useTranslation } from "react-i18next";
import {
  updatePostPriacy,
  updateProfileViewPrivacy,
  updateMessagePrivacy,
} from "../../redux/_user/userSlice";

const PrivacySettings = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const [postPrivacy, setPostCommentPrivacy] = React.useState(
    user.cmnt_prv || ""
  );
  const [viewProfile, setViewProfile] = React.useState(user.prfl_prv || "");
  const [msgPrivacy, setMsgPrivacy] = React.useState(user.msg_prv || "");

  // *** Handle update user comment
  const handleUpdatePostComment = (value) => {
    setPostCommentPrivacy(value);
    const data = { token, cmnt_prv: value };
    dispatch(updatePostPriacy(data));
  };

  // *** Handle update user profile privacy
  const handleUpdateProfilePrivacy = (value) => {
    setViewProfile(value);
    const data = { prfl_prv: value, token };
    dispatch(updateProfileViewPrivacy(data));
  };

  const handleUpdateMessagePrivacy = (value) => {
    setMsgPrivacy(value);
    const data = { token, msgPrivacy: value };
    dispatch(updateMessagePrivacy(data));
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);
    // myHeaders.append("Content-Type", "application/json");

    // var raw = JSON.stringify({
    //   msgPrivacy: value,
    // });

    // var requestOptions = {
    //   method: "PUT",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow",
    // };

    // fetch(
    //   `${process.env.REACT_APP_URL_LINK}api/users/update/profile/message/privacy`,
    //   requestOptions
    // )
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result);
    //     login(result.user, token);
    //   })
    //   .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      {!user ? (
        <>Loading....</>
      ) : (
        <div className='tab_page_container'>
          <span className='tab_page_title'>{t("Privacy Settings")}</span>

          {/* Post comment privacy */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Post")}</div>
            <div className='__settings_subtitle'>
              {t("Only selected user can comment on your post")}
            </div>

            <div className='radio_section'>
              <div
                className='radio_btn'
                onClick={() => handleUpdatePostComment("all")}>
                {postPrivacy === "all" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("All")}</div>
              </div>

              <div
                className='radio_btn'
                onClick={() => handleUpdatePostComment("flwr")}>
                {postPrivacy === "flwr" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("Followers")}</div>
              </div>

              <div
                className='radio_btn'
                onClick={() => handleUpdatePostComment("none")}>
                {postPrivacy === "none" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("None")}</div>
              </div>
            </div>
            <div className='divider' />
          </div>

          {/* User profile privacy */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Profile")}</div>
            <div className='__settings_subtitle'>
              {t("Only selected user can view your profile")}
            </div>

            <div className='radio_section'>
              <div
                className='radio_btn'
                onClick={() => handleUpdateProfilePrivacy("all")}>
                {viewProfile === "all" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("All")}</div>
              </div>

              <div
                className='radio_btn'
                onClick={() => handleUpdateProfilePrivacy("flwr")}>
                {viewProfile === "flwr" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("Followers")}</div>
              </div>

              <div
                className='radio_btn'
                onClick={() => handleUpdateProfilePrivacy("none")}>
                {viewProfile === "none" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("None")}</div>
              </div>
            </div>
            <div className='divider' />
          </div>

          {/* User profile privacy */}
          <div className='settings_box'>
            <div className='__settings_title'>{t("Message")}</div>
            <div className='__settings_subtitle'>
              {t("Only selected user can send you message")}
            </div>

            <div className='radio_section'>
              <div
                className='radio_btn'
                onClick={() => handleUpdateMessagePrivacy("all")}>
                {msgPrivacy === "all" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("All")}</div>
              </div>

              <div
                className='radio_btn'
                onClick={() => handleUpdateMessagePrivacy("flwr")}>
                {msgPrivacy === "flwr" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("Followers")}</div>
              </div>

              <div
                className='radio_btn'
                onClick={() => handleUpdateMessagePrivacy("none")}>
                {msgPrivacy === "none" ? (
                  <BiRadioCircleMarked className='active_radio' />
                ) : (
                  <BiRadioCircle className='radio_icon' />
                )}
                <div className='radio_label'>{t("None")}</div>
              </div>
            </div>
            <div className='divider' />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default PrivacySettings;
