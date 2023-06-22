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
import HomeComp from "../../components/Home/HomeComp";
import MobileHome from "../../components/Home/MobileHome";
import CustomProfileModal from "../../components/modal/CustomProfileModal";
import "dexbrosicons/style.css";

const HomePage = ({ user, token, setPageType }) => {
  const { t } = useTranslation(["common"]);
  const [openFormModal, setOpenFormModal] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobilescrolled, setMobileScrolled] = React.useState(false);
  const [cOffset, setCOffset] = React.useState(0);

  const handleScroll = () => {
    const offset = window.scrollY;
    setCOffset(offset);
    if (offset > 280) {
      setScrolled(true);
    } else if (offset > 51) {
      setMobileScrolled(true);
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
  ];

  return (
    <MainLayout>
      <div className='social_home_page_container'>
        <MobileHome cOffset={cOffset} />
      </div>
    </MainLayout>
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
