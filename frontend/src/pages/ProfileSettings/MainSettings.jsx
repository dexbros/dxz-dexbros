/** @format */

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

import MainLayout from "../../layouts/main-layout.component";
import SubscriptionSettings from "./Subscription";
import AccountSettings from "./AccountSettings";
import ProfileSetting from "./ProfileSetting";
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";

// toolkit
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectToken,
  selectProfile,
} from "../../redux/_user/userSelectors";
import { setPageType } from "../../redux/_page/pageSlice";
import ProfileSettings from "../../components/SkeletonLoading/ProfileSettings";
import { useTranslation } from "react-i18next";

const MainProfileSettingsPage = () => {
  const { t } = useTranslation(["common"]);
  // toolkit
  const dispatch = useDispatch();
  const isToken = useSelector(selectToken);
  const isUser = useSelector(selectUser);
  const profile = useSelector(selectProfile);

  const { handleUn } = useParams();
  const [activeTab, setActiveTab] = React.useState("account");
  const [isLoadingpage, setIsLoadingpage] = React.useState(false);

  React.useLayoutEffect(() => {
    dispatch(setPageType("profile_settings"));
  });

  useEffect(() => {
    setIsLoadingpage(true);
    setTimeout(() => {
      setIsLoadingpage(false);
    }, 1000);
  }, []);

  return (
    <MainLayout title='Profile settings'>
      {isLoadingpage ? (
        <ProfileSettings />
      ) : (
        <React.Fragment>
          <div className='profile_edit_page'>
            {/* Edit header tab */}
            <div className='profile_edit_tabs_section'>
              <button
                className={
                  activeTab === "account"
                    ? "__profile_edit_btn __profile_edit_btn_active"
                    : "__profile_edit_btn"
                }
                onClick={() => setActiveTab("account")}>
                {t("Account")}
              </button>
              <button
                className={
                  activeTab === "profile"
                    ? "__profile_edit_btn __profile_edit_btn_active"
                    : "__profile_edit_btn"
                }
                onClick={() => setActiveTab("profile")}>
                {t("Profile")}
              </button>
              <button
                className={
                  activeTab === "privacy"
                    ? "__profile_edit_btn __profile_edit_btn_active"
                    : "__profile_edit_btn"
                }
                onClick={() => setActiveTab("privacy")}>
                {t("Privacy")}
              </button>
              <button
                className={
                  activeTab === "security"
                    ? "__profile_edit_btn __profile_edit_btn_active"
                    : "__profile_edit_btn"
                }
                onClick={() => setActiveTab("security")}>
                {t("Security")}
              </button>

              <button
                className={
                  activeTab === "Subscription"
                    ? "__profile_edit_btn __profile_edit_btn_active"
                    : "__profile_edit_btn"
                }
                onClick={() => setActiveTab("Subscription")}>
                {t("Subscription")}
              </button>
            </div>

            <div className='__tab_content_container'>
              {activeTab === "account" ? (
                <AccountSettings />
              ) : (
                <>
                  {activeTab === "profile" ? (
                    <ProfileSetting />
                  ) : (
                    <>
                      {activeTab === "privacy" ? (
                        <PrivacySettings />
                      ) : (
                        <>
                          {activeTab === "security" ? (
                            <NotificationSettings />
                          ) : (
                            <>
                              {activeTab === "Subscription" ? (
                                <SubscriptionSettings />
                              ) : null}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </MainLayout>
  );
};

export default MainProfileSettingsPage;
