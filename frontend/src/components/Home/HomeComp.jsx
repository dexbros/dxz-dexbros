/** @format */

import React from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import MainLayout from "../../layouts/main-layout.component";
import PostForm from "../../components/postForm/postForm.component";
import {
  newPosts,
  updatePost,
  putPostsLast,
} from "../../redux/post/post.actions";
import { setPageType } from "../../redux/page/page.actions";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProfileModal from "../../components/modal/ProfileModal";
import UpdateProfile from "../../components/ProfileForm/UpdateProfile";
import Interests from "../../components/ProfileForm/Interests";
import Suggestion from "../../components/ProfileForm/Suggestion";
import UploadImage from "../ProfileForm/UploadImage";
// import "./home.css";

const HomePage = ({ user, token, setPageType }) => {
  const { t } = useTranslation(["common"]);
  const [openFormModal, setOpenFormModal] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobilescrolled, setMobileScrolled] = React.useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    // console.log(offset)
    if (offset > 280) {
      setScrolled(true);
    } else {
      setScrolled(false);
      setMobileScrolled(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  React.useLayoutEffect(() => {
    setPageType("social");
  }, []);

  React.useEffect(() => {
    if (!user.log_un) {
      setOpenFormModal(true);
    } else {
      setOpenFormModal(false);
      setOpenFormModal(false);
    }
  });

  const steps = [
    { title: "Profile Update", component: <UpdateProfile /> },
    { title: "Intereset", component: <Interests /> },
    { title: "Suggestion", component: <Suggestion /> },
    { title: "Image upload", component: <UploadImage /> },
  ];

  return (
    <>
      <div className='home_section_container'>
        {/* Profile modal */}
        {openFormModal && (
          <ProfileModal
            title={
              <div>
                {step === 1 ? (
                  <>Profile Information</>
                ) : step === 2 ? (
                  <>Interestes</>
                ) : (
                  <>{step === 3 ? <>Suggestion</> : <>Upload image</>}</>
                )}
              </div>
            }
            className={
              step === 1
                ? "step1"
                : step === 2
                ? "step2"
                : step === 3
                ? "step3"
                : "step4"
            }
            body={
              <>
                {step === 1 ? (
                  <UpdateProfile setStep={setStep} />
                ) : step === 2 ? (
                  <Interests
                    setStep={setStep}
                    setOpenFormModal={setOpenFormModal}
                  />
                ) : step === 3 ? (
                  <Suggestion
                    setStep={setStep}
                    setOpenFormModal={setOpenFormModal}
                  />
                ) : (
                  <UploadImage
                    setStep={setStep}
                    setOpenFormModal={setOpenFormModal}
                  />
                )}
              </>
            }
            footer='Footer'
          />
        )}

        {/* Post form section */}
        {/* <PostForm /> */}

        {/* Home page nested routes */}
        <div className={scrolled ? "stick_home_navbar" : "home_navbar"}>
          <li className='nav_link'>
            <NavLink
              to={`/`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("home")}
            </NavLink>
          </li>

          <li className='nav_link'>
            <NavLink
              to={`/activity`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("activity")}
            </NavLink>
          </li>

          <li className='nav_link'>
            <NavLink
              to={`/trending`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("trending")}
            </NavLink>
          </li>

          <li className='nav_link'>
            <NavLink
              to={`/news`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("news")}
            </NavLink>
          </li>
        </div>

        <div
          className={
            mobilescrolled ? "sticky_mobile_home_navbar" : "mobile_home_navbar"
          }>
          <li className='nav_link'>
            <NavLink
              to={`/`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("home")}
            </NavLink>
          </li>

          <li className='nav_link'>
            <NavLink
              to={`/activity`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("activity")}
            </NavLink>
          </li>

          <li className='nav_link'>
            <NavLink
              to={`/trending`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("trending")}
            </NavLink>
          </li>

          <li className='nav_link'>
            <NavLink
              to={`/news`}
              className={({ isActive }) =>
                isActive ? "nav_item active_nav_item" : "nav_item"
              }>
              {t("news")}
            </NavLink>
          </li>
        </div>

        <Outlet />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
