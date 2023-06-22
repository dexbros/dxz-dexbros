/** @format */

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import { useTranslation } from "react-i18next";
import { updateUserPassword } from "../../redux/_user/userSlice";

const NotificationSettings = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isDisable, setisDisable] = React.useState(true);
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

  const handleUpdatePassword = () => {
    setisDisable(true);
    const data = {
      currentPassword: oldPassword,
      newPassword: newPassword,
      token,
    };
    dispatch(updateUserPassword(data));
  };

  React.useEffect(() => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      setisDisable(true);
    } else {
      setisDisable(false);
    }
  }, [oldPassword, newPassword]);
  return (
    <React.Fragment>
      <div className='tab_page_container'>
        <span className='tab_page_title'>{t("Change password")}</span>

        {/* Name settings */}
        <div className='settings_box'>
          {/* <div className='__settings_title'>Change account password</div> */}
          <div className='__settings_subtitle'>
            {/* Set a display name. This does not change your username. */}
          </div>
          <input
            type='password'
            placeholder='Enter old password'
            className='__setting_input'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <br />
          <input
            type='password'
            placeholder='Enter new password'
            className='__setting_input'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {!isDisable && (
            <button
              className='__settings_update_btn'
              onClick={handleUpdatePassword}>
              {t("Update")}
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default NotificationSettings;
